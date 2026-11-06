-- 南青山Classy（実在クラブ2件目）を追加する。冪等: 既存行は消して入れ直す（このファイルが唯一の定義）。
-- データは公式サイト実読メモ（~/workspace/koosai-sales/minami-aoyama-classy-research-2026-11-03.md）の事実のみ。
-- 物差し: 実在クラブは全軸4.0以上。代表値は入会の入口（ゴールド会員＋Cクラス）でそろえる。

delete from public.item_scores where item_id in (select id from public.items where slug = 'minami-aoyama-classy');
delete from public.links where item_id in (select id from public.items where slug = 'minami-aoyama-classy');
delete from public.check_log where item_id in (select id from public.items where slug = 'minami-aoyama-classy');
delete from public.items where slug = 'minami-aoyama-classy';

insert into public.items (
  slug, name, summary, operator_name, official_url, image_url,
  price_join, price_annual, price_per_use, specs, is_published, last_checked_at
) values (
  'minami-aoyama-classy',
  '南青山Classy',
  '南青山の高級交際クラブ。会員クラス制（ゴールド／プラチナ／VIP／VVIP）を取り、女性もクラス分けされています。写真は加工を一切せず、女性会員は全員が面談と身分証明書の提出を経て登録。対応エリアは東京・札幌・大阪・福岡の4都市です。公式に案内される男性会員像は、資産家・経営者・医師・弁護士などです。',
  null,
  'https://www.club-classy.com',
  null,
  100000, 30000, 30000,
  '{"location":"東京（南青山）","age_range":"女性20歳〜50歳位（応募の目安）","age_range_label":"女性会員の年齢層","areas":["東京","札幌","大阪","福岡"],"filing_status":"届出済み（東京都デートクラブ営業・公式）","fee_classes":"30,000〜80,000円〜（女性のクラスにより：Cクラス 30,000円／Bクラス 40,000円／Aクラス 50,000円／Sクラス 60,000円／SSクラス 70,000円／Vクラス 80,000円〜）","member_rank_access":"会員クラスにより異なります（ゴールド会員はC〜Aクラス／プラチナ会員はC〜SSクラス／VIP会員は全クラス）"}'::jsonb,
  true, '2026-11-03T00:00:00+09:00'
);

insert into public.item_scores (item_id, axis_key, score, source, basis, source_url, checked_at)
select i.id, v.axis_key, v.score, 'editorial', v.basis, 'https://www.club-classy.com', date '2026-11-03'
from public.items i, (values
  ('cost_total', 4.5, '年総額（入会金100,000円＋年会費30,000円＋セッティング費30,000円×24回）は850,000円。会員クラスや女性のクラスが上がると総額は上がります。'),
  ('price_transparency', 4.5, '会員クラス別の入会金・年会費と、女性のクラス別のセッティング費が、公式サイトの料金表にすべて明示されています。'),
  ('staff', 4.5, '入会前の面談が必須で、男性は希望の場所までスタッフが訪問します。女性も面談で要望を聞き取り、ミスマッチを防ぐ運用が公式に書かれています。'),
  ('speed', 4.5, 'セッティングの依頼から平均で数日程度でデートの日程が決まると公式に案内されています。女性は入会後、早ければ即日にデートが決まる場合もあります。'),
  ('member_quality', 4.5, '女性会員は全員が面談を経て登録し、身分証明書の提出が義務付けられています。写真は加工を一切しないと公式に明記され、モデル事務所との提携による現役モデル等の登録もあります。'),
  ('cancel_policy', 4.0, 'セッティング決定後のキャンセルは前日の昼12時までと、女性向けの案内に明記されています。退会は自由と会員規約に定められています。'),
  ('area_coverage', 4.5, '対応エリアは東京・札幌・大阪・福岡の4都市と公式に案内されています。待ち合わせは都内各所のほか、横浜・千葉での実績も案内されています。'),
  ('safety', 4.5, '東京都のデートクラブ営業の届出を行い、許可を得て運営していると公式に明記されています。女性会員に身分証明書の提出を義務付け、個人情報の保護を徹底するとしています。')
) as v(axis_key, score, basis)
where i.slug = 'minami-aoyama-classy';

insert into public.links (item_id, label, url, kind, is_active, direct)
select id, '公式サイトを見る', 'https://www.club-classy.com', 'official', true, true
from public.items where slug = 'minami-aoyama-classy';

insert into public.check_log (item_id, checked_at, note, source_url)
select id, now(), '初回確認: 公式サイト（料金表・入会案内・流れ・FAQ・会員規約・女性向け案内）を一次確認', 'https://www.club-classy.com' from public.items where slug = 'minami-aoyama-classy';
