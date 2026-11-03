-- 東京Ritz キャンセル条件の根拠文を Ao 確定文面に差し替え（2026-11-03、Ao 確認）
-- 事実：当日キャンセルは紹介料の全額が違約金（公式QAに明記）。スコア 4.0 は変更しない。
update public.item_scores s
set basis = '前日までのキャンセルは無料。当日キャンセルは紹介料の全額が違約金と、公式に明記されています。'
from public.items i
where s.item_id = i.id and i.slug = 'tokyo-ritz' and s.axis_key = 'cancel_policy';
