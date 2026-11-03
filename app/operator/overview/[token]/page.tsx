import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOperatorOverview } from "@/lib/club-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "掲載ステータス一覧（運営用）",
  robots: { index: false, follow: false },
};

/**
 * 運営用：全クラブの現在の掲載状態（掲載中／停止中）と、直近の停止・復旧の記録を一覧する。
 * アクセスは operator_access のトークンを知る運営者のみ。
 */
export default async function OperatorOverviewPage({
  params,
}: {
  params: { token: string };
}) {
  const clubs = await getOperatorOverview(params.token);
  if (!clubs) notFound();

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) : "―";

  return (
    <div className="leading-relaxed">
      <h1 className="text-2xl font-bold">掲載ステータス一覧（運営用）</h1>
      <p className="mt-2 text-sm text-gray-500">
        全クラブの現在の掲載状態です。停止中のクラブは「運営用（復旧）ページ」から再表示できます。
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand text-left text-white">
              <th className="border border-[#D5DCE6] p-2">クラブ</th>
              <th className="border border-[#D5DCE6] p-2">状態</th>
              <th className="border border-[#D5DCE6] p-2">直近の動き</th>
              <th className="border border-[#D5DCE6] p-2">運営用リンク</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((c) => (
              <tr key={c.slug}>
                <td className="border border-[#D5DCE6] p-2 font-bold">{c.name}</td>
                <td className="border border-[#D5DCE6] p-2">
                  {c.isPublished ? (
                    <span className="font-bold text-green-700">掲載中</span>
                  ) : (
                    <span className="font-bold text-[#C73E2C]">停止中</span>
                  )}
                </td>
                <td className="border border-[#D5DCE6] p-2">
                  {c.lastAction
                    ? `${c.lastAction === "takedown" ? "取り下げ" : c.lastAction === "restore" ? "復旧" : c.lastAction}（${fmt(c.lastEventAt)}）${c.lastNote ? `／${c.lastNote}` : ""}`
                    : "―"}
                </td>
                <td className="border border-[#D5DCE6] p-2">
                  {c.operatorToken ? (
                    <a className="text-brand underline" href={`/operator/restore/${c.operatorToken}`}>
                      運営用（復旧）ページ
                    </a>
                  ) : (
                    "―"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        取り下げ・復旧が起きると、運営（メイン）へ自動で通知が届く見張りを設定しています。
      </p>
    </div>
  );
}
