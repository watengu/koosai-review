-- 東京Ritz 公式画像の使用許可（2026-11-03、クラブ側から許可）を受けて image_url を設定
update public.items
set image_url = '/images/clubs/tokyo-ritz.jpg'
where slug = 'tokyo-ritz';
