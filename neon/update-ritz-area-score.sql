-- 東京Ritz 評価軸「エリア充実度」を 2.5 → 4.0 に変更（2026-11-03、Ao 指示）
-- 根拠は公式QAの範囲のみ：地方在住でも利用可／交通費実費の負担で可能な場合あり／登録女性は関東近辺が中心。
update public.item_scores s
set score = 4.0,
    basis = '本拠は新宿の1拠点で、登録女性は関東近辺が中心です。一方で、地方在住の方でも利用できると公式QAに明記されており、女性の交通費を実費で負担することで対応可能な場合もあるため、1拠点でも利用できる範囲は関東だけに限られません。'
from public.items i
where s.item_id = i.id and i.slug = 'tokyo-ritz' and s.axis_key = 'area_coverage';
