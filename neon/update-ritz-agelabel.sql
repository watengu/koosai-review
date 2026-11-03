-- 東京Ritz詳細：年齢層の行名を「女性会員の年齢層」にするためのラベル上書き（2026-11-03、Ao 指示）
-- 値（女性18歳〜40歳位（入会資格））は変更しない。他クラブの表示には影響しない。
update public.items
set specs = specs || '{"age_range_label":"女性会員の年齢層"}'::jsonb
where slug = 'tokyo-ritz';
