import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getApprovedReviews,
  getAxes,
  getItemByPreviewToken,
  getLinksForItem,
  getScores,
} from "@/lib/data";
import ClubDetailView from "@/components/ClubDetail";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "掲載内容の確認用プレビュー",
  robots: { index: false, follow: false },
};

/**
 * クラブ確認用プレビュー（標準運用 2026-11-03〜）。
 * 掲載前にクラブへこの限定URL（トークン・noindex）を見せて確認を取り、了承後に公開する。
 */
export default async function ClubPreviewPage({
  params,
}: {
  params: { token: string };
}) {
  const item = await getItemByPreviewToken(params.token);
  if (!item) notFound();

  const [axes, scores, reviews, links] = await Promise.all([
    getAxes(),
    getScores(item.id),
    getApprovedReviews({ itemId: item.id }),
    getLinksForItem(item.id),
  ]);

  return (
    <div>
      <div className="mb-6 rounded border border-[#B08D3E] bg-[#FDF6E0] p-4 text-sm leading-relaxed">
        <p className="font-bold">これは掲載前の確認用プレビューです</p>
        <p className="mt-1">
          このページはクラブ様のご確認専用で、一般には公開されていません。掲載内容をご確認のうえ、修正のご希望がありましたら運営までご連絡ください。
        </p>
        {!item.is_published && (
          <p className="mt-1">現在の状態: 未公開（ご確認が取れ次第、公開します）</p>
        )}
      </div>
      <ClubDetailView item={item} axes={axes} scores={scores} reviews={reviews} links={links} />
    </div>
  );
}
