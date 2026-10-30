import type { Metadata } from "next";
import { vertical } from "@/config/vertical";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

/**
 * プライバシーポリシー。
 * 設計の前提: 口コミ投稿で取得する個人情報は最小化する（設計書§2/§4）。
 * 連絡先は任意・非公開、投稿者同士の連絡機能は持たない。
 */
export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">プライバシーポリシー</h1>

      <section>
        <h2 className="text-xl font-bold">取得する情報</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
          <li>
            口コミ投稿時: 対象の{vertical.itemNoun}、評価、本文、年代・エリア・利用時期
            （いずれも個人を特定しない粒度で投稿者が入力したもの）。
          </li>
          <li>
            任意で入力された連絡先メールアドレス（掲載前の確認連絡にのみ使用し、公開しません）。
          </li>
          <li>
            送客リンクのクリック記録（リンク先の識別子、リファラ、ブラウザ情報）。
            個人を特定する目的では使いません。
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">利用目的</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
          <li>口コミの掲載可否の確認と掲載</li>
          <li>評価の集計（個人を特定しない統計としてのみ）</li>
          <li>サイトの利用状況の把握と改善</li>
          <li>削除要請等への対応</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">第三者提供</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          取得した個人情報を、本人の同意なく第三者に提供することはありません。
          ただし法令に基づく開示請求がある場合はこの限りではありません。
          未承認の口コミと連絡先は、掲載確認の目的以外に使用しません。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">投稿内容の取り扱い</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          承認された口コミは、投稿者が入力した属性（年代・エリア等）とともに公開されます。
          個人が特定される情報を本文に含めないよう、投稿時にご注意ください。
          掲載後の削除希望は
          <a href="/removal" className="text-brand underline">削除要請窓口</a>
          からご連絡ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">改定</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          本ポリシーを変更する場合は、このページで変更内容と変更日を明示します。
          運営者への問い合わせは
          <a href="/about" className="text-brand underline">運営者情報ページ</a>
          に記載の窓口までお願いします。
        </p>
      </section>
    </div>
  );
}
