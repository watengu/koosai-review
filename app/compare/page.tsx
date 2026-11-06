import type { Metadata } from "next";
import Link from "next/link";
import { getAxes, getRanking } from "@/lib/data";
import { formatDate, formatSettingFee, formatSpecValue, formatYen } from "@/lib/format";
import { vertical } from "@/config/vertical";
import ItemCard from "@/components/ItemCard";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `比較表 | ${vertical.itemNoun}の料金・評価を横断比較`,
};

/**
 * 比較表。
 * デスクトップは横断テーブル、スマホは要約カードの二重表示にする
 * （横スクロール前提の表をそのまま流し込まない：設計書§1「捨てるもの」）。
 */
export default async function ComparePage() {
  const [ranking, axes] = await Promise.all([getRanking(), getAxes()]);
  const specFields = vertical.specFields;

  return (
    <div>
      <h1 className="text-2xl font-bold">{vertical.itemNoun}比較表</h1>
      <p className="mt-3 text-sm text-gray-600">
        編集部が公式情報を一次確認したスペックと評価軸スコアの横断比較です。
        公表されていない項目は推測で埋めていません（―と表示します）。総額の試算は
        <Link href="/simulator" className="text-brand underline">料金シミュレーター</Link>
        で行えます。
      </p>

      {/* デスクトップ: テーブル */}
      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand text-left text-white">
              <th className="p-2">{vertical.itemNoun}</th>
              <th className="p-2">総合スコア</th>
              <th className="p-2">{vertical.priceModel.joinLabel}</th>
              <th className="p-2">{vertical.priceModel.annualLabel}</th>
              <th className="p-2">{vertical.priceModel.perUseLabel}</th>
              {specFields.map((f) => (
                <th key={f.key} className="p-2">{f.label}</th>
              ))}
              <th className="p-2">最終確認日</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map(({ item, totalScore }) => (
              <tr key={item.id} className="border-b border-gray-200 align-top">
                <td className="p-2 font-bold">
                  <Link href={`/items/${item.slug}`} className="text-brand hover:underline">
                    {item.name}
                  </Link>
                </td>
                <td className="p-2">{totalScore !== null ? totalScore.toFixed(1) : "採点中"}</td>
                <td className="p-2">{formatYen(item.price_join)}</td>
                <td className="p-2">{formatYen(item.price_annual)}</td>
                <td className="p-2">{formatSettingFee(item)}</td>
                {specFields.map((f) => (
                  <td key={f.key} className="p-2">
                    {formatSpecValue(item.specs?.[f.key], f.format)}
                  </td>
                ))}
                <td className="p-2">{formatDate(item.last_checked_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {axes.length === 0 && (
          <p className="mt-2 text-xs text-gray-400">※ 評価軸データ未投入</p>
        )}
      </div>

      {/* スマホ: カード展開 */}
      <div className="mt-6 space-y-4 md:hidden">
        {ranking.map((r, i) => (
          <ItemCard key={r.item.id} ranked={r} rank={i + 1} />
        ))}
      </div>

      {ranking.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">まだ掲載データがありません。</p>
      )}
    </div>
  );
}
