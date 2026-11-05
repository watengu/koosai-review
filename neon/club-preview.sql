-- 注意（2026-11-05 セキュリティ修正）: トークンの実値はこのリポジトリに置かない。適用時に SQL 側でランダム生成する。現行の値は DB と運営用リンク集にのみ存在する
-- クラブ確認用プレビュー（標準運用 2026-11-03〜）: club_access に preview_token を追加し、既存クラブへ発行
alter table public.club_access add column if not exists preview_token text unique;
update public.club_access set preview_token = substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48) where item_id in (select id from public.items where slug = 'tokyo-ritz') and preview_token is null;
update public.club_access set preview_token = substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48) where item_id in (select id from public.items where slug = 'minami-aoyama-classy') and preview_token is null;
