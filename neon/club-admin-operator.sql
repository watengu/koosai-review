-- 取り下げURLの漏洩対策（2026-11-03、Ao 指示）：運営専用の復旧トークンを追加する。
-- 取り下げは非表示化のみでデータは保持されるため、漏れて押されても運営が即座に復旧すれば被害は残らない。
alter table public.club_access add column if not exists operator_token text unique;
update public.club_access a
set operator_token = 'c9d68f9eba4cc5c43686957f3c0b84fca06e117370830264'
from public.items i
where a.item_id = i.id and i.slug = 'tokyo-ritz' and a.operator_token is null;
