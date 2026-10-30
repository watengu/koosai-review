-- =====================================================================
-- 口コミサイト・デフォルトパッケージ v0.1: Supabase スキーマ
-- =====================================================================
-- ジャンル非依存の汎用設計。設計書（交際クラブ版）の8テーブルを
-- 汎用名に読み替えている。対応表:
--
-- 設計書（交際クラブ版） 本スキーマ（汎用）
-- -------------------------- --------------------------------------
-- clubs items 掲載対象（クラブ/店舗/サービス等）
-- review_axes review_axes 評価軸の定義（そのまま）
-- club_scores item_scores 対象×軸のスコアと根拠
-- reviews reviews 実投稿口コミ（承認制）
-- articles articles コラム・編集部記事
-- links links 公式/送客リンクの管理
-- clicks clicks リンクのクリック計測
-- check_log check_log 情報の最終確認日の履歴
--
-- 方針:
-- - 公開読取は RLS で「公開済みのものだけ」に限定する。
-- - 口コミは承認済み（status='approved')のみ表示。投稿は pending 固定。
-- - 口コミの連絡先・内部メモは anon にカラム単位で見せない。
-- - 書き込み系（編集部作業）は service_role（ダッシュボード/管理処理）前提。
-- - Supabase の新規テーブルは RLS だけでは PostgREST が権限エラー
-- （42501）になるため、GRANT も必ずセットで流すこと。
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
-- contact_email / screening_note / ip_hash は内部用で anon には見せない
-- （カラム単位 GRANT で制御。下部の GRANT 節を参照）。
-- ---------------------------------------------------------------------
create table if not exists public.reviews (
id uuid primary key default gen_random_uuid(),
item_id uuid not null references public.items(id) on delete cascade,
status text not null default 'pending'
check (status in ('pending', 'approved',
...[truncated 11234 chars]