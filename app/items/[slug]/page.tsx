import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getApprovedReviews,
  getAxes,
  getItemBySlug,
  getLinksForItem,
  getScores,
} from "@/lib/data";
import { computeTotalScore } from "@/lib/scoring";
import { formatDate, formatSpecValue, formatYen } from "@/lib/format";
import { vertical } from "@/config/vertical";
import ScoreBar from "@/components/ScoreBar";
import ReviewCard from "@/components/ReviewCard";
import ProfileGallery from "@/components/ProfileGallery";
import { profilesForClub } from "@/config/profiles";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = await getItemBySlug(params.slug);
  if (!item) return { title: "見つかりません" };
  return {
    title: `${item.name}の料金・評価・口コミ`,
    description:
      item.summary ?? `${item.name}のスペック、評価軸別スコアと根拠、承認済み口コミ、最終確認日を掲載。`,
  };
}

export default async function ItemDetailPage({ params }: { params: { slug: string } }) {
  const item = await getItemBySlug(params.slug);
  if (!item) notFound();

  const [axes, scores, reviews, links] = await Promise.all([
    getAxes(),
    getScores(item.id),
    getApprovedReviews({ itemId: item.id }),
    getLinksForItem(item.id),
  ]);
  const { total, scoredAxes } = computeTotalScore(scores, axes);
  const scoreByAxis = new Map(scores.map((s) => [s.axis_key, s]));
  const axisLabels = Object.fromEntries(axes.map((a) => [a.key, a.label]));
  const officialLinks = links.filter((l) => l.kind === "official");
  const affiliateLinks = links.filter((l) => l.kind === "affiliate");

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        {item.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.slug.startsWith("sample-") ? `${item.name}のイメージ（サンプル）` : `${item.name}のイメージ（公式提供）`}
            className="mt-4 h-64 w-full rounded object-cover object-top"
          />
        )}
        {!item.slug.startsWith("sample-") && (
          <p className="mt-3">
            <span className="rounded bg-[#B08D3E] px-2 py-1 text-xs font-bold text-white">実在クラブ・公式確認済み</span>
          </p>
        )}
        {item.summary && <p className="mt-3 text-gray-700">{item.summary}</p>}
        <p className="mt-3 text-sm text-gray-500">
          総合スコア:{" "}
          {total !== null ? (
            <span className="text-lg font-bold text-brand">{total.toFixed(1)} / 100</span>
          ) : (
            "採点中"
          )}
          （{scoredAxes}/{axes.length}軸で採点） ・ 最終確認日: {formatDate(item.last_checked_at)}
        </p>

        {/* 公式CTA: クリック計測つきリダイレクト /go/[id] を経由する。
            affiliate の場合は PR である旨をボタンの近くに明記する。 */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {officialLinks.map((l) => (
            <a
              key={l.id}
              href={`/go/${l.id}`}
              className="rounded bg-brand px-5 py-2 font-bold text-white"
            >
              {l.label}
            </a>
          ))}
          {affiliateLinks.map((l) => (
            <span key={l.id} className="inline-flex items-center gap-2">
              <a
                href={`/go/${l.id}`}
                className="rounded border border-brand px-5 py-2 font-bold text-brand"
              >
                {l.label}
              </a>
              <span className="text-xs text-gray-500">PR（紹介報酬の対象リンクです）</span>
            </span>
          ))}
          {links.length === 0 && item.official_url && (
            <a
              href={item.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-brand px-5 py-2 font-bold text-white"
            >
              公式サイトを見る
            </a>
          )}
          {links.length === 0 && !item.official_url && vertical.sampleMode && (
            <div className="w-full rounded border border-dashed border-gray-300 bg-gray-50 p-4">
              <span
                aria-disabled="true"
                className="inline-block cursor-not-allowed rounded bg-gray-300 px-5 py-2 font-bold text-gray-500"
              >
                公式サイトで確認する
              </span>
              <p className="mt-2 text-xs text-gray-500">
                ※ これは送客ボタンの見本表示です（サンプルのためリンクは無効です）。
                実運用では、このボタンから各{vertical.itemNoun}の公式ページへ進み、
                クリック数が{vertical.itemNoun}ごとに計測されます。
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">スペック</h2>
        <table className="mt-3 w-full border-collapse text-sm">
          <tbody>
            {typeof item.specs?.fee_classes === "string" && (
              <tr className="border-b border-gray-200 bg-brand text-white">
                <th colSpan={2} className="p-2 text-left font-bold">男性会員システム</th>
              </tr>
            )}
            <tr className="border-b border-gray-200">
              <th className="w-40 bg-gray-50 p-2 text-left">{vertical.priceModel.joinLabel}</th>
              <td className="p-2">{formatYen(item.price_join)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 p-2 text-left">{vertical.priceModel.annualLabel}</th>
              <td className="p-2">{formatYen(item.price_annual)}</td>
            </tr>
            {typeof item.specs?.fee_classes === "string" ? (
              <tr className="border-b border-gray-200">
                <th className="bg-gray-50 p-2 text-left">紹介料</th>
                <td className="p-2">{item.specs.fee_classes as string}</td>
              </tr>
            ) : (
              <tr className="border-b border-gray-200">
                <th className="bg-gray-50 p-2 text-left">{vertical.priceModel.perUseLabel}</th>
                <td className="p-2">{formatYen(item.price_per_use)}</td>
              </tr>
            )}
            {typeof item.specs?.trial_campaign === "string" && (
              <tr className="border-b border-gray-200">
                <th className="bg-gray-50 p-2 text-left">お試しキャンペーン</th>
                <td className="p-2">{item.specs.trial_campaign as string}</td>
              </tr>
            )}
            {typeof item.specs?.member_rank_access === "string" && (
              <tr className="border-b border-gray-200">
                <th className="bg-gray-50 p-2 text-left">紹介可能な女性</th>
                <td className="p-2">{item.specs.member_rank_access as string}</td>
              </tr>
            )}
            {vertical.specFields.map((f) => {
              const value = item.specs?.[f.key];
              // hide_unconfirmed_specs が立つクラブ（東京Ritz）では、値が無い行は行ごと出さない
              if (item.specs?.hide_unconfirmed_specs === true && (value === null || value === undefined)) {
                return null;
              }
              return (
                <tr key={f.key} className="border-b border-gray-200">
                  <th className="bg-gray-50 p-2 text-left">
                    {typeof item.specs?.[`${f.key}_label`] === "string" ? (item.specs[`${f.key}_label`] as string) : f.label}
                  </th>
                  <td className="p-2">{formatSpecValue(value, f.format)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-400">
          {item.slug.startsWith("sample-")
            ? "※ 現在表示しているのはデモ用のサンプルデータです。実在のクラブの情報ではありません。"
            : "※ 編集部が公式情報を一次確認した内容です（編集部調査）。金額は確認時点のもので、最新情報は公式情報をご確認ください。"}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">評価軸別スコアと根拠</h2>
        <div className="mt-3 space-y-3">
          {axes.map((axis) => {
            const s = scoreByAxis.get(axis.key);
            return (
              <div key={axis.key} className="rounded border border-gray-200 p-3">
                <ScoreBar label={axis.label} score={s?.score ?? null} maxScore={axis.max_score} />
                {s?.basis && <p className="mt-2 text-sm text-gray-600">根拠: {s.basis}</p>}
                <p className="mt-1 text-xs text-gray-400">
                  出どころ: {s?.source === "review_avg" ? "実投稿口コミの集計" : "編集部の一次確認"}
                  {s?.checked_at && ` ・ 確認日: ${formatDate(s.checked_at)}`}
                  {s?.source_url && (
                    <>
                      {" ・ "}
                      <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="underline">
                        出典
                      </a>
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm">
          採点式の全文は
          <Link href="/method" className="text-brand underline">評価方法ページ</Link>
          で公開しています。
        </p>
      </section>

      {profilesForClub(item.slug).length > 0 && (
        <section>
          <h2 className="text-xl font-bold">登録女性のイメージ（サンプル）</h2>
          <div className="mt-4">
            <ProfileGallery profiles={profilesForClub(item.slug)} />
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold">口コミ（承認済み・{reviews.length}件）</h2>
        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} axisLabels={axisLabels} />
          ))}
          {reviews.length === 0 && (
            <p className="text-sm text-gray-500">まだ承認済みの口コミがありません。</p>
          )}
        </div>
        <p className="mt-4">
          <Link href="/reviews/post" className="rounded border border-brand px-4 py-2 font-bold text-brand">
            この{vertical.itemNoun}の口コミを投稿する
          </Link>
        </p>
      </section>
    </div>
  );
}
