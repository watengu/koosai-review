import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAxes, getPublishedItems, getReviewById } from "@/lib/data";
import { vertical } from "@/config/vertical";
import ReviewCard from "@/components/ReviewCard";

export const revalidate = 300;

export const metadata: Metadata = { title: "口コミ詳細" };

export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  const review = await getReviewById(params.id);
  if (!review) notFound();

  const [items, axes] = await Promise.all([getPublishedItems(), getAxes()]);
  const item = items.find((i) => i.id === review.item_id);
  const axisLabels = Object.fromEntries(axes.map((a) => [a.key, a.label]));

  return (
    <div>
      <p className="text-sm">
        <Link href="/reviews" className="text-brand underline">口コミ一覧へ戻る</Link>
        {item && (
          <>
            {" / "}
            <Link href={`/items/${item.slug}`} className="text-brand underline">
              {item.name}の詳細
            </Link>
          </>
        )}
      </p>
      <h1 className="mt-3 text-2xl font-bold">
        {item ? `${item.name}の口コミ` : `${vertical.itemNoun}の口コミ`}
      </h1>
      <div className="mt-4">
        <ReviewCard review={review} itemName={item?.name} axisLabels={axisLabels} />
      </div>
      <p className="mt-6 text-sm text-gray-600">
        口コミの収集・承認ポリシーは
        <Link href="/method" className="text-brand underline">評価方法ページ</Link>
        で公開しています。内容に事実誤認や権利侵害がある場合は
        <Link href="/removal" className="text-brand underline">削除要請窓口</Link>
        からご連絡ください。
      </p>
    </div>
  );
}
