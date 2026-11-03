-- 動作確認テスト後の復旧（運営操作）。本番の取り下げではない。
update public.items set is_published = true, updated_at = now() where slug = 'tokyo-ritz';
update public.links set is_active = true where item_id = (select id from public.items where slug = 'tokyo-ritz');
insert into public.takedown_events (item_id, action, note)
select id, 'restore', '動作確認テスト後の復旧（運営）' from public.items where slug = 'tokyo-ritz';
