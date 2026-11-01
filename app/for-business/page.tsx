import type { Metadata } from "next";
import Link from "next/link";
import { vertical } from "@/config/vertical";

export const metadata: Metadata = {
  title: `事業者の方へ（掲載のご案内） | ${vertical.itemNoun}を掲載したい運営者様へ`,
};

export default function ForBusinessPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">{vertical.itemNoun}運営者の方へ（掲載のご案内）</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          このページは、{vertical.itemNoun}を運営する事業者の方向けに、掲載の仕組みをまとめたものです。
          現在サイトはサンプルデータで公開しており、ここに載っているサンプル掲載が、
          そのまま実際の掲載イメージになります。
        </p>
        {vertical.sampleMode && (
          <p className="mt-3 rounded border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
            現在はデモ公開中です。掲載相談の窓口は運営体制の確定後に開設します（このページの構成は先行公開しています）。
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold">掲載されると、こう見えます</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            各{vertical.itemNoun}には専用ページができ、写真、料金（入会金・年会費・セッティング料）、
            根拠つきの評価軸スコア、登録女性のプロフィール例、承認済み口コミが載ります。
            サンプルの掲載ページをご覧ください。
          </p>
          <p className="flex flex-wrap gap-3">
            <Link
              href="/items/sample-lumiere"
              className="rounded border border-brand px-4 py-2 font-bold text-brand"
            >
              掲載ページの見本を見る（高級サロン型）
            </Link>
            <Link
              href="/items/sample-rin"
              className="rounded border border-brand px-4 py-2 font-bold text-brand"
            >
              掲載ページの見本を見る（始めやすい価格型）
            </Link>
          </p>
          <p>
            全{vertical.itemNoun}は
            <Link href="/compare" className="text-brand underline">比較表</Link>
            と
            <Link href="/ranking" className="text-brand underline">ランキング</Link>
            にも並び、利用者は料金シミュレーターで総額を試算してから各ページへ進みます。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">順位の決まり方（契約で順位は動きません）</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            順位とスコアは、
            <Link href="/method" className="text-brand underline">評価方法ページ</Link>
            で全文を公開している採点式と重みだけで決まります。掲載の契約や紹介報酬の有無で
            順位・スコアが変わることはありません。これは利用者への約束であると同時に、
            掲載する側にとっても「他社の支払いで自社が下がることがない」という保証です。
          </p>
          <p>
            スコアには必ず根拠（公式情報の確認結果や実投稿の集計）が付き、各ページに最終確認日を表示します。
            情報に誤りがあれば、確認のうえ訂正します。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">口コミの運用</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            口コミは承認制の実投稿のみです。運営側が書いた口コミ、対価と引き換えの投稿は掲載しません。
            投稿から掲載までの流れは
            <Link href="/method" className="text-brand underline">評価方法ページ</Link>
            に図解しています。
          </p>
          <p>
            掲載内容に事実誤認・個人情報・権利侵害がある場合は、
            <Link href="/removal" className="text-brand underline">削除要請窓口</Link>
            から是正を求めることができます。口コミそのものを金銭や契約で削除・改変することはありませんが、
            事実でない内容が野放しになることもありません。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">送客の計測</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            各掲載ページの「公式サイトで確認する」ボタンは計測用のリンクを経由し、クリック数が
            {vertical.itemNoun}ごとに記録されます。紹介の成果はクリック記録をもとに集計でき、
            「何件の送客があったか」を双方で同じ数字で確認できる形を目指しています。
            詳細ページのボタン部分で、見本表示を確認できます。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">掲載の相談について</h2>
        <div className="mt-3 rounded border border-dashed border-gray-300 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
          <p className="font-bold">現在、窓口は準備中です</p>
          <p className="mt-1">
            掲載相談の受付窓口は、運営者情報の確定後にこのページで開設します。
            開設までは、サイトの運営方針を
            <Link href="/about" className="text-brand underline">運営者情報・PR表記</Link>
            でご確認ください。準備が整い次第、このページからそのまま申し込める形にします。
          </p>
        </div>
      </section>
    </div>
  );
}
