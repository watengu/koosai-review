-- 2026-11-01: items に画像スロット（image_url）を追加
alter table public.items add column if not exists image_url text;
