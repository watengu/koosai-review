-- 注意（2026-11-05 セキュリティ修正）: トークンの実値はこのリポジトリに置かない。適用時に SQL 側でランダム生成する。現行の値は DB と運営用リンク集にのみ存在する
-- クラブごとの取り下げURL（2026-11-03、Ao 指示／パッケージ仕様の確定形）
-- club_access: クラブごとの推測できないトークン。takedown_events: 停止・復帰の記録（運営用）。
create table if not exists public.club_access (
  item_id uuid primary key references public.items(id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.takedown_events (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);
insert into public.club_access (item_id, token)
select id, substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48) from public.items where slug = 'tokyo-ritz'
on conflict (item_id) do nothing;
