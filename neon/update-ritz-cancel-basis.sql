-- 東京Ritz キャンセル条件の根拠文を、確認済みの事実だけで組み直す（2026-11-03、Ao 指示）
-- 前日まで無料・当日は紹介料全額（公式）。「未確認」への言及は取り除く。スコア 4.0 は変更しない。
update public.item_scores s
set basis = '前日までのキャンセルは無料、当日は紹介料の全額がキャンセル料となります（公式）。'
from public.items i
where s.item_id = i.id and i.slug = 'tokyo-ritz' and s.axis_key = 'cancel_policy';
