-- 東京Ritz 評価軸「セッティング速度」を新規採点 5.0（2026-11-03、Ao 指示）
-- 根拠は公式の範囲：女性の予定が合えば入会当日でもセッティング可能（公式QA）、
-- 日時・場所の調整はスタッフが速やかに行う（公式 system）。「業界トップクラス」は編集部の評価として明記。
insert into public.item_scores (item_id, axis_key, score, source, basis, source_url, checked_at)
select i.id, 'speed', 5.0, 'editorial',
  '公式QAでは、女性の予定が合えば入会した当日でもセッティングが可能と案内されています。日時と場所の調整はスタッフが速やかに行う体制で（公式）、編集部はこの対応の速さを業界トップクラスと評価します。',
  'https://tokyoritz.com', date '2026-11-03'
from public.items i
where i.slug = 'tokyo-ritz'
on conflict (item_id, axis_key) do update
  set score = excluded.score, basis = excluded.basis, source_url = excluded.source_url, checked_at = excluded.checked_at;
