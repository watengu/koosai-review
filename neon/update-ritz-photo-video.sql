-- 東京Ritz クラブ提供情報の追加（2026-11-03、クラブ申し出・Ao 経由）
-- 1) 写真と実物の差はない旨をクラブ提供情報として明記 2) 女性の動画プロフィールがある旨を事実として記載
-- 評価軸の扱い（動画は評価対象外）は変更しない。スコアも変更しない。
update public.items
set summary = summary || ' クラブからは、写真と実物の差はないとの案内も受けています。女性の動画プロフィールも用意されています。'
where slug = 'tokyo-ritz';

update public.item_scores s
set basis = '女性は全員が面談をしてから登録され、写真は本人のもので加工されません（公式）。クラブからは、写真と実物の差はないとの案内も受けています。女性の動画プロフィールも用意されています。'
from public.items i
where s.item_id = i.id and i.slug = 'tokyo-ritz' and s.axis_key = 'member_quality';
