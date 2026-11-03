-- links.kind に 'showcase' を追加し、リージェント詳細にデモサイト（見本）へのリンクを付ける
alter table public.links drop constraint if exists links_kind_check;
alter table public.links add constraint links_kind_check check (kind in ('official', 'affiliate', 'showcase'));

delete from public.links where item_id in (select id from public.items where slug = 'sample-regent') and kind = 'showcase';
insert into public.links (item_id, label, url, kind, is_active, direct)
select id, 'デモサイト（見本）を見る', 'https://dating-club-demo.vercel.app', 'showcase', true, true
from public.items where slug = 'sample-regent';
