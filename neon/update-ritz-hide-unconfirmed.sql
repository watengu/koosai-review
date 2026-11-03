-- 東京Ritz詳細：値が未確認のスペック行を表示しないフラグ（2026-11-03、Ao 指示）
-- 対象は東京Ritzのみ。他クラブの表示には影響しない。
update public.items
set specs = specs || '{"hide_unconfirmed_specs":true}'::jsonb
where slug = 'tokyo-ritz';
