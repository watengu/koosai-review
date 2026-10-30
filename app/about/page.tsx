import type { Metadata } from "next";
import Link from "next/link";
import { vertical } from "@/config/vertical";

export const metadata: Metadata = {
  title: "運営者情報・PR表記について",
};

/**
 * 運営者情報・PR表記ページ。
 * 運営者名・連絡先はバーティカル設定（legal）から描画する。
 * 未決の項目はプレースホルダのまま表示されるため、公開前に必ず実値へ
 * 差し替えること（docs/deploy-checklist.md 参照）。
 */
export default function AboutPage() {
  const { legal } = vertical;
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">運営者情報・PR表記について</h1>
        <table className="mt-4 w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="w-40 bg-gray-50 p-2 text-left">サイト名</th>
              <td className="p-2">{vertical.siteName}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 p-2 text-left">運営者</th>
              <td className="p-2">{legal.operatorName}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 p-2 text-left">所在地</th>
              <td className="p-2">{legal.address}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 p-2 text-left">問い合わせ</th>
              <td className="p-2">{legal.contactEmail}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-bold">広告・PR表記の運用ルール</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
          <li>
            当サイトは広告・紹介報酬を含むコンテンツを含みます。その旨は全ページの
            冒頭（ヘッダー直下）に常時表示しています。紹介報酬の対象となるリンクには
            近くに「PR」と明記します。
          </li>
          <li>
            掲載順位は<Link href="/method" className="text-brand underline">評価方法ページ</Link>で
            公開した採点式のみで決定します。広告・契約の有無で順位を操作しません。
          </li>
          <li>
            口コミは承認制の実投稿のみを掲載します。運営者・関係者による自作自演、
            対価を伏せた依頼投稿は行いません（景品表示法のステマ規制・優良誤認への対応）。
          </li>
          <li>
            編集部が作成するデータ記事は「編集部調査」と明示し、体験談の体裁を取りません。
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">削除要請・権利侵害の申告</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          掲載内容に事実誤認、個人情報の混入、権利侵害がある場合は
          <Link href="/removal" className="text-brand underline">削除要請窓口</Link>
          からご連絡ください。プロバイダ責任制限法に基づく手続きに沿って対応します。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">免責</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          掲載情報は編集部が確認した時点のものです。料金・条件は変更される場合が
          あるため、申込前に各{vertical.itemNoun}の公式情報で最新内容をご確認ください。
          当サイトは{vertical.itemNoun}と利用者の間の仲介を行うものではありません。
        </p>
      </section>
    </div>
  );
}
