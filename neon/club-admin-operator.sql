-- 注意（2026-11-05 セキュリティ修正）: トークンの実値はこのリポジトリに置かない。適用時に SQL 側でランダム生成する。現行の値は DB と運営用リンク集にのみ存在する
-- 取り下げURLの漏洩対策（2026-11-03、Ao 指示）：運営専用の復旧トークンを追加する。
-- 取り下げは非表示化のみでデータは保持されるため、漏れて押されても運営が即座に復旧すれば被害は残らない。
alter table public.club_access add column if not exists operator_token text unique;
update public.club_access a
set operator_token = substr(md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text), 1, 48)
from public.items i
where a.item_id = i.id and i.slug = 'tokyo-ritz' and a.operator_token is null;
