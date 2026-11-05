-- 注意（2026-11-05 セキュリティ修正）: トークンの実値はこのリポジトリに置かない。適用時に SQL 側でランダム生成する。現行の値は DB と運営用リンク集にのみ存在する
-- 南青山Classy の取り下げ用トークンを発行する（クラブ用＋運営復旧用）
insert into public.club_access (item_id, token, operator_token)
select id, substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48), substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48) from public.items where slug = 'minami-aoyama-classy'
on conflict (item_id) do nothing;
