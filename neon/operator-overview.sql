-- 運営用ステータス一覧ページのアクセストークン
create table if not exists public.operator_access (
  token text primary key,
  created_at timestamptz not null default now()
);
insert into public.operator_access (token) values ('41301577b4bfc940d84dac4db1d459b9b7647670b075074e')
on conflict (token) do nothing;
