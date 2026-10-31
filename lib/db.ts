import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Neon（Postgres）クライアント。
 * - 接続はサーバ側のみ。DATABASE_URL はブラウザへ出さない
 *   （NEXT_PUBLIC_ を付けない。通常の env として Vercel / .env.local に置く）。
 * - DATABASE_URL 未設定（= スキャフォールドを DB なしで開いた状態）では
 *   sql は null を返し、data.ts 側で空配列に倒す（ページを落とさない）。
 * - 公開範囲の制御は RLS ではなく、この接続を使うコード側のクエリ条件で
 *   担保する（data.ts の各クエリに is_published / status='approved' を明示し、
 *   口コミは公開カラムだけを SELECT する）。
 */

const connectionString = process.env.DATABASE_URL;

export const sql: NeonQueryFunction<false, false> | null = connectionString
  ? neon(connectionString)
  : null;

/** DB が使えるかどうか（投稿受付・計測の可否判定用） */
export function hasDb(): boolean {
  return sql !== null;
}
