-- 東京Ritz キャンセル条件の根拠文を調整（2026-11-03、Ao 指示）：違約金の額には触れず、条件が公式に明記されている旨だけを書く。スコア 4.0 は変更しない。
update public.item_scores s
set basis = '前日までのキャンセルは無料。当日の扱いも含め、条件が公式に明記されています。'
from public.items i
where s.item_id = i.id and i.slug = 'tokyo-ritz' and s.axis_key = 'cancel_policy';
