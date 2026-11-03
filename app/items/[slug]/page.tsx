import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getApprovedReviews,
  getAxes,
  getItemBySlug,
  getLinksForItem,
  getScores,
} from "@/lib/data";
import ClubDetailView from "@/components/ClubDetail";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = await getItemBySlug(params.slug);
  if (!item) return { title: "見つかりません" };
  return {
    title: `${item.name}の料金・評価・口コミ`,
    description:
      item.summary ?? `${item.name}のスペック、評価軸別スコアと根拠、承認済み口コミ、最終確認日を掲載。`,
  };
}

export default async function ItemDetailPage({ params }: { params: { slug: string } }) {
  const item = await getItemBySlug(params.slug);
  if (!item) notFound();

  const [axes, scores, reviews, links] = await Promise.all([
    getAxes(),
    getScores(item.id),
    getApprovedReviews({ itemId: item.id }),
    getLinksForItem(item.id),
  ]);

  return (
    <ClubDetailView item={item} axes={axes} scores={scores} reviews={reviews} links={links} />
  );
}
