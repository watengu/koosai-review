import type { Metadata } from "next";
import Link from "next/link";
import { vertical } from "@/config/vertical";

export const metadata: Metadata = {
  title: "クラブ様へ（掲載について）",
  description: "交際クラブ比較案内への掲載について。掲載は無料、編集は自社アカウントで、取り下げはいつでも可能です。",
};

const steps = [
  {
    title: "お申し込み",
    body: "掲載のお申し込みを受け付けます。クラブ名と公式サイトのURLをお知らせください。",
  },
  {
    title: "運営による確認",
    body: "出会い系サイト規制法の届出の有無と、公式に公開されている料金・スペックを確認します。確認が取れたクラブのみ掲載します。",
  },
  {
    title: "掲載内容の作成と編集",
    body: "運営が確認した情報で掲載ページを作成します。掲載後は、クラブ様専用のアカウントで料金・紹介文などをご自身で編集できます。",
  },
  {
    title: "公開前の最終確認（1回）",
    body: "編集した内容は、公開前に運営が1回確認します。事実と異なる記載がないかを見るための確認で、表現の方向性に口を出すものではありません。",
  },
  {
    title: "公開",
    body: "確認が済んだら公開します。順位は公開している採点式のみで決まり、掲載料や契約の有無で変わることはありません。",
  },
];

export default function ForClubsPage() {
  return (
    <div className="space-y-10 leading-relaxed">
      <section>
        <h1 className="text-2xl font-bold">クラブ様へ（掲載について）</h1>
        <p className="mt-4 text-gray-700">
          交際クラブ比較案内は、料金と根拠を全部開示して{vertical.itemNoun}を比較する案内サイトです。
          掲載をご希望のクラブ様向けに、掲載の条件と流れをまとめました。
        </p>
        {vertical.sampleMode && (
          <p className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            現在、掲載中の実在クラブは東京Ritzと南青山Classyの2社で、その他は架空のサンプルです。実際のお申し込み受け付けは、
            運営者情報の確定後に開始します。
          </p>
        )}
      </section>

      <section className="rounded border-2 border-brand bg-[#FBFCFE] p-5">
        <h2 className="text-lg font-bold">掲載は無料です</h2>
        <p className="mt-2 text-gray-700">
          掲載料・月額費用はかかりません。無料である代わりに、順位を優遇することもありません。
          順位は<Link href="/method" className="text-brand underline">評価方法ページ</Link>
          で公開している採点式のみで決まります。料金を公開しているクラブほど、比較の土俵で正当に評価される仕組みです。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold">掲載までの流れ</h2>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="mt-1 text-gray-700">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-bold">掲載後は、自分のアカウントで編集できます</h2>
        <p className="mt-2 text-gray-700">
          掲載が始まったら、クラブ様専用のアカウントをお渡しします。料金の改定や紹介文の更新は、
          運営に依頼しなくてもご自身で編集できます。編集した内容は、公開前に運営が1回確認してから反映されます。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold">取り下げは、いつでもボタン一つで</h2>
        <p className="mt-2 text-gray-700">
          掲載の取り下げは、アカウントの画面からボタン一つでいつでも行えます。理由をお聞きすることも、
          引き留めることもありません。取り下げ後に再び掲載をご希望の場合は、改めて新規のお申し込みとして受け付けます
          （以前の掲載内容は引き継がれません）。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold">口コミは作りません</h2>
        <p className="mt-2 text-gray-700">
          このサイトでは、運営が口コミを書くことは一切しません。掲載するのは、実際の利用者から投稿され、
          承認手続きを経た声だけです。投稿がないクラブは「口コミはまだありません」とそのまま表示します。
          クラブ様から口コミの掲載や削除を依頼されても、実投稿でないものは載せず、実投稿は正当な理由なく消しません。
        </p>
      </section>

      <section className="rounded border border-[#06C755] bg-[#F4FBF6] p-5 text-center">
        <h2 className="text-lg font-bold">お問い合わせは、LINE公式アカウントから</h2>
        <p className="mt-2 text-gray-700">
          掲載のお申し込み・ご相談は、LINE公式アカウントで受け付けます。
          クラブ名と公式サイトのURLを送っていただければ、運営から折り返しご連絡します。
        </p>
        <p className="mt-4">
          <span className="inline-block rounded-full bg-[#06C755] px-6 py-3 font-bold text-white opacity-60">
            LINEで問い合わせる
          </span>
          <span className="ml-2 align-middle text-sm font-bold text-gray-500">準備中</span>
        </p>
        <p className="mt-3 text-sm text-gray-500">
          LINE公式アカウントは開設準備中です。開設後、このボタンから友だち追加とお問い合わせができるようになります。
        </p>
      </section>

      <section className="rounded bg-gray-50 p-5 text-center">
        <p className="font-bold">掲載のお申し込み窓口は、運営者情報の確定後に開設します。</p>
        <p className="mt-2 text-sm text-gray-500">
          現在はデモ公開中のプレビュー表示です。サイトの考え方は
          <Link href="/about" className="text-brand underline">運営者情報</Link>
          と<Link href="/method" className="text-brand underline">評価方法</Link>
          に公開しています。
        </p>
      </section>
    </div>
  );
}
