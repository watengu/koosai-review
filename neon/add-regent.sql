-- リージェント（Ao のクラブ・サンプル掲載）を追加する。冪等: 既存行は消して入れ直す。
-- 設定値は販売デモの config/club.ts が正。物差し: サンプルは全軸4.0以下、総合は最下位になる形。
delete from public.item_scores where item_id in (select id from public.items where slug = 'sample-regent');
delete from public.links where item_id in (select id from public.items where slug = 'sample-regent');
delete from public.check_log where item_id in (select id from public.items where slug = 'sample-regent');
delete from public.items where slug = 'sample-regent';

insert into public.items (
  slug, name, summary, operator_name, official_url, image_url,
  price_join, price_annual, price_per_use, specs, is_published, last_checked_at
) values (
  'sample-regent',
  'リージェント',
  '銀座を拠点とする会員制交際クラブ（サンプル）。面接を経た女性会員と、審査を経た男性会員を、スタッフが間に入ってつなぐ形です。待ち合わせはバーやカフェが推奨され、一次会は30分から90分が目安とされています。コースはスタンダード／VIP／ASKの3つで、オファー料は月内の回数に応じて下がります。',
  null, null, '/images/clubs/sample-regent.jpg',
  30000, 30000, 25000,
  '{"location":"東京（銀座）","areas":["東京"]}'::jsonb,
  true, '2026-11-03T12:00:00+09:00'
);

insert into public.item_scores (item_id, axis_key, score, source, basis, source_url, checked_at)
select i.id, v.axis_key, v.score, 'editorial', v.basis, null, date '2026-11-03'
from public.items i, (values
  ('cost_total', 3.0, '年総額（入会金30,000円＋年会費30,000円＋オファー料25,000円×24回）は660,000円。入会金は抑えられていますが、オファー料が回数で変動するため、総額の見通しは立てにくい設定です。'),
  ('price_transparency', 2.0, 'コース別の料金は示されていますが、ASKコースは金額が個別相談で、お手当も金額帯がクラブ設定とされ、事前に総額を確定できません。'),
  ('staff', 2.5, '申込から前日・当日確認までの流れは示されていますが、スタッフ対応の体制（担当制・対応時間など）は設定からうかがえません。'),
  ('speed', 2.0, 'オファーから日程確定までの所要時間の目安は示されていません。'),
  ('member_quality', 2.5, '女性は面接、男性は審査を経て登録する設定ですが、会員数や女性の年齢層は公表されていません。'),
  ('cancel_policy', 2.0, '男性都合のキャンセルは返金なしで、代替のオファーは1回まで。2度続けてキャンセルした場合は代替の対象外と、条件は厳しめです。'),
  ('area_coverage', 2.0, '対応エリアは銀座・東京のみです。'),
  ('safety', 2.0, '運営者情報は「掲載準備中」とされ、届出の表示もありません（サンプル設定）。')
) as v(axis_key, score, basis)
where i.slug = 'sample-regent';

insert into public.check_log (item_id, checked_at, note, source_url)
select id, now(), 'サンプル掲載: 販売デモ config/club.ts の設定値で登録（Ao 指示）', null from public.items where slug = 'sample-regent';
