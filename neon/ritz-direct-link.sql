-- 東京Ritzの公式リンクを /go 経由から直接リンクに変更（2026-11-03、Ao 指示）
-- links.direct = true のリンクは詳細ページで遷移先URLへ直接つなぐ（クリック計測を経由しない）。
alter table public.links add column if not exists direct boolean not null default false;
update public.links l
set direct = true
from public.items i
where l.item_id = i.id and i.slug = 'tokyo-ritz' and l.kind = 'official';
