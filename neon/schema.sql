-- =====================================================================
-- 口コミサイト・デフォルトパッケージ v0.1: Neon（Postgres）スキーマ
-- =====================================================================
-- ジャンル非依存の汎用設計。設計書（交際クラブ版）の8テーブルを
-- 汎用名に読み替えている。対応表:
--
-- 設計書（交際クラブ版） 本スキーマ（汎用）
-- -------------------------- --------------------------------------
-- clubs                    items        掲載対象（クラブ/店舗/サービス等）
-- review_axes              review_axes  評価軸の定義（そのまま）
-- club_scores              item_scores  対象×軸のスコアと根拠
-- reviews                  reviews      実投稿口コミ（承認制）
-- articles                 articles     コラム・編集部記事
-- links                    links        公式/送客リンクの管理
-- clicks                   clicks       リンクのクリック計測
-- check_log                check_log    情報の最終確認日の履歴
--
-- Neon 版の方針（旧 Supabase 版からの変更点）:
-- - RLS ポリシー / GRANT は使わない。Neon への接続はサーバ側の
--   DATABASE_URL のみで、ブラウザへは一切出さない。
-- - 公開範囲の制御はアプリ側のクエリ条件で担保する:
--   items / articles は is_published = true のみ、口コミは
--   status = 'approved' のみ、口コミの contact_email /
--   screening_note / ip_hash は公開クエリで SELECT しない
--   （lib/data.ts の各クエリに明示。型 lib/types.ts の PublicReview にも
--   内部カラムは含めない）。
-- - 口コミの投稿はサーバルートが status = 'pending' 固定で INSERT する。
-- - 編集部作業（投入・承認）は Neon の SQL Editor / 管理接続で行う。
-- - 適用方法: Neon コンソールの SQL Editor にこのファイルを流すか、
--   psql "$DATABASE_URL" -f neon/schema.sql で流す。
--
-- 注意（復元区間あり）:
-- 旧 Supabase 版 schema.sql は reviews テーブル定義の途中でファイルが
-- 切断されていたため、reviews の残りカラム以降（articles / links /
-- clicks / check_log / ビュー2本）は、設計書 §6・lib/types.ts・
-- アプリ側コードから復元して補った。「復元」コメントのある区間は
-- 本公開前に人の目で確認すること。
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 共通: updated_at 自動更新
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
new.updated_at = now();
return new;
end;
$$;

-- ---------------------------------------------------------------------
-- items: 掲載対象（設計書の clubs）
-- 金額は「初期費用/ 年額 / 1回あたり」の3点モデルに汎用化している。
-- ジャンル固有のスペックは specs (jsonb) に入れ、表示項目は
-- バーティカル設定の specFields で定義する。
-- 非公開の金額は null のままにする（推測で埋めない：設計書§3）。
-- ---------------------------------------------------------------------
create table if not exists public.items (
id uuid primary key default gen_random_uuid(),
slug text not null unique,
name text not null,
summary text,
operator_name text,
official_url text,
image_url text, -- 画像スロット（2026-11-01 追加。/images/clubs/<slug>.jpg 等）
price_join integer, -- 初期費用（例: 入会金）。非公開は null
price_annual integer, -- 年額費用（例: 年会費）。非公開は null
price_per_use integer, -- 1回あたり（例: セッティング料）。非公開は null
specs jsonb not null default '{}'::jsonb, -- 運営会社/エリア/年齢層 等
is_published boolean not null default false,
last_checked_at timestamptz, -- 最終確認日（鮮度の可視化に使う）
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
);

