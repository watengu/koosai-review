import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * 送客リンクのリダイレクト＆クリック計測。
 * - links テーブルから有効なリンクを解決し、clicks に1行記録して 302 する。
 * - 書き込みはサーバ側の Neon 接続のみ（DATABASE_URL はブラウザへ出さない）。
 *   DATABASE_URL 未設定時は DB を引けないため、トップへ遷移する
 *   （旧 Supabase 版で anon 未設定だった場合と同じ倒れ方）。
 * - 遷移先URLは links の管理値のみを使う（オープンリダイレクトにしない）。
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!sql) return NextResponse.redirect(new URL("/", req.url));

  let link: { id: string; url: string } | null = null;
  try {
    const rows = (await sql`
      select id, url from public.links
      where id = ${params.id}::uuid and is_active = true
      limit 1
    `) as { id: unknown; url: unknown }[];
    if (rows.length > 0) {
      link = { id: String(rows[0].id), url: String(rows[0].url) };
    }
  } catch {
    link = null;
  }

  if (!link?.url) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    await sql`
      insert into public.clicks (link_id, referrer, user_agent)
      values (${link.id}::uuid, ${req.headers.get("referer")}, ${req.headers.get("user-agent")})
    `;
  } catch {
    // 計測の失敗で遷移自体は止めない
  }

  return NextResponse.redirect(link.url, 302);
}
