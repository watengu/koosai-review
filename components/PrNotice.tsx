import { vertical } from "@/config/vertical";

/**
 * PR表記バー。
 * ステマ規制（景表法）対応のため、全ページのヘッダー直下＝記事冒頭相当の
 * 位置に、周囲より小さくない文字で常時表示する（検証レポート条件4）。
 * 文言はバーティカル設定の prNotice を使う。
 */
export default function PrNotice() {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <p className="mx-auto max-w-5xl px-4 py-2 text-sm text-amber-900">
        <span className="font-bold mr-2">PR</span>
        {vertical.prNotice}
      </p>
    </div>
  );
}
