/** 表示整形の小物 */

/** 金額。null は「非公開」（推測で埋めない：設計書§3） */
export function formatYen(value: number | null | undefined): string {
  if (value === null || value === undefined) return "非公開";
  return `${value.toLocaleString("ja-JP")}円`;
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
