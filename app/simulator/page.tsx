import type { Metadata } from "next";
import { getPublishedItems } from "@/lib/data";
import { vertical } from "@/config/vertical";
import SimulatorClient from "@/components/SimulatorClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `料金シミュレーター | ${vertical.itemNoun}の総額を試算`,
  description: `利用年数と月あたり回数から${vertical.itemNoun}ごとの総額を試算し、安い順に比較できます。非公開の金額は推測で補完しません。`,
};

export default async function SimulatorPage() {
  const items = await getPublishedItems();
  return (
    <div>
      <h1 className="text-2xl font-bold">料金シミュレーター</h1>
      <p className="mt-3 text-sm text-gray-600">
        {vertical.priceModel.joinLabel}・{vertical.priceModel.annualLabel}・
        {vertical.priceModel.perUseLabel}は編集部が公式情報を一次確認した金額です。
        条件を変えると総額順に並び替わります。各{vertical.itemNoun}の内訳と根拠は詳細ページにあります。
      </p>
      <div className="mt-6">
        <SimulatorClient items={items} />
      </div>
    </div>
  );
}
