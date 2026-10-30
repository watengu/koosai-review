import type { Metadata } from "next";
import Link from "next/link";
import { getApprovedReviews, getAxes, getPublishedItems } from "@/lib/data";
import { vertical } from "@/config/vertical";
import ReviewCard from "@/components/ReviewCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "口コミ一覧（承認済みの実投稿）",
  description:
    "承認制で掲載している利用者投稿の口コミ一覧。運営側が書いた口コミや、対価と引き換えに依頼した口コミは掲載しません。",
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { item?: string };
}) {
  const [items, axes] = await Promise.all([getPublishedItems(), getAxes()]);
  const itemById = new Map(items.map((i) => [i.id, i]));
  const selected = searchParams.item
    ? items.find((i) => i.slug === searchParams.item)
    : undefined;
  const reviews = await getApprovedReviews({ itemId: selected?.id, limit: 50 });
  const axisLabels = Object.fromEntries(axes.map((a) => [a.key, a.label]));

  return (
    <div>
      <h1 className="text-2xl font-bold">口コミ一覧</h1>
      <p className="mt-3 text-sm text-gray-600">
        掲載しているのは承認制の実投稿のみです。各口コミは「投稿者申告に基づく」注記つきで、
        編集部で公開情報との矛盾がないか確認しています。件数と分布もそのまま表示します。
      </p>

      <form method="get" className="mt-4 flex items-center gap-2 text-sm">
        <label htmlFor="item" className="font-bold">{vertical.itemNoun}で絞り込む</label>
        <select id="item" name="item" defaultValue={searchParams.item ?? ""} className="rounded border px-2 py-1">
          <option value="">すべて</option>
          {items.map((i) => (
            <option key={i.id} value={i.slug}>{i.name}</option>
          ))}
        </select>
        <button type="submit" className="rounded bg-brand px-3 py-1 font-bold text-white">絞り込む</button>
      </form>

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            itemName={itemById.get(review.item_id)?.name}
            axisLabels={axisLabels}
          />
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-gray-500">
            該当する承認済み口コミはまだありません。
            <Link href="/reviews/post" className="text-brand underline">口コミを投稿する</Link>
          </p>
        )}
      </div>
    </div>
  );
}
