import Link from "next/link";
import { getAxes, getRanking, getApprovedReviews } from "@/lib/data";
import { vertical } from "@/config/vertical";
import { formatDate, formatYen } from "@/lib/format";
import ItemCard from "@/components/ItemCard";
import ProfileGallery from "@/components/ProfileGallery";
import { sampleProfiles } from "@/config/profiles";
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
  const clubNameBySlug = new Map(ranking.map((r) => [r.item.slug, r.item.name]));
  const axisLabels = Object.fromEntries(axes.map((a) => [a.key, a.label]));
  const weightSummary = axes.map((a) => `${a.label} ${a.weight}`).join(" / ");

  return (
    <div className="space-y-12">
      {/* FV: 写真＋約束＋CTAだけに圧縮（特徴は下部へ移動） */}
      <section>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.jpg"
            alt="銀座の夜のイメージ（サンプル）"
            className="h-64 w-full rounded object-cover object-top sm:h-80"
          />
          <figcaption className="mt-1 text-right text-xs text-gray-400">
            イメージ写真（サンプル）
          </figcaption>
        </figure>
        <h1 className="mt-4 text-2xl font-bold leading-snug">{vertical.tagline}</h1>
        <p className="mt-3 text-gray-700">{vertical.description}</p>
        {vertical.sampleMode && (
          <p className="mt-3 rounded border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
            現在はデモ用のサンプルデータで動作をご確認いただけます。掲載中の
            {vertical.itemNoun}名・料金・順位はすべて架空のもので、実在の
            {vertical.itemNoun}の情報ではありません。
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/simulator" className="rounded bg-brand px-5 py-2 font-bold text-white">
            料金シミュレーターで総額を比べる
          </Link>
          <Link href="#compare" className="rounded border border-brand px-5 py-2 font-bold text-brand">
            比較表を見る
          </Link>
        </div>
      </section>

      {/* P2: 比較表＋採点式の要約をLP内に内蔵 */}
      <section id="compare">
        <h2 className="text-xl font-bold">料金と評価の比較</h2>
        <p className="mt-2 text-sm text-gray-600">
          編集部が公式情報を一次確認した料金と総合スコアの横断比較です。「非公開」は推測で埋めていません。
        </p>
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand text-left text-white">
                <th className="p-2">{vertical.itemNoun}</th>
                <th className="p-2">総合スコア</th>
                <th className="p-2">{vertical.priceModel.joinLabel}</th>
                <th className="p-2">{vertical.priceModel.annualLabel}</th>
                <th className="p-2">{vertical.priceModel.perUseLabel}</th>
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
                  <td className="p-2">{formatYen(item.price_per_use)}</td>
                  <td className="p-2">{formatDate(item.last_checked_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-500 md:hidden">
          スマートフォンでは下のランキングカードで比較できます。全項目の横断比較は
          <Link href="/compare" className="text-brand underline">比較表ページ</Link>
          にあります。
        </p>
        <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-4 text-sm">
          <p className="font-bold">採点式の要約</p>
          <p className="mt-1 text-gray-700">
            総合スコアは各評価軸（1.0〜5.0）の重み付き平均です。重みは
            {weightSummary ? ` ${weightSummary}` : " 評価方法ページに記載"}
            。順位はこの式だけで決まり、契約や掲載料の有無では動きません。式の全文と根拠の開示方法は
            <Link href="/method" className="text-brand underline">評価方法ページ</Link>
            に公開しています。
          </p>
          <p className="mt-2">
            <Link href="/compare" className="text-brand underline">比較表（全項目）で比べる</Link>
            {" / "}
            <Link href="/simulator" className="text-brand underline">自分の回数で総額を試算する</Link>
          </p>
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
        </p>
      </section>

      {/* P5: 特徴3点はFVからここへ移動 */}
      <section>
        <h2 className="text-xl font-bold">このサイトの約束</h2>
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
      </section>

      <section>
        <h2 className="text-xl font-bold">登録女性のイメージ（サンプル）</h2>
        <div className="mt-4">
          <ProfileGallery profiles={sampleProfiles} clubNameBySlug={clubNameBySlug} />
        </div>
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
          {latestReviews.length === 0 &&
            (vertical.sampleMode ? (
              <p className="text-sm text-gray-500">
                現在、実投稿の受付準備中です。口コミは実在の利用者からの投稿のみを掲載するため、
                架空の口コミは掲載しません。
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                まだ承認済みの口コミがありません。
                <Link href="/reviews/post" className="text-brand underline">口コミを投稿する</Link>
              </p>
            ))}
        </div>
      </section>

      {/* P1: 事業者向けバンド */}
      <section className="rounded border border-brand/30 bg-brand/5 p-5">
        <h2 className="text-lg font-bold">{vertical.itemNoun}運営者の方へ</h2>
        <p className="mt-2 text-sm text-gray-700">
          掲載の仕組み、順位の決まり方、口コミの運用、送客の計測方法を事業者向けにまとめています。
          このページのサンプル掲載が、そのまま御社の掲載イメージです。
        </p>
        <p className="mt-3">
          <Link href="/for-business" className="rounded border border-brand px-4 py-2 font-bold text-brand">
            事業者の方へ（掲載のご案内）
          </Link>
        </p>
      </section>
    </div>
  );
}
