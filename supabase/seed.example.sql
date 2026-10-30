-- =====================================================================
-- シード例: 第1号バーティカル（交際クラブ版）の評価軸のみ
-- =====================================================================
-- schema.sql の後に流す。投入されるのは review_axes の定義だけ。
--
--
-- - サンプルの items（実在クラブのデータは一次確認してから編集部が投入する）
-- - サンプルの reviews（口コミのダミー投入は自作自演に当たるため厳禁）
-- weights は設計書でも確定値が示されていないため「仮」の値。
-- 公開前に /method ページの表記と合わせて確定させること。
-- =====================================================================

insert into public.review_axes (key, label, description, weight, max_score, source, sort_order) values
('cost_total', '料金総額', '入会金＋年会費＋セッティング料×想定回数（月2回×12か月）で年総額を算出し採点。公式料金表を一次確認する。', 3, 5, 'editorial', 10), -- 仮: weight
('price_transparency','料金の透明性', '入会金・年会費・セッティング料の3項目を公式サイトで確認できるかを機械的に採点する。', 2, 5, 'editorial', 20), -- 仮: weight
('staff', 'スタッフ対応', '問い合わせ対応・面接時の対応の丁寧さ。実投稿の集計のみで採点する。', 2, 5, 'review_avg', 30), -- 仮: weight
('speed', 'セッティング速度', '登録から初回セッティングまでの速さ・成立率の体感。実投稿の集計。', 2, 5, 'review_avg', 40), -- 仮: weight
('member_quality', '女性会員の質', '会員の層・審査の厳しさ。実投稿の集計と公式の審査フロー情報に基づく。', 2, 5, 'review_avg', 50), -- 仮: weight
('cancel_policy', 'キャンセル/返金条件','キャンセル料、返金可否等の条件を各クラブの規約・免責条項から出典つきで確認し採点する。', 1, 5, 'editorial', 60), -- 仮: weight
('area_coverage', 'エリア充実度', '対応エリア数・主要都市での面接可否を公式情報から一次確認する。', 1, 5, 'editorial', 70), -- 仮: weight
('safety', '安全性・運営体制', 'デートクラブ規制条例の届出、運営会社情報の公開度、本人確認の方法を確認する。届出が確認できないクラブは掲載しない。', 2, 5, 'editorial', 80) -- 仮: weight
on conflict (key) do nothing;

-- items の投入フォーマット例（コメントアウト。実データは一次確認のうえ編集部が投入）
-- insert into public.items
-- (slug, name, summary, operator_name, official_url,
-- price_join, price_annual, price_per_use, specs, is_published, last_checked_at)
-- values
-- ('example-club', '（クラブ名）', '（公式情報に基づく要約。体験談の体裁にしない）',
-- '（運営会社）', 'https://example.com/',
-- 33000, null, 33000,
-- '{"operator":"（運営会社）","location":"東京","age_range":"20代〜40代","areas":["東京","大阪"],"filing_status":"届出確認済（確認日を check_log に記録）"}'::jsonb,
-- true, now());
