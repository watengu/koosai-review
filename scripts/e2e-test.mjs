// End-to-end write-path test against the running app (port 3100) + Neon.
// Creates one temporary published item + link, posts a review via the API,
// follows /go, verifies rows, then deletes all test data and re-verifies.
// DATABASE_URL from env; never printed.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const BASE = "http://localhost:3100";

const [item] = await sql`
  insert into public.items (slug, name, summary, is_published)
  values ('__e2e_test__', 'E2Eテスト対象', '検証用の一時データ', true)
  returning id`;
const [link] = await sql`
  insert into public.links (item_id, label, url, kind)
  values (${item.id}, '公式サイト', 'https://example.com/', 'official')
  returning id`;
console.log("temp item/link created");

const post = await fetch(`${BASE}/api/reviews`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    item_id: item.id,
    body: "これは接続検証のためのテスト口コミです。本文の長さ条件を満たすために十分な文字数を書いています。",
    axis_ratings: { staff: 5 },
    author_age_range: "40代",
  }),
});
console.log("review POST status:", post.status, JSON.stringify(await post.json()));

const go = await fetch(`${BASE}/go/${link.id}`, { redirect: "manual" });
console.log("/go status:", go.status, "location:", go.headers.get("location"));

const rev = await sql`select status, axis_ratings from public.reviews where item_id = ${item.id}`;
const clk = await sql`select count(*)::int as c from public.clicks where link_id = ${link.id}`;
console.log("review rows:", JSON.stringify(rev), "clicks:", clk[0].c);

await sql`delete from public.clicks where link_id = ${link.id}`;
await sql`delete from public.reviews where item_id = ${item.id}`;
await sql`delete from public.links where id = ${link.id}`;
await sql`delete from public.items where id = ${item.id}`;
const ci = await sql`select count(*)::int as c from public.items`;
const cr = await sql`select count(*)::int as c from public.reviews`;
const cl = await sql`select count(*)::int as c from public.links`;
const cc = await sql`select count(*)::int as c from public.clicks`;
console.log("after cleanup counts:", JSON.stringify({
  items: ci[0].c, reviews: cr[0].c, links: cl[0].c, clicks: cc[0].c,
}));
