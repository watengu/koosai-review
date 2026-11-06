-- セレクティブクラブ（実在クラブ3件目）を「未公開」で追加する。公開はクラブの確認（プレビュー）が取れてから is_published を true にする。
-- 冪等: 既存行は消して入れ直す（このファイルが唯一の定義）。データは公式サイト実読メモ（~/workspace/koosai-sales/selective-club-research-2026-11-03.md）の事実＋クラブ提供情報（紹介文内で区別）。
-- 物差し: 実在クラブは全軸4.0以上。代表値は入会の入口（ゴールド）でそろえる。

delete from public.item_scores where item_id in (select id from public.items where slug = 'selective-club');
delete from public.links where item_id in (select id from public.items where slug = 'selective-club');
delete from public.check_log where item_id in (select id from public.items where slug = 'selective-club');
delete from public.club_access where item_id in (select id from public.items where slug = 'selective-club');
delete from public.items where slug = 'selective-club';

insert into public.items (
  slug, name, summary, operator_name, official_url, image_url,
  price_join, price_annual, price_per_use, specs, is_published, last_checked_at
) values (
  'selective-club',
  'SELECTIVE CLUB',
  'プロダクション直営の会員制交際クラブです。グラビアアイドル、モデル、タレント、CA、レースクイーン、セクシータレント、AV女優など、エンターテインメント業界で活動する女性を含め、多彩な女性が登録しています（クラブ提供情報）。公式サイトでも、Black・Diamondクラスにはテレビや雑誌で見かけるタレントやモデルが多数在籍すると案内されています。料金は4クラスとも公式サイトで公開されています。入会前に、セッティング料のみで女性1名の紹介を受けられる無料お試しトライアルがあり、支払い前でも一部の在籍女性を確認できます。法人運営のため、請求書・領収書の発行にも対応しています。女性は面接と厳密な審査を経て登録し、全員が身分証明の確認済みです。新規の女性登録は月に20〜50人ペースと公式に案内されており、20代の女性が比較的多い傾向です。入会の申し込みから会員IDの発行までは通常当日中で、セッティングの申し込みはWebから24時間365日可能です。',
  null,
  'https://selective-club.jp',
  null,
  100000, 40000, 30000,
  '{"location":"東京（事務所は非公開）","age_range":"女性18歳以上（入会資格）","age_range_label":"女性会員の年齢層","areas":["東京","大阪","福岡"],"filing_status":"届出済み（東京都営業届出3725号）","fee_classes":"30,000〜100,000円（ゴールド 30,000円／プラチナ 50,000円／ブラック 100,000円）","trial_campaign":"セッティング料のみで始められます（女性1名の紹介。入会金・年会費はかかりません）"}'::jsonb,
  false, '2026-11-03T12:00:00+09:00'
);

insert into public.item_scores (item_id, axis_key, score, source, basis, source_url, checked_at)
select i.id, v.axis_key, v.score, 'editorial', v.basis, 'https://selective-club.jp', date '2026-11-03'
from public.items i, (values
  ('cost_total', 4.6, '年総額（入会金50,000円＋年会費40,000円＋セッティング料30,000円×24回）は810,000円（ゴールド換算）。掲載中の実在クラブの中で最も低い水準です。クラスが上がると総額は上がります。'),
  ('price_transparency', 4.5, '全4クラス（ゴールド／プラチナ／ブラック／ダイヤモンド）の入会金・年会費・セッティング料が公式サイトの料金表に明示され、無料お試しトライアルの費用条件も明記されています。領収書の発行にも対応しています。'),
  ('staff', 4.5, '面談はカフェなど開放的な場所でフォーマルなスタッフが対応し、面談後に入会するかどうかは自由です。支払い前でも一部の在籍女性を確認できる運用が公式に案内されています。'),
  ('speed', 4.7, '入会申請の当日中に会員専用ページのログインIDが発行され、セッティングの結果案内は通常24時間以内です。条件が合えば入会当日の紹介も可能と公式FAQに案内されています。申し込みはWebで24時間365日可能です。'),
  ('member_quality', 4.5, '女性は面接と厳密な審査を経て登録し、全員が身分証明の確認済みです。新規登録は月に20〜50人ペースと公式に案内されています。写真は加工しないよう心がけているとのことです。クラブからは、モデル系の女性の登録実績についての案内も受けています。'),
  ('cancel_policy', 4.0, '男性からの当日キャンセルはセッティング消化扱いであることが、公式のFAQに明記されています。'),
  ('area_coverage', 4.5, '東京を拠点に、地方在住でも登録できます。大阪・福岡の女性が増え、関西・九州でのセッティングにも対応すると公式に案内されています。'),
  ('safety', 4.8, '東京都のデートクラブ営業の届出が受理され、届出番号（3725号）まで公開されています。男女とも入会時に公的書類で本人確認を行い、個人情報を相手や第三者に伝えない運用が公式に明記されています。')
) as v(axis_key, score, basis)
where i.slug = 'selective-club';

insert into public.links (item_id, label, url, kind, is_active, direct)
select id, '公式サイトを見る', 'https://selective-club.jp', 'official', true, true
from public.items where slug = 'selective-club';

insert into public.check_log (item_id, checked_at, note, source_url)
select id, now(), '初回確認: 公式サイト（トップ・LP・男性FAQ・女性会員規約）を一次確認。未公開で投入し、クラブの確認（プレビュー）が取れてから公開する', 'https://selective-club.jp' from public.items where slug = 'selective-club';
