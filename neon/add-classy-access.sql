-- 南青山Classy の取り下げ用トークンを発行する（クラブ用＋運営復旧用）
insert into public.club_access (item_id, token, operator_token)
select id, '80f5dda1adad9e94bb5fa9caf56549cbb1d1d2567af37fb0', '33efcb7d5296f959f71eab9f2b4da0787b87421dabaa791e' from public.items where slug = 'minami-aoyama-classy'
on conflict (item_id) do nothing;
