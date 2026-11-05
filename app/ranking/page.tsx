import type { Metadata } from "next";
import Link from "next/link";
import { getRanking } from "@/lib/data";
import { vertical } from "@/config/vertical";
import ItemCard from "@/components/ItemCard";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `総合ランキング | ${vertical.itemNoun}比較`,
  description: `公開した採点式で機械的に算出した${vertical.itemNoun}の総合ランキング。順位の根拠は評価方法ページで公開しています。`,
};

export default async function RankingPage() {
  const ranking = await getRanking();
  return (
    <div>
      <h1 className="text-2xl font-bold">{vertical.itemNoun}総合ランキング</h1>
      <p className="mt-3 text-sm text-gray-600">
        順位は<Link href="/method" className="text-brand underline">評価方法ページ</Link>で
        公開している採点式（評価軸と重み）から機械的に算出しています。
        契約の有無や送客リンクの有無で順位は変わりません。
        データが不足している評価軸は採点から除外し、その旨を各詳細ページに表示します。
      </p>
      <div className="mt-6 space-y-4">
        {ranking.map((r) => {
          // 同率は同順位（例: 89.3 が2件なら両方とも2位）。
          const rank =
            1 +
            ranking.filter(
              (x) => (x.totalScore ?? -1) > (r.totalScore ?? -1),
            ).length;
          return <ItemCard key={r.item.id} ranked={r} rank={rank} />;
        })}
        {ranking.length === 0 && (
          <p className="text-sm text-gray-500">まだ掲載データがありません。</p>
        )}
      </div>
    </div>
  );
}
