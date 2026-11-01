-- =====================================================================
-- サンプル（架空）クラブの定義: 唯一の定義場所
-- =====================================================================
-- デモ公開用の架空クラブ 8 件と、その editorial スコアをここに集約する。
--
-- 差し替え手順:
--   1. このファイルのクラブ定義（名前・料金・スペック・スコア）を書き換える
--   2. DATABASE_URL を設定して scripts/apply-sample-clubs.mjs を実行する
--   実行すると、slug が 'sample-' で始まるクラブは DB から丸ごと削除され、
--   このファイルの内容で入れ替わる（スコアも連動して再投入される）。
--
-- 注意:
-- - ここに書くのは架空のクラブだけ。実在の交際クラブのデータは、一次確認の
--   うえで編集部が別途投入すること（このファイルには書かない）。
-- - 削除は cascade のため、サンプルクラブに付いた口コミ・リンク等も消える。
--   実投稿の受付を始めた後は、このスクリプトを流す前に影響を確認すること。
-- - 口コミ（reviews）のサンプル投入は自作自演に当たるため、ここにも書かない。
--   review_avg 軸はスコア行を作らず「データ不足（口コミ収集中）」表示に倒す。
-- - official_url と links は作らない（送客リンクを実在サイトへ向けない）。
-- - specs.filing_status は全件「サンプルデータ」とし、架空である旨を
--   詳細ページでも判別できるようにしている。
-- =====================================================================

-- 既存のサンプルクラブを丸ごと削除（このファイルの内容で入れ替えるため）
delete from public.items where slug like 'sample-%';

insert into public.items
(slug, name, summary, operator_name, official_url,
 price_join, price_annual, price_per_use, specs, is_published, last_checked_at)
