import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase クライアント。
 * - anon クライアント: 公開読取と口コミ投稿（RLS 前提）用。サーバ/ブラウザ両用。
 * - admin クライアント: service_role。サーバ専用（クリック記録など）。
 *   環境変数が未設定の場合は null を返し、呼び出し側で機能をスキップする。
 * 環境変数自体が未設定（= スキャフォールドを DB なしで開いた状態）でも
 * ページが落ちないよう、anon も null を返し、data.ts 側で空配列に倒す。
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getAnonClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export function getAdminClient(): SupabaseClient | null {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
