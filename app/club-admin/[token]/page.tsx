import type { Metadata } from "next";
import Link from "next/link";
import { getClubByToken } from "@/lib/club-admin";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "掲載管理（クラブ様専用）",
  robots: { index: false, follow: false },
};

/**
 * クラブ様専用の掲載取り下げページ。
 * 確認画面を1回挟み、ボタンを押すと即時に掲載を停止する（ワンウェイ。
 * 再掲載は新規申込＋再審査）。
 */
export default async function ClubAdminPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { confirm?: string; done?: string };
}) {
  const club = await getClubByToken(params.token);

  if (!club) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">掲載管理（クラブ様専用）</h1>
        <p className="text-sm leading-relaxed text-gray-700">
          このURLは無効です。お手元のURLをご確認のうえ、運営までお問い合わせください。
        </p>
      </div>
    );
  }

  const confirming = searchParams.confirm === "1";
  const done = searchParams.done === "1";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">掲載管理（クラブ様専用）</h1>
      <p className="text-sm text-gray-600">
        対象クラブ：<span className="font-bold text-gray-900">{club.name}</span>
      </p>

      {club.isPublished && !confirming && (
        <section className="rounded border border-gray-200 p-4">
          <p className="font-bold">現在の状態：掲載中</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            掲載を取り下げる場合は、下のボタンから進んでください。確認画面を1回挟んで、
            その場で掲載を停止します（ランキング・比較表・詳細ページから表示されなくなります）。
          </p>
          <p className="mt-4">
            <Link
              href={`/club-admin/${params.token}?confirm=1`}
              className="inline-block rounded bg-[#C73E2C] px-5 py-2 font-bold text-white"
            >
              掲載を取り下げる
            </Link>
          </p>
        </section>
      )}

      {club.isPublished && confirming && (
        <section className="rounded border-2 border-[#C73E2C] p-4">
          <p className="font-bold">最終確認：{club.name} の掲載を取り下げますか？</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            取り下げると即時に掲載が停止します。再び掲載するには、改めて新規のお申し込みと
            運営の確認が必要で、以前の掲載内容は引き継がれません。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <form method="post" action={`/api/club-admin/${params.token}/takedown`}>
              <button type="submit" className="rounded bg-[#C73E2C] px-5 py-2 font-bold text-white">
                取り下げる（即時停止）
              </button>
            </form>
            <Link href={`/club-admin/${params.token}`} className="text-sm text-brand underline">
              やめる（掲載を続ける）
            </Link>
          </div>
        </section>
      )}

      {!club.isPublished && (
        <section className="rounded border border-gray-200 bg-gray-50 p-4">
          <p className="font-bold">現在の状態：掲載を停止しています</p>
          {done && (
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              取り下げを受け付け、掲載を停止しました。ご利用ありがとうございました。
            </p>
          )}
          {club.lastEventAt && club.lastEventAction === "takedown" && (
            <p className="mt-2 text-sm text-gray-600">
              停止日時：{formatDate(club.lastEventAt)}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            再び掲載をご希望の場合は、改めて新規のお申し込みをお願いします。
          </p>
        </section>
      )}

      <p className="text-xs leading-relaxed text-gray-400">
        このページは {club.name} 様専用のURLです。URL自体が認証を兼ねていますので、
        第三者への共有はお控えください。
      </p>
    </div>
  );
}
