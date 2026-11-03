import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * 掲載状態の公開チェック（姉妹サイト連携用）。
 * 同じクラブが他サイト（ひだまり等）に掲載される場合、そちらはこの応答を
 * 見て表示を止める。トークン等の秘密は含まない。
 */
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  if (!sql) {
    return NextResponse.json(
      { slug: params.slug, published: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    const rows = (await sql`
      select is_published from public.items where slug = ${params.slug} limit 1
    `) as Record<string, unknown>[];
    const published = rows.length > 0 && Boolean(rows[0].is_published);
    return NextResponse.json(
      { slug: params.slug, published },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { slug: params.slug, published: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
