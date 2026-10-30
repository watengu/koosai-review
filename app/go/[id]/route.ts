import { NextResponse } from "next/server";
import { getAdminClient, getAnonClient } from "@/lib/supabase";

/**
 * 送客リンクのリダイレクト＆クリック計測。
 * - links テーブルから有効なリンクを解決し、clicks に1行記録して 302 する。
 * - clicks への書き込みは service_role 前提（RLS で anon の書き込み不可）。
 *   SUPABASE_SERVICE_ROLE_KEY が未設定の場合は計測をスキップして遷移だけ行う。
 * - 遷移先URLは links の管理値のみを使う（オープンリダイレクトにしない）。
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const anon = getAnonClient();
  if (!anon) return NextResponse.redirect(new URL("/", req.url));

  const { data: link } = await anon
    .from("links")
    .select("id,url")
    .eq("id", params.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!link?.url) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const admin = getAdminClient();
  if (admin) {
    await admin.from("clicks").insert({
      link_id: link.id,
      referrer: req.headers.get("referer"),
      user_agent: req.headers.get("user-agent"),
    });
  }

  return NextResponse.redirect(link.url, 302);
}
