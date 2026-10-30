import { NextResponse } from "next/server";
import { getAnonClient } from "@/lib/supabase";

/**
 * 口コミ投稿の受付。
 * - 検証: 必須項目、本文の長さ、軸別評価の範囲（1〜5）。
 * - ハニーポット（website 欄）に値があれば bot とみなし、成功を装って破棄する。
 * - 保存は anon クライアント経由。RLS で status='pending' 以外は弾かれるため、
 *   ここで approved を指定しても公開はされない（二重化）。
 * - CAPTCHA（Turnstile 等）は未決。本実装で追加する（deploy-checklist 参照）。
 */

interface ReviewPayload {
  item_id?: string;
  used_period?: string;
  author_age_range?: string;
  author_area?: string;
  contact_email?: string;
  body?: string;
  axis_ratings?: Record<string, unknown>;
  website?: string; // ハニーポット
}

const MAX_LEN = {
  body: 2000,
  short: 100,
  email: 200,
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let payload: ReviewPayload;
  try {
    payload = (await req.json()) as ReviewPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "リクエスト形式が不正です" }, { status: 400 });
  }

  // ハニーポット: bot には成功を装う
  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  const itemId = clean(payload.item_id, 64);
  const body = clean(payload.body, MAX_LEN.body);
  if (!itemId) {
    return NextResponse.json({ ok: false, error: "対象を選択してください" }, { status: 400 });
  }
  if (body.length < 20) {
    return NextResponse.json(
      { ok: false, error: "口コミ本文は20文字以上で入力してください" },
      { status: 400 },
    );
  }

  // 軸別評価: 1〜5 の数値だけを通す
  const axisRatings: Record<string, number> = {};
  if (payload.axis_ratings && typeof payload.axis_ratings === "object") {
    for (const [key, value] of Object.entries(payload.axis_ratings)) {
      const n = Number(value);
      if (Number.isInteger(n) && n >= 1 && n <= 5) axisRatings[key] = n;
    }
  }

  const sb = getAnonClient();
  if (!sb) {
    return NextResponse.json(
      { ok: false, error: "現在投稿を受け付けていません" },
      { status: 503 },
    );
  }

  const { error } = await sb.from("reviews").insert({
    item_id: itemId,
    status: "pending",
    axis_ratings: axisRatings,
    body,
    author_age_range: clean(payload.author_age_range, MAX_LEN.short) || null,
    author_area: clean(payload.author_area, MAX_LEN.short) || null,
    used_period: clean(payload.used_period, MAX_LEN.short) || null,
    contact_email: clean(payload.contact_email, MAX_LEN.email) || null,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "保存に失敗しました。時間をおいて再度お試しください" },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
