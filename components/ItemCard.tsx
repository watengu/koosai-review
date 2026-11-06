import Link from "next/link";
import type { RankedItem } from "@/lib/types";
import { formatDate, formatSettingFee, formatYen } from "@/lib/format";
import { vertical } from "@/config/vertical";

/** ランキング/トップで使う対象カード */
export default function ItemCard({ ranked, rank }: { ranked: RankedItem; rank?: number }) {
  const { item, totalScore, reviewCount } = ranked;
  return (
    <article className="rounded border border-gray-200 bg-white p-4 shadow-sm">
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.slug.startsWith("sample-") ? `${item.name}のイメージ（サンプル）` : `${item.name}のイメージ（公式提供）`}
          className="mb-3 h-40 w-full rounded object-cover object-top"
          loading="lazy"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold">
          {rank !== undefined && <span className="mr-2 text-brand-accent">{rank}位</span>}
          <Link href={`/items/${item.slug}`} className="hover:underline">
            {item.name}
          </Link>
        </h3>
        <div className="shrink-0 text-right">
          {totalScore !== null ? (
            <>
              <span className="text-2xl font-bold text-brand">{totalScore.toFixed(1)}</span>
              <span className="text-xs text-gray-500"> / 100</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">採点中</span>
          )}
        </div>
      </div>
      <p className="mt-2">
        {item.slug.startsWith("sample-") ? (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">サンプル（架空）</span>
        ) : (
          <span className="rounded bg-[#B08D3E] px-2 py-0.5 text-xs font-bold text-white">実在・公式確認済み</span>
        )}
      </p>
      {item.summary && <p className="mt-2 text-sm text-gray-600">{item.summary}</p>}
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded bg-gray-50 p-2">
          <dt className="text-xs text-gray-500">{vertical.priceModel.joinLabel}</dt>
          <dd className="font-bold">{formatYen(item.price_join)}</dd>
        </div>
        <div className="rounded bg-gray-50 p-2">
          <dt className="text-xs text-gray-500">{vertical.priceModel.annualLabel}</dt>
          <dd className="font-bold">{formatYen(item.price_annual)}</dd>
        </div>
        <div className="rounded bg-gray-50 p-2">
          <dt className="text-xs text-gray-500">{vertical.priceModel.perUseLabel}</dt>
          <dd className="font-bold">{formatSettingFee(item)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-gray-500">
        口コミ {reviewCount}件 ・ 最終確認日: {formatDate(item.last_checked_at)}
      </p>
    </article>
  );
}
