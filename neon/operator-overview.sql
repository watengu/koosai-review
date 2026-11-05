-- 注意（2026-11-05 セキュリティ修正）: トークンの実値はこのリポジトリに置かない。適用時に SQL 側でランダム生成する。現行の値は DB と運営用リンク集にのみ存在する
-- 運営用ステータス一覧ページのアクセストークン
create table if not exists public.operator_access (
  token text primary key,
  created_at timestamptz not null default now()
);
insert into public.operator_access (token) values (substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48))
on conflict (token) do nothing;
