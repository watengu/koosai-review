-- セレクティブクラブのトークン類（クラブ用・取り下げ／運営復旧用／確認用プレビュー）
insert into public.club_access (item_id, token, operator_token, preview_token)
select id, '037525a947e6e64d7c1dd24590d51e3e03d2643f8d08c799', '41b6552f9f2e0206a9cf89aba5f4e31c4bd65a2aa7b62367', '1aedd25358251cf217bcf0a26e2d8f9a580f31fecdfc7ab2' from public.items where slug = 'selective-club'
on conflict (item_id) do nothing;
