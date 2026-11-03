-- Classy の最終確認日が UTC 換算で 11/2 に表示されていたため、JST 正午に直す
update public.items set last_checked_at = '2026-11-03T12:00:00+09:00' where slug = 'minami-aoyama-classy';
