import type { Metadata } from "next";
import { getClubByOperatorToken } from "@/lib/club-admin";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "運営コンソール（復旧用）",
  robots: { index: false, follow: false },
};

/**
 * 運営専用の復旧ページ。クラブには渡さない。
 * 取り下げ（漏洩で押された場合を含む）からの復旧をワンクリックで行う。
 */
export default async function OperatorRestorePage({
  params,
}: {
  params: { token: string };
}) {
  const club = await getClubByOperatorToken(params.token);

  if (!club) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">運営コンソール</h1>
        <p className="text-sm text-gray-700">このURLは無効です。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">運営コンソール（復旧用）</h1>
      <p className="text-sm text-gray-600">
        対象クラブ：<span className="font-bold text-gray-900">{club.name}</span>
      </p>
      <section className="rounded border border-gray-200 p-4">
        <p className="font-bold">
          現在の状態：{club.isPublished ? "掲載中" : "掲載を停止しています"}
        </p>
        {club.lastEventAt && (
          <p className="mt-2 text-sm text-gray-600">
            直近の記録：{club.lastEventAction === "takedown" ? "取り下げ" : "復旧"}（
            {formatDate(club.lastEventAt)}）
          </p>
        )}
        {!club.isPublished && (
          <>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              取り下げは非表示化のみで、データ（スコア・文案・リンク）は保持されています。
              復旧すると即座に元の表示に戻ります。
            </p>
            <form method="post" action={`/api/operator/restore/${params.token}`} className="mt-4">
              <button type="submit" className="rounded bg-brand px-5 py-2 font-bold text-white">
                掲載を復旧する
              </button>
            </form>
          </>
        )}
        {club.isPublished && (
          <p className="mt-2 text-sm text-gray-600">復旧の操作は不要です。</p>
        )}
      </section>
      <p className="text-xs text-gray-400">
        このURLは運営専用です。クラブ様・第三者へ共有しないでください。
      </p>
    </div>
  );
}
