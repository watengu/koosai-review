import { vertical } from "@/config/vertical";

/**
 * サンプルデータ明示バー。
 * config の sampleMode が true の間だけ、PR バーの直下に常時表示する。
 * 掲載中のクラブ名・料金・順位がすべて架空のサンプルデータである旨を、
 * 営業デモとして先方に見せられる丁寧な文面で案内する。
 * 実データ投入時に sampleMode を false へ切り替えると表示されなくなる。
 */
export default function SampleNotice() {
  if (!vertical.sampleMode) return null;
  return (
    <div className="border-b border-sky-200 bg-sky-50">
      <p className="mx-auto max-w-5xl px-4 py-2 text-sm text-sky-900">
        <span className="mr-2 font-bold">ご案内</span>
        {vertical.sampleNotice}
      </p>
    </div>
  );
}
