"use client";

import { useState } from "react";
import type { AxisConfig } from "@/config/vertical";
import { vertical } from "@/config/vertical";

interface ItemOption {
  id: string;
  name: string;
}

/**
 * 口コミ投稿フォーム。
 * 投稿は即時公開されず、必ず承認キュー（status='pending')に入る。
 * スパム対策のハニーポットを含む。本実装ではここに Turnstile 等の
 * CAPTCHA を追加する（導入可否は未決：docs/deploy-checklist.md 参照）。
 */
export default function ReviewForm({
  items,
  reviewAxes,
}: {
  items: ItemOption[];
  reviewAxes: AxisConfig[];
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const axisRatings: Record<string, number> = {};
    for (const axis of reviewAxes) {
      const v = Number(form.get(`axis_${axis.key}`));
      if (v >= 1 && v <= 5) axisRatings[axis.key] = v;
    }
    const payload = {
      item_id: String(form.get("item_id") ?? ""),
      used_period: String(form.get("used_period") ?? ""),
      author_age_range: String(form.get("author_age_range") ?? ""),
      author_area: String(form.get("author_area") ?? ""),
      contact_email: String(form.get("contact_email") ?? ""),
      body: String(form.get("body") ?? ""),
      axis_ratings: axisRatings,
      website: String(form.get("website") ?? ""), // ハニーポット（人間は入力しない）
    };
    setState("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "送信に失敗しました");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setError("通信エラーが発生しました");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-4 text-sm">
        <p className="font-bold">投稿を受け付けました。</p>
        <p className="mt-2">
          口コミは承認制です。編集部で掲載基準（公開情報との矛盾がないか、個人情報が
          含まれていないか等）を確認したうえで掲載します。確認には数日かかる場合が
          あります。不承認の場合も個別のご連絡は行いません。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="item_id" className="block text-sm font-bold">
          対象の{vertical.itemNoun} <span className="text-red-600">必須</span>
        </label>
        <select id="item_id" name="item_id" required className="mt-1 w-full rounded border px-3 py-2">
          <option value="">選択してください</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="used_period" className="block text-sm font-bold">利用時期</label>
          <input id="used_period" name="used_period" placeholder="例: 2026年9月" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="author_age_range" className="block text-sm font-bold">{vertical.reviewForm.authorAgeLabel}</label>
          <input id="author_age_range" name="author_age_range" placeholder="例: 40代" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="author_area" className="block text-sm font-bold">{vertical.reviewForm.authorAreaLabel}</label>
          <input id="author_area" name="author_area" placeholder="例: 東京" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-bold">項目別の評価（★1〜5、任意）</legend>
        <div className="mt-2 space-y-2">
          {reviewAxes.map((axis) => (
            <div key={axis.key} className="flex items-center gap-3">
              <label htmlFor={`axis_${axis.key}`} className="w-32 text-sm">{axis.label}</label>
              <select id={`axis_${axis.key}`} name={`axis_${axis.key}`} className="rounded border px-2 py-1">
                <option value="">未選択</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>★{n}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="body" className="block text-sm font-bold">
          口コミ本文 <span className="text-red-600">必須</span>
        </label>
        <textarea
          id="body"
          name="body"
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="実際に利用した内容を具体的に書いてください。個人が特定される情報（氏名・連絡先・日時と場所の組み合わせ等）は書かないでください。"
        />
      </div>

      <div>
        <label htmlFor="contact_email" className="block text-sm font-bold">
          連絡先メールアドレス（任意・公開されません）
        </label>
        <input id="contact_email" name="contact_email" type="email" className="mt-1 w-full rounded border px-3 py-2" />
        <p className="mt-1 text-xs text-gray-500">
          掲載前の確認連絡にのみ使います。入力しなくても投稿できます。
        </p>
      </div>

      {/* ハニーポット: 人間には見えない。bot が入力したらサーバ側で破棄する */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === "error" && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded bg-brand px-6 py-2 font-bold text-white disabled:opacity-50"
      >
        {state === "sending" ? "送信中…" : "投稿する（承認制）"}
      </button>
    </form>
  );
}
