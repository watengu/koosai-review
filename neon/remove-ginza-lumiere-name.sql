-- 名称訂正に伴い、旧名（銀座ルミエール倶楽部）の行を削除する（同一掲載の名前差し替え）
delete from public.item_scores where item_id in (select id from public.items where slug = 'sample-ginza-lumiere');
delete from public.links where item_id in (select id from public.items where slug = 'sample-ginza-lumiere');
delete from public.check_log where item_id in (select id from public.items where slug = 'sample-ginza-lumiere');
delete from public.club_access where item_id in (select id from public.items where slug = 'sample-ginza-lumiere');
delete from public.items where slug = 'sample-ginza-lumiere';
