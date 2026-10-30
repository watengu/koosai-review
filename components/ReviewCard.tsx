import Link from "next/link";
import type { PublicReview } from "@/lib/types";
import { formatDate } from "@/lib/format";
import Stars from "./Stars";

/**
 * 口コミカード。
 * 「投稿者申告に基づく口コミ」である注記を必ず添える
 * （検証済み体験であるかのような表現をしない：設計書§4）。
 */
export default function ReviewCard({
  review,
  itemName,
  axisLabels,
}: {
  review: PublicReview;
  itemName?: string;
  axisLabels: Record<string, string>;
}) {
  const ratings = Object.entries(review.axis_ratings);
  const avg =
    ratings.length > 0
      ? ratings.reduce((sum, [, v]) => sum + v, 0) / ratings.length
      : null;
  return (
    <article className="rounded border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {itemName && <span className="font-bold text-gray-800">{itemName}</span>}
        {review.author_age_range && <span>{review.author_age_range}</span>}
        {review.author_area && <span>{review.author_area}</span>}
        {review.used_period && <span>利用時期: {review.used_period}</span>}
        <span>{formatDate(review.approved_at ?? review.created_at)}</span>
      </div>
      {avg !== null && (
        <div className="mt-2 flex items-center gap-2">
          <Stars value={avg} />
          <span className="text-sm font-bold">{avg.toFixed(1)}</span>
        </div>
      )}
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{review.body}</p>
      {ratings.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {ratings.map(([key, v]) => (
            <li key={key}>
              {axisLabels[key] ?? key}: ★{v}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-gray-400">
        ※ 投稿者申告に基づく口コミです（編集部で公開情報との矛盾がないか確認のうえ掲載）。
      </p>
      <Link href={`/reviews/${review.id}`} className="mt-1 inline-block text-xs text-brand hover:underline">
        この口コミの詳細
      </Link>
    </article>
  );
}
