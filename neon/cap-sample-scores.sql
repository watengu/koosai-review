-- 物差しルール（2026-11-03、Ao 指示）：実在クラブは全軸4.0以上／サンプル（架空）は全軸4.0以下。
-- サンプル8社の軸スコアで 4.0 を超えるものを 4.0 にそろえる。根拠文は設定の記述で数字と矛盾しないため変更しない。
update public.item_scores s
set score = 4.0
from public.items i
where s.item_id = i.id and i.slug like 'sample-%' and s.score > 4.0;
