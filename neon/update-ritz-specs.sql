-- 東京Ritz スペック欄を男性会員システムの形に整えるための追加項目（2026-11-03、Ao 指示）
-- 値はクラブ提供データの範囲のみ。既存の specs（location/age_range/areas/filing_status）は保持する。
update public.items
set specs = specs || '{"fee_classes":"スタンダード 33,000円／プレミアム 44,000円／VIP 55,000円","trial_campaign":"紹介料のみで利用を開始でき、2回目以降の利用で本入会を判断できます","member_rank_access":"全てのランク（スタンダード〜VIP）の女性を紹介可能"}'::jsonb
where slug = 'tokyo-ritz';
