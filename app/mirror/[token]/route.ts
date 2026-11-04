import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { MIRROR_FLAG_COOKIE, PREVIEW_TOKEN_COOKIE } from "@/lib/mirror-constants";

/**
 * クラブ確認用ミラーの入口。club_access.preview_token を照合し、
 * 一致した場合のみクッキーを置いてトップへリダイレクトする。
 * 不正なトークンは 404（ミラーへの入口はトークンURLのみ）。
 */
export async function GET(
  request: Request,
  { params }: { params: { token: string } },
) {
  if (!sql) return new Response("見つかりません", { status: 404 });
  try {
    const rows = (await sql`
      select i.slug from public.items i
      join public.club_access a on a.item_id = i.id
      where a.preview_token = ${params.token}
      limit 1
    `) as Record<string, unknown>[];
    if (rows.length === 0) {
      return new Response("見つかりません", { status: 404 });
    }
  } catch {
    return new Response("見つかりません", { status: 404 });
  }

  const res = NextResponse.redirect(new URL("/", request.url));
  const cookieBase = {
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
  // 権限の判断に使うトークン本体（httpOnly）。表示の帯は別途フラグで出す。
  res.cookies.set(PREVIEW_TOKEN_COOKIE, params.token, {
    ...cookieBase,
    httpOnly: true,
  });
  res.cookies.set(MIRROR_FLAG_COOKIE, "1", cookieBase);
  return res;
}
