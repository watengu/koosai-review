// コラム第1弾3本を articles に公開する（冪等：slug で消して入れ直す）
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL, { fetchOptions: { cache: "no-store" } });
const files = [
  "/home/hatch/workspace/koosai-sales/columns/01-fee-total-guide.md",
  "/home/hatch/workspace/koosai-sales/columns/03-suspicious-club-checklist.md",
  "/home/hatch/workspace/koosai-sales/columns/05-mens-grooming-checklist.md",
];
for (const f of files) {
  const raw = readFileSync(f, "utf-8");
  const title = raw.match(/タイトル：\s*(.+)/)[1].trim();
  const slug = raw.match(/slug:\s*(\S+)/)[1].trim();
  const body = raw.split("■ 本文ここから")[1].split("■ 本文ここまで")[0].trim();
  await sql`delete from public.articles where slug = ${slug}`;
  await sql`insert into public.articles (slug, title, body, kind, item_id, is_published, published_at)
            values (${slug}, ${title}, ${body}, 'column', null, true, '2026-11-03T12:00:00+09:00')`;
  console.log("published:", slug, title, body.length, "chars");
}
const rows = await sql`select slug, is_published from public.articles order by published_at`;
console.log(rows);
