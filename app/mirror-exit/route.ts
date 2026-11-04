import { NextResponse } from "next/server";
import { MIRROR_FLAG_COOKIE, PREVIEW_TOKEN_COOKIE } from "@/lib/mirror-constants";

/** ミラー表示を終えて通常表示に戻る（両方のクッキーを消してトップへ）。 */
export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.delete(PREVIEW_TOKEN_COOKIE);
  res.cookies.delete(MIRROR_FLAG_COOKIE);
  return res;
}
