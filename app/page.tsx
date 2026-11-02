import Link from "next/link";
import { getAxes, getRanking, getApprovedReviews } from "@/lib/data";
import { vertical } from "@/config/vertical";
import { formatDate, formatYen } from "@/lib/format";
import ReviewCard from "@/components/ReviewCard";

export const revalidate = 300;

/** B3「表がFV」: FVで結論と総額を出し、比較表＋採点式を入口に内蔵するロングLP。 */
export default async function HomePage() {
  const [ranking, latestReviews, axes] = await Promise.all([
    getRanking(),
    getApprovedReviews({ limit: 5 }),
    getAxes(),
  ]);
  const itemNameById = new Map(ranking.map((r) => [r.item.id, r.item.name]));
  const axisLabels = Object.fromEntries(axes.map((a) => [a.key, a.label]));
  const weightSummary = axes.map((a) => `${a.label}${a.weight}`).join("／");
  const fullPublic = ranking.filter(
    (r) => r.item.price_join !== null && r.item.price_annual !== null && r.item.price_per_use !== null,
  ).length;
  const lastChecked = ranking
    .map((r) => r.item.last_checked_at)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
  const annualTotal = (join: number | null, annual: number | null, perUse: number | null) =>
    join === null || annual === null || perUse === null ? null : join + annual + perUse * 24;
  const evidence = ["sample-lumiere", "sample-rin"]
    .map((slug) => ranking.find((r) => r.item.slug === slug))
    .filter((r) => r !== undefined);

  return (
    <div className="space-y-14">
      {/* FV: 結論＋強い写真1枚＋実測カウント */}
      <section className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-[57%]">
          <h1 className="text-3xl font-bold leading-snug">
            面談に行く前に、<span className="text-[#C73E2C]">総額は分かります。</span>
            <br />
            {vertical.itemNoun}
            {ranking.length}社を、料金で比べました。
          </h1>
          <p className="mt-4 leading-relaxed text-gray-700">
            入会金だけを見て決めると、総額で負けます。このページは全社の料金を確認し、
            あなたの回数で年間総額まで計算して並べたものです。採点式は全文公開。
            順位は契約では動きません。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded border border-gray-300 bg-gray-50 px-3 py-2">
              <b className="text-lg text-brand">{ranking.length}</b> 社を公式確認（サンプル）
            </span>
            <span className="rounded border border-gray-300 bg-gray-50 px-3 py-2">
              <b className="text-lg text-brand">{fullPublic}</b> 社が3項目すべて公開
            </span>
            <span className="rounded border border-gray-300 bg-gray-50 px-3 py-2">
              <b className="text-lg text-brand">{lastChecked ? formatDate(lastChecked) : "—"}</b>{" "}
              最終確認日を全社表示
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#conclusion" className="rounded bg-brand px-5 py-2 font-bold text-white">
              結論の表を見る
            </Link>
            <Link
              href="/simulator"
              className="rounded border border-brand px-5 py-2 font-bold text-brand"
            >
              自分の回数で試算する
            </Link>
          </div>
        </div>
        <figure className="md:w-[43%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.jpg"
            alt="銀座の夜のイメージ（サンプル）"
            className="h-64 w-full rounded object-cover object-top md:h-[330px]"
          />
          <figcaption className="mt-1 text-right text-xs text-gray-400">
            イメージ写真（サンプル）
          </figcaption>
        </figure>
      </section>

      {/* 結論の表＋採点式 */}
      <section id="conclusion">
        <p className="text-xs font-bold tracking-widest text-[#C73E2C]">結論の表</p>
        <h2 className="mt-2 text-xl font-bold">比べるのは入会金ではなく、総額です。</h2>
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand text-left text-white">
                <th className="p-2">{vertical.itemNoun}</th>
                <th className="p-2">総合スコア</th>
                <th className="p-2">{vertical.priceModel.joinLabel}</th>
                <th className="p-2">{vertical.priceModel.annualLabel}</th>
                <th className="p-2">{vertical.priceModel.perUseLabel}</th>
                <th className="p-2">年間総額（月2回）</th>
                <th className="p-2">最終確認日</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map(({ item, totalScore }) => {
                const total = annualTotal(item.price_join, item.price_annual, item.price_per_use);
                return (
                  <tr key={item.id} className="border-b border-gray-200 align-top">
                    <td className="p-2 font-bold">
                      <Link href={`/items/${item.slug}`} className="text-brand hover:underline">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2 font-bold text-[#C73E2C]">
                      {totalScore !== null ? totalScore.toFixed(1) : "—"}
                    </td>
                    <td className="p-2">{formatYen(item.price_join)}</td>
                    <td className="p-2">{formatYen(item.price_annual)}</td>
                    <td className="p-2">{formatYen(item.price_per_use)}</td>
                    <td className="p-2 font-bold">{total !== null ? formatYen(total) : "試算不可"}</td>
                    <td className="p-2">{formatDate(item.last_checked_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-500 md:hidden">
          スマートフォンでは
          <Link href="/compare" className="text-brand underline">比較表ページ</Link>
          で全項目を比べられます。
        </p>
        <div className="mt-4 rounded border-l-4 border-[#C73E2C] bg-gray-50 p-4 text-sm leading-relaxed">
          <b>この表の採点式</b>：総合スコア＝評価軸（{weightSummary}）の重み付き集計（100点満点）。
          料金が非公開の社は「試算不可」とし、順位の根拠は
          <Link href="/method" className="text-brand underline">評価方法ページ</Link>
          で全公開します。契約で順位は動きません。
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded border border-gray-200 p-4">
            <p className="font-bold">総額を決めるのは、会うたびの料金</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              入会金と年会費は一度きり。セッティング料は会う回数だけ積み上がります。
              だから比較は「自分の回数での総額」でしか意味を持ちません。
            </p>
          </div>
          <div className="rounded border border-gray-200 p-4">
            <p className="font-bold">非公開は、非公開と書く</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              公式で金額を確認できない社は推測で埋めません。
              「面談まで総額が分からない」こと自体を、判断材料として表示します。
            </p>
          </div>
          <div className="rounded border border-gray-200 p-4">
            <p className="font-bold">確認日を、全社に出す</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              料金は変わります。いつの情報か分からない比較表は信用できません。
              全社に最終確認日を付けています。
            </p>
          </div>
        </div>
      </section>

      {/* 中身の証拠 */}
      <section>
        <p className="text-xs font-bold tracking-widest text-[#C73E2C]">中身の証拠</p>
        <h2 className="mt-2 text-xl font-bold">各社のページには、根拠まで載っています。</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {evidence.map(({ item, totalScore }) => (
            <article
              key={item.id}
              className="flex overflow-hidden rounded border border-gray-200"
            >
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt={`${item.name}のイメージ（サンプル）`}
                  className="w-40 shrink-0 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold">
                  <Link href={`/items/${item.slug}`} className="hover:underline">
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-1 font-bold text-[#C73E2C]">
                  総合 {totalScore !== null ? totalScore.toFixed(1) : "—"} / 100
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.summary}</p>
                <p className="mt-2 text-xs text-gray-400">
                  根拠は詳細ページで軸ごとに開示｜最終確認日 {formatDate(item.last_checked_at)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4">
          <Link href="/ranking" className="text-brand underline">
            ランキング全文を見る
          </Link>
        </p>
      </section>

      {/* 流れ（シミュレーター） */}
      <section className="rounded bg-brand p-6 text-white md:p-8">
        <p className="text-xs font-bold tracking-widest text-[#E8B4AC]">流れ</p>
        <h2 className="mt-2 text-xl font-bold">あなたの回数で、総額を出してから決める。</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded border border-white/25 bg-white/10 p-4">
            <p className="text-xs font-bold tracking-widest text-[#E8B4AC]">STEP 1</p>
            <p className="mt-2 font-bold">回数を決める</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-200">
              月1回か、月2回か。会うペースで総額は大きく変わります。
            </p>
          </div>
          <div className="rounded border border-white/25 bg-white/10 p-4">
            <p className="text-xs font-bold tracking-widest text-[#E8B4AC]">STEP 2</p>
            <p className="mt-2 font-bold">総額を試算する</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-200">
              シミュレーターが全社の年間総額を並べ替えます。非公開の社は試算不可と出ます。
            </p>
          </div>
          <div className="rounded border border-white/25 bg-white/10 p-4">
            <p className="text-xs font-bold tracking-widest text-[#E8B4AC]">STEP 3</p>
            <p className="mt-2 font-bold">公式で確認する</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-200">
              候補を絞ったら、各クラブ公式で最新情報を確かめて申し込みます。
            </p>
          </div>
        </div>
        <p className="mt-5">
          <Link
            href="/simulator"
            className="inline-block rounded bg-white px-5 py-2 font-bold text-brand"
          >
            料金シミュレーターで試算する
          </Link>
        </p>
      </section>

      {/* 口コミ（実投稿のみ・枠組み維持） */}
      <section>
        <p className="text-xs font-bold tracking-widest text-[#C73E2C]">口コミ</p>
        <h2 className="mt-2 text-xl font-bold">口コミは、実投稿だけを数えます。</h2>
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
                架空の口コミは掲載しません。投稿から掲載までの流れは
                <Link href="/method" className="text-brand underline">評価方法ページ</Link>
                に公開しています。
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                まだ承認済みの口コミがありません。
                <Link href="/reviews/post" className="text-brand underline">口コミを投稿する</Link>
              </p>
            ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <p className="text-xs font-bold tracking-widest text-[#C73E2C]">よくある質問</p>
        <h2 className="mt-2 text-xl font-bold">申し込む前の、当然の疑問に答えます。</h2>
        <div className="mt-5 space-y-6">
          <div className="border-t border-gray-200 pt-4">
            <p className="font-bold">Q. なぜ順位を信用できるのですか？</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              採点式と重みを全文公開しているからです。同じ計算は誰でもやり直せます。
              契約で順位が動くなら、その時点でこのサイトの存在理由が消えます。
            </p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="font-bold">Q. お手当は総額に入っていますか？</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              入っていません。総額はクラブへ払う費用のみです。女性へ直接渡すお手当は
              当事者間で決まるものなので、相場として数字は出しません。
            </p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="font-bold">Q. 口コミはありますか？</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              承認制の実投稿のみを載せる設計です。運営が書いた口コミは載せません。
              投稿が無い社は「データ不足」と表示します。
            </p>
          </div>
        </div>
      </section>

      {/* 着地CTA */}
      <section className="rounded bg-gray-50 px-6 py-12 text-center">
        <p className="text-2xl font-bold leading-relaxed">入会金の安さで、選ばないでください。</p>
        <p className="mt-6">
          <Link
            href="#conclusion"
            className="inline-block rounded bg-[#C73E2C] px-8 py-3 font-bold text-white"
          >
            総額で比べる（結論の表へ）
          </Link>
        </p>
      </section>
    </div>
  );
}
