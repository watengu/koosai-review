-- クラブ確認用プレビュー（標準運用 2026-11-03〜）: club_access に preview_token を追加し、既存クラブへ発行
alter table public.club_access add column if not exists preview_token text unique;
update public.club_access set preview_token = 'c591b426a4f39a7d598f4519f6e1fcdddef874761d7b5e4c' where item_id in (select id from public.items where slug = 'tokyo-ritz') and preview_token is null;
update public.club_access set preview_token = '9b2c2fef6390e5c254ee1654ba5e9c2f929cde4ef353c5d7' where item_id in (select id from public.items where slug = 'minami-aoyama-classy') and preview_token is null;