create trigger items_set_updated_at
before update on public.items
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- review_axes: 評価軸の定義
-- バーティカル設定（config の axes）と key を一致させる。
-- weight は /method ページで公開する採点式の重み。
-- ---------------------------------------------------------------------
create table if not exists public.review_axes (
key text primary key,
label text not null,
description text,
weight numeric not null default 1,
max_score numeric not null default 5,
source text not null default 'editorial'
check (source in ('editorial', 'review_avg')),
sort_order integer not null default 0,
is_active boolean not null default true,
created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- item_scores: 対象×評価軸のスコア（設計書の club_scores）
-- score が null = 「データ不足」。点数がないのに数字がある状態を作らない。
-- source='review_avg' の行は承認済み口コミからの集計値であり、
-- 手書きしない（集計は review_axis_stats ビューから再計算して反映する）。
-- basis（根拠）と source_url（出典）は「根拠の公開」のため必須運用。
-- ---------------------------------------------------------------------
create table if not exists public.item_scores (
id uuid primary key default gen_random_uuid(),
item_id uuid not null references public.items(id) on delete cascade,
axis_key text not null references public.review_axes(key),
score numeric(3,2) check (score is null or (score >= 0 and score <= 5)),
source text not null default 'editorial'
check (source in ('editorial', 'review_avg')),
basis text, -- なぜこの点数か（参照した公式情報・規約条文など）
source_url text, -- 根拠の出典URL
checked_at date, -- このスコアの確認日
created_at timestamptz not null default now(),
updated_at timestamptz not null default now(),
unique (item_id, axis_key)
);

create trigger item_scores_set_updated_at
before update on public.item_scores
for each row execute function public.set_updated_at();

create index if not exists item_scores_item_idx on public.item_scores(item_id);

-- ---------------------------------------------------------------------
-- reviews: 実投稿口コミ（承認制）
-- 運営者・関係者による自作自演の投稿は景表法（ステマ規制・
-- 優良誤認）に触れるため全面禁止。このテーブルは「利用者本人の申告」
-- だけを受け付ける。ダミーデータの投入もしないこと。
-- contact_email / screening_note / ip_hash は内部用。公開クエリ（lib/data.ts）は
-- 公開カラムだけを SELECT するため、ここからは決して読まない。
-- ---------------------------------------------------------------------
create table if not exists public.reviews (
id uuid primary key default gen_random_uuid(),
item_id uuid not null references public.items(id) on delete cascade,
status text not null default 'pending'
check (status in ('pending', 'approved', 'rejected')),
axis_ratings jsonb not null default '{}'::jsonb, -- 軸別評価 {axis_key: 1..5}
body text not null,
author_age_range text, -- 投稿者属性（年代。個人を特定しない粒度）
author_area text, -- 投稿者属性（利用エリア）
used_period text, -- 利用時期
contact_email text, -- 内部用（非公開。削除要請等の連絡用）
screening_note text, -- 内部用（承認審査メモ。非公開）
ip_hash text, -- 内部用（スパム対策。非公開）
created_at timestamptz not null default now(),
approved_at timestamptz,
updated_at timestamptz not null default now()
);

create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create index if not exists reviews_item_idx on public.reviews(item_id);
create index if not exists reviews_status_idx
on public.reviews(status, approved_at desc);

-- ---------------------------------------------------------------------
-- articles: コラム・編集部記事【復元区間】
-- 区分 kind は表示上の明示（編集部調査 / コラム）と対応させる。
-- ---------------------------------------------------------------------
create table if not exists public.articles (
id uuid primary key default gen_random_uuid(),
slug text not null unique,
title text not null,
body text not null,
kind text not null default 'column'
check (kind in ('column', 'editorial')),
item_id uuid references public.items(id) on delete set null,
is_published boolean not null default false,
published_at timestamptz,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
);

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create index if not exists articles_item_idx on public.articles(item_id);

-- ---------------------------------------------------------------------
-- links: 公式/送客リンクの管理【復元区間】
-- URL はページ側に直書きせず、このテーブルで一元管理する。
-- kind='affiliate' は紹介報酬の対象であり、表示側の PR 表記の
-- 要否判定に使う。partner / note は契約主体・案件種別の記録欄。
-- ---------------------------------------------------------------------
create table if not exists public.links (
id uuid primary key default gen_random_uuid(),
item_id uuid references public.items(id) on delete cascade,
label text not null,
url text not null,
kind text not null default 'official'
check (kind in ('official', 'affiliate')),
partner text, -- 契約主体（送客の提携先など）
note text, -- 案件種別・条件のメモ
is_active boolean not null default true,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
);

create trigger links_set_updated_at
before update on public.links
for each row execute function public.set_updated_at();

create index if not exists links_item_idx on public.links(item_id);

-- ---------------------------------------------------------------------
-- clicks: 送客リンクのクリック計測【復元区間】
-- /go/[id] が遷移前に1行記録する。対象別・リンク別の集計が
-- 提携先の成果報告との突合の基礎データになる。
-- ---------------------------------------------------------------------
create table if not exists public.clicks (
id uuid primary key default gen_random_uuid(),
link_id uuid not null references public.links(id) on delete cascade,
referrer text,
user_agent text,
created_at timestamptz not null default now()
);

create index if not exists clicks_link_idx on public.clicks(link_id);
create index if not exists clicks_created_idx on public.clicks(created_at);

-- ---------------------------------------------------------------------
-- check_log: 情報確認の履歴【復元区間】
-- items.last_checked_at の裏付け。データ棚卸し（料金・規約の
-- 公式再確認）のたびに1行残す。
-- ---------------------------------------------------------------------
create table if not exists public.check_log (
id uuid primary key default gen_random_uuid(),
item_id uuid not null references public.items(id) on delete cascade,
checked_at timestamptz not null default now(),
note text, -- 確認内容（料金改定の有無など）
source_url text, -- 出典URL
created_at timestamptz not null default now()
);

create index if not exists check_log_item_idx on public.check_log(item_id);

-- ---------------------------------------------------------------------
-- ビュー【復元区間】
-- review_axis_stats: 承認済み口コミの軸別平均（lib/scoring.ts の
--   averageRatings と同じ計算）。source='review_avg' の item_scores
--   行は、ここから再計算して反映する（手書きしない）。
-- ranking: 公開対象の総合スコア（lib/scoring.ts の computeTotalScore
--   と同じ式: 採点済み軸だけの加重平均を100点満点に正規化）。
-- ---------------------------------------------------------------------
create or replace view public.review_axis_stats as
select
r.item_id,
a.key as axis_key,
round(avg((r.axis_ratings ->> a.key)::numeric), 2) as avg_score,
count(*) as review_count
from public.reviews r
join public.review_axes a on r.axis_ratings ? a.key
where r.status = 'approved'
group by r.item_id, a.key;

create or replace view public.ranking as
select
i.id as item_id,
i.slug,
i.name,
round(
(sum((s.score / a.max_score) * a.weight) / nullif(sum(a.weight), 0) * 100)::numeric,
1
) as total_score,
count(a.key) as scored_axes, -- 採点済み軸数: 有効な軸に一致したスコアのみ数える（scoring.ts の computeTotalScore と同じ定義。count(s.score) だと無効軸のスコアまで数えてしまう）
(
select count(*)
from public.reviews r
where r.item_id = i.id and r.status = 'approved'
) as review_count
from public.items i
left join public.item_scores s
on s.item_id = i.id and s.score is not null
left join public.review_axes a
on a.key = s.axis_key and a.is_active = true
where i.is_published = true
group by i.id, i.slug, i.name;
