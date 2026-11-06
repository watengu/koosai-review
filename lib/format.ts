/** 表示整形の小物 */

/** 金額。null は「非公開」（推測で埋めない：設計書§3） */
export function formatYen(value: number | null | undefined): string {
  if (value === null || value === undefined) return "非公開";
  return `${value.toLocaleString("ja-JP")}円`;
}

/** セッティング料の表示。コース制クラブ（specs.fee_classes あり）は範囲表記の見出し、それ以外は単価 */
export function formatSettingFee(item: {
  price_per_use: number | null | undefined;
  specs?: Record<string, unknown> | null;
}): string {
  const fc = item.specs?.fee_classes;
  if (typeof fc === "string" && fc.trim()) {
    const head = fc.split("（")[0].trim();
    if (head) return head;
  }
  return formatYen(item.price_per_use);
}

/** セッティング料の表示（¥表記版。ホームの表・カード用） */
export function formatSettingFeeYen(item: {
  price_per_use: number | null | undefined;
  specs?: Record<string, unknown> | null;
}): string {
  const fc = item.specs?.fee_classes;
  if (typeof fc === "string" && fc.trim()) {
    const head = fc.split("（")[0].trim();
    if (head) return `¥${head.replace(/円/g, "")}`;
  }
  return item.price_per_use !== null && item.price_per_use !== undefined
    ? `¥${item.price_per_use.toLocaleString("ja-JP")}`
    : "―";
}

/** ISO日時 → YYYY年M月D日。日付が無い場合は項目ごと出さない方針に合わせ「―」 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "―";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "―";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** スペック値（items.specs の jsonb）を設定の format に従って文字列化する */
export function formatSpecValue(
  value: unknown,
  format: "yen" | "text" | "list",
): string {
  if (value === null || value === undefined || value === "") return "―";
  if (format === "yen") {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isNaN(n) ? String(value) : formatYen(n);
  }
  if (format === "list") {
    return Array.isArray(value) ? value.join("、") : String(value);
  }
  return String(value);
}
