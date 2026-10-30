import Link from "next/link";
import { getAxes, getRanking, getApprovedReviews } from "@/lib/data";
import { vertical } from "@/config/vertical";
import ItemCard from "@/components/ItemCard";
import ReviewCard from "@/components/ReviewCard";

export const revalidate = 300;

export default async function HomePage() {
  const [ranking, latestReviews, axes] = await Promise.all([
    getRanking(),
    getApprovedReviews({ limit: 5 }),
    getAxes(),
  ]);
  const top = ranking.slice(0, 5);
  const itemNameById = new Map(ranking.map((r) => [r.item.id, r.item.name]));
  const axisLabels = Object.fromEntries(axes.map((a) => [a.key, a.label]));

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-bold leading-snug">{vertical.tagline}</h1>
        <p className="mt-3 text-gray-700">{vertical.description}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded border border-gray-200 p-3 text-sm">
            <span className="font-bold">採点式を全公開</span>
            <br />
            順位は<Link href="/method" className="text-brand underline">評価方法ページ</Link>で
            公開した式と重みだけで決まります。契約の有無で順位は動きません。
          </li>
          <li className="rounded border border-gray-200 p-3 text-sm">
            <span className="font-bold">料金シミュレーター</span>
            <br />
            利用頻度から{vertical.itemNoun}ごとの総額を試算して比べられます。
          </li>
          <li className="rounded border border-gray-200 p-3 text-sm">
            <span className="font-bold">口コミは実投稿のみ</span>
            <br />
            承認制の利用者投稿だけを掲載します。運営側が書いた口コミは載せません。
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/simulator" className="rounded bg-brand px-5 py-2 font-bold text-white">
            料金シミュレーターで総額を比べる
          </Link>
          <Link href="/ranking" className="rounded border border-brand px-5 py-2 font-bold text-brand">
            ランキングを見る
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">総合ランキング（上位5件）</h2>
        <div className="mt-4 space-y-4">
          {top.map((r, i) => (
            <ItemCard key={r.item.id} ranked={r} rank={i + 1} />
          ))}
          {top.length === 0 && (
            <p className="text-sm text-gray-500">
              まだ掲載データがありません（編集部が一次確認した{vertical.itemNoun}から順次掲載します）。
            </p>
          )}
        </div>
        <p className="mt-4">
          <Link href="/ranking" className="text-brand underline">ランキング全文を見る</Link>
          {" / "}
          <Link href="/compare" className="text-brand underline">比較表で比べる</Link>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">新着口コミ（承認済み）</h2>
        <div className="mt-4 space-y-4">
          {latestReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              itemName={itemNameById.get(review.item_id)}
              axisLabels={axisLabels}
            />
          ))}
          {latestReviews.length === 0 && (
            <p className="text-sm text-gray-500">
              まだ承認済みの口コミがありません。
              <Link href="/reviews/post" className="text-brand underline">口コミを投稿する</Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
