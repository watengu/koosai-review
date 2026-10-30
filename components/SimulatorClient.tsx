"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Item } from "@/lib/types";
import { estimateTotal, rankByTotal } from "@/lib/simulator";
import { formatYen } from "@/lib/format";
import { vertical } from "@/config/vertical";

/**
 * 料金シミュレーター本体（モデルケース型）。
 * 計算式は lib/simulator.ts に集約し、ここは入力と表示だけを担う。
 */
export default function SimulatorClient({ items }: { items: Item[] }) {
  const [years, setYears] = useState(1);
  const [sessionsPerMonth, setSessionsPerMonth] = useState(2);

  const rows = useMemo(
    () => rankByTotal(items.map((item) => estimateTotal(item, { years, sessionsPerMonth }))),
    [items, years, sessionsPerMonth],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-6 rounded border border-gray-200 bg-gray-50 p-4">
        <label className="text-sm">
          <span className="block font-bold">利用年数</span>
          <select
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-1 rounded border px-3 py-2"
          >
            {[1, 2, 3, 5].map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-bold">月あたりの利用回数</span>
          <select
            value={sessionsPerMonth}
            onChange={(e) => setSessionsPerMonth(Number(e.target.value))}
            className="mt-1 rounded border px-3 py-2"
          >
            {[1, 2, 3, 4, 6, 8].map((n) => (
              <option key={n} value={n}>月{n}回</option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-gray-600">
        試算式: {vertical.priceModel.joinLabel} ＋ {vertical.priceModel.annualLabel}×{years}年 ＋{" "}
        {vertical.priceModel.perUseLabel}×月{sessionsPerMonth}回×12か月×{years}年。
        金額が非公開の{vertical.itemNoun}は推測で補完せず「試算不可」と表示します。
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand text-left text-white">
              <th className="p-2">{vertical.itemNoun}</th>
              <th className="p-2">{vertical.priceModel.joinLabel}</th>
              <th className="p-2">{vertical.priceModel.annualLabel}（{years}年分）</th>
              <th className="p-2">{vertical.priceModel.perUseLabel}（合計）</th>
              <th className="p-2">総額</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ item, total, breakdown }) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-2 font-bold">
                  <Link href={`/items/${item.slug}`} className="text-brand hover:underline">
                    {item.name}
                  </Link>
                </td>
                {breakdown ? (
                  <>
                    <td className="p-2">{formatYen(breakdown.join)}</td>
                    <td className="p-2">{formatYen(breakdown.annualTotal)}</td>
                    <td className="p-2">{formatYen(breakdown.perUseTotal)}</td>
                    <td className="p-2 text-base font-bold">{formatYen(total)}</td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{formatYen(item.price_join)}</td>
                    <td className="p-2">{formatYen(item.price_annual)}</td>
                    <td className="p-2">{formatYen(item.price_per_use)}</td>
                    <td className="p-2 text-gray-400">試算不可（金額非公開あり）</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          まだ掲載データがありません（編集部が一次確認した{vertical.itemNoun}から順次掲載します）。
        </p>
      )}
    </div>
  );
}