values
('sample-lumiere', 'ルミエール倶楽部',
 '銀座に面接サロンを構える、落ち着いた大人のための会員制交際クラブ。厳格な審査と丁寧なコンシェルジュ対応を掲げています。',
 '株式会社ルミエールホールディングス', null,
 550000, 550000, 55000,
 '{"operator":"株式会社ルミエールホールディングス","location":"東京（銀座）","member_count":"約6,500名","age_range":"女性20代〜30代中心","areas":["東京","大阪","名古屋","福岡"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now()),
('sample-sogetsu', '倶楽部蒼月',
 '青山を拠点に、少人数・高品質を掲げる交際クラブ。登録人数を絞り、セッティングの質を重視する運営です。',
 '蒼月マネジメント株式会社', null,
 330000, 330000, 38500,
 '{"operator":"蒼月マネジメント株式会社","location":"東京（青山）","member_count":"約4,200名","age_range":"女性20代中心","areas":["東京","横浜"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now()),
('sample-vert', 'サロン・ド・ヴェール',
 '六本木拠点の中核価格帯クラブ。料金表が分かりやすく、初めての方でも総額を把握しやすい構成です。',
 '株式会社ヴェール', null,
 220000, 220000, 33000,
 '{"operator":"株式会社ヴェール","location":"東京（六本木）","member_count":"約3,800名","age_range":"女性20代〜40代","areas":["東京","大阪","京都"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now()),
('sample-hakua', 'クラブ白亜',
 '新宿のみに拠点を置く、東京特化の交際クラブ。エリアを絞る代わりに、面接から紹介までの速さを掲げています。',
 '白亜企画株式会社', null,
 165000, 110000, 27500,
 '{"operator":"白亜企画株式会社","location":"東京（新宿）","member_count":"約2,600名","age_range":"女性20代〜30代","areas":["東京"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now()),
('sample-etoile', 'エトワール倶楽部',
 '全国6都市に面接拠点を持つ大手型の交際クラブ。出張先でも利用しやすいエリア網が特徴です。',
 '株式会社エトワール', null,
 110000, 110000, 22000,
 '{"operator":"株式会社エトワール","location":"東京（池袋）","member_count":"約8,900名","age_range":"女性20代〜40代","areas":["東京","大阪","名古屋","札幌","仙台","福岡"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now()),
('sample-amethyst', 'クラブ・アメジスト',
 '関西（大阪・京都・神戸）に特化した交際クラブ。関西在住の方向けに、料金を抑えたコースを用意しています。',
 'アメジスト関西株式会社', null,
 88000, 55000, 19800,
 '{"operator":"アメジスト関西株式会社","location":"大阪（梅田）","member_count":"約3,100名","age_range":"女性20代中心","areas":["大阪","京都","神戸"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now()),
('sample-rin', '凛サロン倶楽部',
 '首都圏をカバーし、入会金を抑えた始めやすい価格設定の交際クラブ。その分、キャンセル条件は厳しめです。',
 '凛サロン株式会社', null,
 55000, 33000, 16500,
 '{"operator":"凛サロン株式会社","location":"東京（渋谷）","member_count":"約5,400名","age_range":"女性20代〜30代","areas":["東京","神奈川","千葉","埼玉"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now()),
('sample-tsukikage', 'クラブ月影',
 '麻布の会員制クラブ。セッティング料は非公開で、面接時に案内される形式です。審査は厳格とされています。',
 '月影興業株式会社', null,
 440000, 440000, null,
 '{"operator":"月影興業株式会社","location":"東京（麻布）","member_count":"約1,900名","age_range":"女性20代〜30代","areas":["東京","大阪"],"filing_status":"サンプルデータ（架空のクラブです）"}'::jsonb,
 true, now());

-- editorial 軸のスコア（review_avg 軸は行を作らない = データ不足として扱う）
insert into public.item_scores (item_id, axis_key, score, source, basis, source_url, checked_at)
select i.id, s.axis_key, s.score, 'editorial', s.basis, null, date '2026-11-01'
from (values
  ('sample-lumiere', 'cost_total', 2.0, '年総額（入会金＋年会費＋セッティング料×24回）は約242万円という設定で、比較対象の中では高額な部類です。'),
  ('sample-lumiere', 'price_transparency', 5.0, '入会金・年会費・セッティング料の3項目すべてが料金表に明示されている設定です。'),
  ('sample-lumiere', 'cancel_policy', 4.5, '前日までのキャンセルは無料、当日はセッティング料の50%という設定です。'),
  ('sample-lumiere', 'area_coverage', 4.0, '東京・大阪・名古屋・福岡の4都市で面接が可能な設定です。'),
  ('sample-lumiere', 'safety', 5.0, '本人確認書類の提出が必須で、届出番号と運営会社情報を公開している設定です。'),
  ('sample-sogetsu', 'cost_total', 2.5, '年総額は約158万円という設定で、高価格帯に位置します。'),
  ('sample-sogetsu', 'price_transparency', 4.5, '3項目は明示されていますが、更新料など別途費用の注記がある設定です。'),
  ('sample-sogetsu', 'cancel_policy', 4.0, '前日までのキャンセルは無料、当日はセッティング料の全額という設定です。'),
  ('sample-sogetsu', 'area_coverage', 2.5, '面接は東京・横浜の2都市のみという設定です。'),
  ('sample-sogetsu', 'safety', 4.5, '本人確認書類の提出が必須で、届出番号を公開している設定です。'),
  ('sample-vert', 'cost_total', 3.0, '年総額は約123万円という設定で、中価格帯に位置します。'),
  ('sample-vert', 'price_transparency', 5.0, '入会金・年会費・セッティング料の3項目すべてが料金表に明示されている設定です。'),
  ('sample-vert', 'cancel_policy', 3.5, '2日前まで無料、前日は50%、当日は全額という設定です。'),
  ('sample-vert', 'area_coverage', 3.5, '東京・大阪・京都の3都市で面接が可能な設定です。'),
  ('sample-vert', 'safety', 4.0, '本人確認書類の提出が必須という設定です。'),
  ('sample-hakua', 'cost_total', 3.5, '年総額は約94万円という設定で、中価格帯の手頃な側に位置します。'),
  ('sample-hakua', 'price_transparency', 4.0, '3項目は明示されていますが、コース別の料金体系がやや分かりにくい設定です。'),
  ('sample-hakua', 'cancel_policy', 4.5, '前日まで無料、当日は50%で、返金規定も明記されている設定です。'),
  ('sample-hakua', 'area_coverage', 1.5, '面接は東京のみという設定です。'),
  ('sample-hakua', 'safety', 4.0, '本人確認書類の提出が必須で、運営会社情報を公開している設定です。'),
  ('sample-etoile', 'cost_total', 4.0, '年総額は約75万円という設定で、手頃な部類に位置します。'),
  ('sample-etoile', 'price_transparency', 5.0, '入会金・年会費・セッティング料の3項目すべてが料金表に明示されている設定です。'),
  ('sample-etoile', 'cancel_policy', 3.0, '前日からキャンセル料が全額発生し、当日分は次回への振替が可能という設定です。'),
  ('sample-etoile', 'area_coverage', 5.0, '東京・大阪・名古屋・札幌・仙台・福岡の6都市で面接が可能な設定です。'),
  ('sample-etoile', 'safety', 3.5, '本人確認は面接時に行う設定です。'),
  ('sample-amethyst', 'cost_total', 4.5, '年総額は約62万円という設定で、手頃な部類に位置します。'),
  ('sample-amethyst', 'price_transparency', 4.5, '3項目は明示されていますが、コース変更時の差額規定に注記がある設定です。'),
  ('sample-amethyst', 'cancel_policy', 4.0, '前日までのキャンセルは無料、当日は50%という設定です。'),
  ('sample-amethyst', 'area_coverage', 3.0, '大阪・京都・神戸の関西3都市で面接が可能な設定です。'),
  ('sample-amethyst', 'safety', 4.0, '本人確認書類の提出が必須という設定です。'),
  ('sample-rin', 'cost_total', 5.0, '年総額は約48万円という設定で、比較対象の中で最も手頃な部類です。'),
  ('sample-rin', 'price_transparency', 4.0, '3項目は明示されていますが、オプション費用の記載が分かれている設定です。'),
  ('sample-rin', 'cancel_policy', 2.5, '予約確定の時点からキャンセル料が発生する設定です。'),
  ('sample-rin', 'area_coverage', 3.5, '東京・神奈川・千葉・埼玉の首都圏4エリアで面接が可能な設定です。'),
  ('sample-rin', 'safety', 3.5, '本人確認は面接時に行い、運営情報の公開は最小限という設定です。'),
  ('sample-tsukikage', 'cost_total', 1.5, 'セッティング料が非公開のため年総額を算出できず、この軸では低く評価しています。'),
  ('sample-tsukikage', 'price_transparency', 2.0, 'セッティング料が「要問い合わせ」で、料金表に明示されていない設定です。'),
  ('sample-tsukikage', 'cancel_policy', 3.0, '前日は50%、当日は全額のキャンセル料という設定です。'),
  ('sample-tsukikage', 'area_coverage', 2.5, '面接は東京・大阪の2都市のみという設定です。'),
  ('sample-tsukikage', 'safety', 4.5, '本人確認書類の提出が必須で、審査が厳格という設定です。')
) as s(slug, axis_key, score, basis)
join public.items i on i.slug = s.slug;
