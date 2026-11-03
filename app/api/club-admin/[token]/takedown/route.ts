import { NextResponse } from "next/server";
import { getClubByToken, takedownClub } from "@/lib/club-admin";

/** クラブ専用URLからの取り下げ実行。即時停止し、記録を残す。 */
export async function POST(
  req: Request,
  { params }: { params: { token: string } },
) {
  const club = await getClubByToken(params.token);
  if (!club) {
    return NextResponse.json({ error: "invalid token" }, { status: 404 });
  }
  if (club.isPublished) {
    await takedownClub(club.itemId);
  }
  return NextResponse.redirect(
    new URL(`/club-admin/${params.token}?done=1`, req.url),
    303,
  );
}
