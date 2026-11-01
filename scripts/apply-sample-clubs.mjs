// Apply neon/sample-clubs.sql (fictional sample clubs) to the Neon project
// over HTTPS (the @neondatabase/serverless HTTP driver).
// Running this replaces every item whose slug starts with 'sample-' with the
// definitions in neon/sample-clubs.sql. DATABASE_URL comes from the
// environment; this script never prints it.
// Usage: DATABASE_URL=<redacted>
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(2);
}
const sql = neon(url);

// Execute one raw statement through the tagged-template function
// (@neondatabase/serverless 0.10 has no sql.query for plain text).
function execRaw(stmt) {
  const strings = Object.assign([stmt], { raw: [stmt] });
  return sql(strings);
}

// Split a SQL script into statements on top-level semicolons, respecting
// $$...$$ bodies, single quotes, and -- line comments.
// (Same splitter as scripts/apply-schema.mjs.)
function splitStatements(script) {
  const out = [];
  let buf = "";
  let i = 0;
  let inDollar = false;
  let inQuote = false;
  let inComment = false;
  while (i < script.length) {
    const ch = script[i];
    const two = script.slice(i, i + 2);
    if (inComment) {
      buf += ch;
      if (ch === "\n") inComment = false;
      i += 1;
      continue;
    }
    if (inDollar) {
      buf += ch;
      if (two === "$$") {
        buf += script[i + 1];
        i += 2;
        inDollar = false;
        continue;
      }
      i += 1;
      continue;
    }
    if (inQuote) {
      buf += ch;
      if (ch === "'") {
        if (script[i + 1] === "'") {
          buf += script[i + 1];
          i += 2;
          continue;
        }
        inQuote = false;
      }
      i += 1;
      continue;
    }
    if (two === "--") inComment = true;
    else if (two === "$$") {
      inDollar = true;
      buf += two;
      i += 2;
      continue;
    } else if (ch === "'") inQuote = true;
    else if (ch === ";") {
      const stmt = buf.trim();
      if (stmt) out.push(stmt);
      buf = "";
      i += 1;
      continue;
    }
    buf += ch;
    i += 1;
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

const path = new URL("../neon/sample-clubs.sql", import.meta.url).pathname;
const script = readFileSync(path, "utf-8");
const stmts = splitStatements(script);
let n = 0;
for (const stmt of stmts) {
  await execRaw(stmt);
  n += 1;
}
console.log(`${path}: ${n} statements applied`);

const items = await sql`
  select slug, name, price_join, price_annual, price_per_use
  from public.items where slug like 'sample-%' order by slug`;
const ranking = await sql`
  select name, total_score, scored_axes, review_count
  from public.ranking order by total_score desc nulls last`;
console.log(JSON.stringify({ sample_items: items, ranking }, null, 2));
