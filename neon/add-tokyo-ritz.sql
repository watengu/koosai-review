-- =====================================================================
-- 東京Ritz（実在クラブ）の追加: 2026-11-03
-- 根拠は下調べメモ（~workspace/koosai-sales/tokyo-ritz-research-2026-11-03.md）
-- の公式実読＋クラブ提供データのみ。メモに無い数字・評価は入れない。
-- 再実行時は tokyo-ritz の行だけを入れ替える（cascade で scores/links 連動）。
-- =====================================================================

delete from public.items where slug = 'tokyo-ritz';

insert into public.items
(slug, name, summary, operator_name, official_url, image_url,
 price_join, price_annual, price_per_use, specs, is_published, last_checked_at)
values
('tokyo-ritz', '東京Ritz',
 '創業40年以上の老舗高級交際クラブ。新宿駅南口から徒歩6分、女性スタッフが対応します。女性会員は全員が面談後に登録し、写真は無加工で掲載。紹介料のみで始められるお試しキャンペーンがあり、入会した男性は全てのランクの女性を紹介可能です。',
 null, 'https://tokyoritz.com', null,
 110000, 55000, 33000,
 '{"location":"東京（新宿）","age_range":"女性18歳〜40歳位（入会資格）","areas":["東京（関東近辺が中心）"],"filing_status":"届出受理済み（東京都条例・公式確認）"}'::jsonb,
 true, now());

insert into public.item_scores (item_id, axis_key, score, source, basis, source_url, checked_at)
select i.id, s.axis_key, s.score, 'editorial', s.basis, 'https://tokyoritz.com', date '2026-11-03'
from public.items i
join (values
  ('cost_total', 3.5, '年総額（入会金110,000円＋年会費55,000円＋紹介料スタンダード33,000円×24回）は957,000円。紹介料は女性のランクでプレミアム44,000円／VIP55,000円もあり、その場合は総額は上がります。お試しキャンペーンでは紹介料のみで利用を開始できます。'),
  ('price_transparency', 5.0, '入会金・年会費・紹介料（スタンダード33,000円／プレミアム44,000円／VIP55,000円）の全項目と、お試しキャンペーンの条件が公式サイトで公開されています。'),
  ('staff', 5.0, '女性への対応は全て女性スタッフが行うと公式に明記されています。スタッフブログも継続的に更新されています。'),
  ('member_quality', 4.5, '女性会員は全員が面談後に登録され、写真は無加工で掲載。サクラ・ダミーなしと公式に明記されています。男性の入会にも厳格な面接があります。'),
  ('cancel_policy', 4.0, '前日までのキャンセルは無料と公式に明記されています（当日の条件は未確認のため満点にしていません）。'),
  ('area_coverage', 2.5, '拠点は新宿の1か所で、登録女性は関東近辺が中心です。地方在住でも利用可能と公式に案内されています。'),
  ('safety', 5.0, '東京都の条例届出が受理済みで、登録番号（原宿20-036028）を公式サイトに明記しています。創業40年以上の運営実績があります。')
) as s(axis_key, score, basis) on true
where i.slug = 'tokyo-ritz';

insert into public.links (item_id, label, url, kind, is_active)
select i.id, '公式サイトを見る', 'https://tokyoritz.com', 'official', true
from public.items i where i.slug = 'tokyo-ritz';

insert into public.check_log (item_id, checked_at, note, source_url)
select i.id, now(), '公式サイトで料金・届出・お試しキャンペーン・キャンセル条件を確認', 'https://tokyoritz.com'
from public.items i where i.slug = 'tokyo-ritz';
