import type { Metadata } from "next";
import Link from "next/link";
import { vertical } from "@/config/vertical";

export const metadata: Metadata = {
  title: "評価方法について（採点式・口コミポリシー）",
  description:
    "総合スコアの採点式と重みの全文、評価軸の定義、口コミの収集・承認ポリシー、情報の確認手順を公開するページ。",
};

/**
 * 評価方法ページ = 信頼担保の中核。
 * 採点式と重みはバーティカル設定（=DB の review_axes）からそのまま描画し、
 * 「サイトに書いてある式」と「実際に計算している式」がズレないようにする。
 */
export default function MethodPage() {
  const axes = vertical.axes;
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">評価方法について</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          当サイトの順位は、このページで公開している採点式と重みだけで機械的に
          算出しています。契約の有無（送客リンクの有無を含む）で順位を操作する
          ことはありません。再計算に必要な情報はすべてこのページと各
          {vertical.itemNoun}の詳細ページ（軸ごとの根拠・出典・確認日）にあります。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">採点式</h2>
        <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed">
          <p className="font-mono">
            総合スコア（100点満点） = Σ（軸スコア ÷ 満点 × 重み）÷ Σ（採点済み軸の重み）× 100
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>データが不足している軸は採点せず、分子・分母の両方から除外します。「口コミ収集中」と表示されている軸がそれです。</li>
            <li>実投稿が集計に使われる軸は、承認済み口コミの平均値だけを使います。編集部がその軸に点数を付けることはありません。</li>
            <li>スコアはデータ更新（料金改定の確認、口コミの承認）のたびに再計算します。</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">評価軸と重み</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand text-left text-white">
                <th className="p-2">評価軸</th>
                <th className="p-2">重み</th>
                <th className="p-2">出どころ</th>
                <th className="p-2">定義</th>
              </tr>
            </thead>
            <tbody>
              {axes.map((a) => (
                <tr key={a.key} className="border-b border-gray-200 align-top">
                  <td className="p-2 font-bold">{a.label}</td>
                  <td className="p-2">{a.weight}</td>
                  <td className="p-2">{a.source === "review_avg" ? "実投稿の集計" : "編集部の一次確認"}</td>
                  <td className="p-2">{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          ※ 重みを含む採点式は、変更する場合はこのページで変更後の式と変更日を明示します。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">口コミの収集・承認ポリシー</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            口コミは投稿フォームからの利用者本人の申告のみを受け付け、承認制で掲載します。
            掲載時には「投稿者申告に基づく口コミ（編集部で公開情報との矛盾を確認済み）」の
            注記を付け、検証済みの体験であるかのような表現はしません。
          </p>
          <p className="font-bold">承認するもの / しないもの</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>承認: 具体的な利用内容があり、料金・手続き・エリア等の公開情報と矛盾しないもの。</li>
            <li>不承認: 個人情報が含まれるもの、宣伝目的と判断されるもの、誹謗中傷のみのもの、伝聞のみのもの。</li>
          </ul>
          <p className="font-bold">自作自演の禁止（運営ルール）</p>
          <p>
            運営者・関係者が利用者を装って口コミを書く行為、第三者に対価を渡して
            口コミを書かせる行為は、景品表示法（ステマ規制・優良誤認）の観点から
            全面禁止とし、当サイトでは行いません。対価と引き換えの投稿促進を行う
            場合でも、その事実を開示しない形は採用しません。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">口コミが掲載されるまでの流れ</h2>
        <ol className="mt-4 space-y-0 text-sm">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">1</span>
            <div className="pb-5">
              <p className="font-bold">投稿（利用者本人）</p>
              <p className="mt-1 text-gray-700">
                投稿フォームから、利用した{vertical.itemNoun}・時期・評価軸ごとの点数と本文を送ります。
                運営者や{vertical.itemNoun}の関係者による投稿は対象外です。
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">2</span>
            <div className="pb-5">
              <p className="font-bold">承認審査（編集部）</p>
              <p className="mt-1 text-gray-700">
                料金・手続き・エリアなどの公開情報との矛盾、個人情報の混入、宣伝目的や誹謗中傷のみでないかを
                上のポリシーに沿って確認します。通過しない投稿は掲載されません。
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">3</span>
            <div className="pb-5">
              <p className="font-bold">掲載と集計への反映</p>
              <p className="mt-1 text-gray-700">
                承認された口コミだけが掲載され、件数として数えられます。評価軸のうち実投稿の集計を使う軸は、
                承認済みの投稿の平均として各{vertical.itemNoun}ページに分布とあわせて表示します。
                投稿が無い{vertical.itemNoun}は「データ不足」と表示し、推測では埋めません。
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">4</span>
            <div>
              <p className="font-bold">是正の窓口（掲載先・関係者）</p>
              <p className="mt-1 text-gray-700">
                掲載内容に事実誤認や権利侵害がある場合は、
                <Link href="/removal" className="text-brand underline">削除要請窓口</Link>
                からご連絡いただけます。要請を受けた内容は確認のうえ、ポリシーに沿って対応します。
                口コミそのものを金銭や契約で削除・改変することはありません。
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-bold">情報の確認手順</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {vertical.itemNoun}の料金・スペックは公式情報を一次確認し、確認した日を
          「最終確認日」として各ページに表示します。金額が公式に確認できない項目は
          項目ごと表示せず、推測で埋めることはありません。
          掲載対象は、関係条例の届出等が確認できるものに限ります。
        </p>
      </section>
    </div>
  );
}
