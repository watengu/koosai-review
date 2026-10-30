import type { Metadata } from "next";
import { vertical } from "@/config/vertical";

export const metadata: Metadata = {
  title: "削除要請窓口",
};

/**
 * 削除要請窓口（プロバイダ責任制限法対応）。
 * 受付はメール想定。受付アドレスはバーティカル設定 legal.contactEmail
 * （未決の間はプレースホルダ表示になるため、公開前に必ず差し替える）。
 */
export default function RemovalPage() {
  const { legal } = vertical;
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">削除要請窓口</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          当サイトの掲載内容（口コミ・記事・スペック情報等）について、事実誤認、
          個人情報の混入、名誉毀損その他の権利侵害がある場合は、下記の窓口まで
          ご連絡ください。プロバイダ責任制限法に基づく送信防止措置の手続きに沿って、
          内容を確認のうえ対応します。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">連絡先</h2>
        <table className="mt-3 w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="w-40 bg-gray-50 p-2 text-left">受付窓口</th>
              <td className="p-2">{vertical.siteName} 運営者（{legal.operatorName}）</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 p-2 text-left">メール</th>
              <td className="p-2">{legal.contactEmail}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-bold">ご連絡いただく内容</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
          <li>対象ページのURLと、問題のある箇所の特定</li>
          <li>申告の理由（侵害されている権利とその内容）</li>
          <li>申告者の氏名・連絡先（対応結果のご連絡に使います）</li>
          <li>権利者ご本人でない場合は、その関係性が分かる情報</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          内容によっては、発信者への意見照会を行ったうえで送信防止措置の可否を
          判断します。措置を行わない場合は、その旨と理由をご連絡します。
        </p>
      </section>
    </div>
  );
}
