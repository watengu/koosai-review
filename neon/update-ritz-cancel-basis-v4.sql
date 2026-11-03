-- 東京Ritz キャンセル条件の根拠文（最終形、2026-11-03）：金額に触れず、条件が公式に明記されている旨だけを書く。スコア 4.0 は変更しない。
update public.item_scores s
set basis = '前日までのキャンセルは無料です。当日の扱いも含め、キャンセルの条件は公式に明記されています。'
from public.items i
where s.item_id = i.id and i.slug = 'tokyo-ritz' and s.axis_key = 'cancel_policy';
