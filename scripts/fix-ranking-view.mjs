// Re-apply only the corrected ranking view from neon/schema.sql.
// DATABASE_URL from env; never printed.
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const schema = readFileSync(new URL("../neon/schema.sql", import.meta.url), "utf-8");
const start = schema.indexOf("create or replace view public.ranking");
if (start < 0) { console.error("ranking view not found"); process.exit(2); }
const end = schema.indexOf(";", start);
const stmt = schema.slice(start, end);
if (!stmt.includes("count(a.key) as scored_axes")) {
  console.error("fixed expression not present in statement; aborting");
  process.exit(2);
}
const tag = Object.assign([stmt], { raw: [stmt] });
await sql(tag);
const rows = await sql`select pg_get_viewdef('public.ranking'::regclass) as def`;
console.log("view re-applied; def contains count(a.key):", rows[0].def.includes("count(a.key)"));
const r = await sql`select count(*)::int as c from public.ranking`;
console.log("ranking view query ok, rows:", r[0].c);
