// 取り下げ・復旧の新規イベント検知（運営通知用）
// 使い方: node scripts/check-takedowns.mjs peek   → watermark より新しいイベントを JSON で出す
//         node scripts/check-takedowns.mjs commit → watermark を最新のイベント時刻まで進める
import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const WM_PATH = "/home/hatch/workspace/personal-lane/koosai-club-site/takedown-watermark.json";
const sql = neon(process.env.DATABASE_URL, { fetchOptions: { cache: "no-store" } });
const mode = process.argv[2] ?? "peek";

let lastSeen = "1970-01-01T00:00:00.000Z";
if (existsSync(WM_PATH)) {
  try { lastSeen = JSON.parse(readFileSync(WM_PATH, "utf-8")).last_seen ?? lastSeen; } catch {}
}

const rows = await sql`
  select e.action, e.note, e.created_at, i.name, i.slug
  from public.takedown_events e join public.items i on i.id = e.item_id
  where e.created_at > ${lastSeen}
  order by e.created_at asc`;

if (mode === "commit") {
  const all = await sql`select max(created_at)::text as m from public.takedown_events`;
  const m = all[0]?.m;
  const next = m ? String(m).replace(" ", "T") : lastSeen;
  writeFileSync(WM_PATH, JSON.stringify({ last_seen: next }, null, 2));
  console.log("watermark advanced to", next);
} else {
  console.log(JSON.stringify(rows, null, 2));
}
