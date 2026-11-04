import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PREVIEW_TOKEN_COOKIE } from "@/lib/mirror-constants";

/**
 * ミラー状態（プレビュー用クッキーあり）の応答にだけ noindex を付ける。
 * 通常の公開ページには影響しない（クッキーが無ければ素通し）。
 */
export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  if (request.cookies.has(PREVIEW_TOKEN_COOKIE)) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
