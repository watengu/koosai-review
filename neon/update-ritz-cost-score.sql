-- 東京Ritz 評価軸「料金の総額」を 3.5 → 4.3 に変更（2026-11-03、Ao 指示）
-- 根拠文（年総額¥957,000・スタンダード換算などの金額）は事実のまま変更しない。
update public.item_scores s
set score = 4.3
from public.items i
where s.item_id = i.id and i.slug = 'tokyo-ritz' and s.axis_key = 'cost_total';
