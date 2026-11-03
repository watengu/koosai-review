import { NextResponse } from "next/server";
import { getClubByOperatorToken, restoreClub } from "@/lib/club-admin";

/** 運営専用：取り下げからの復旧。 */
export async function POST(
  req: Request,
  { params }: { params: { token: string } },
) {
  const club = await getClubByOperatorToken(params.token);
  if (!club) {
    return NextResponse.json({ error: "invalid token" }, { status: 404 });
  }
  if (!club.isPublished) {
    await restoreClub(club.itemId);
  }
  return NextResponse.redirect(
    new URL(`/operator/restore/${params.token}`, req.url),
    303,
  );
}
