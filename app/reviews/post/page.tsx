import type { Metadata } from "next";
import Link from "next/link";
import { getAxes, getPublishedItems } from "@/lib/data";
import { vertical } from "@/config/vertical";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "口コミを投稿する（承認制）",
};

/**
 * 口コミ投稿ページ。
 * 投稿→承認→表示の一方向のみ（投稿者同士が連絡を取り合う機能は付けない：
 * 出会い系サイト規制法の定義に近づけないための設計。検証レポート3-1）。
 */
export default async function ReviewPostPage() {
  const [items, axes] = await Promise.all([getPublishedItems(), getAxes()]);
  const reviewAxes = vertical.axes.filter((a) => a.source === "review_avg");

  return (
    <div>
      <h1 className="text-2xl font-bold">口コミを投稿する</h1>

      <div className="mt-4 space-y-3 rounded border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed">
        <p>
          <span className="font-bold">承認制です。</span>
          投稿は即時公開されません。編集部で掲載基準（下記）を確認したうえで掲載します。
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>実際に利用したご本人の体験だけを投稿してください。他人の体験の転載、伝聞のみの投稿は掲載しません。</li>
          <li>個人が特定される情報（氏名、連絡先、相手の個人情報など）は書かないでください。含まれている場合は掲載しません。</li>
          <li>宣伝目的の投稿、誹謗中傷のみの投稿、公開情報と明確に矛盾する投稿は掲載しません。</li>
          <li>承認/不承認の基準は<Link href="/method" className="text-brand underline">評価方法ページ</Link>で公開しています。</li>
        </ul>
        <p>
          投稿者の連絡先は公開されません。投稿者同士が連絡を取り合う機能はありません。
        </p>
        {axes.length === 0 && (
          <p className="text-gray-500">※ 現在、評価軸データの準備中のため項目別評価は省略されます。</p>
        )}
      </div>

      <div className="mt-6">
        <ReviewForm
          items={items.map((i) => ({ id: i.id, name: i.name }))}
          reviewAxes={reviewAxes}
        />
      </div>
    </div>
  );
}
