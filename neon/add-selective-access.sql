-- 注意（2026-11-05 セキュリティ修正）: トークンの実値はこのリポジトリに置かない。適用時に SQL 側でランダム生成する。現行の値は DB と運営用リンク集にのみ存在する
-- セレクティブクラブのトークン類（クラブ用・取り下げ／運営復旧用／確認用プレビュー）
insert into public.club_access (item_id, token, operator_token, preview_token)
select id, substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48), substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48), substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48) from public.items where slug = 'selective-club'
on conflict (item_id) do nothing;
