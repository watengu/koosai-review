import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "コラム・編集部記事",
  description: "選び方、料金の見方、トラブル回避など、一次情報に基づいて編集部が作成する記事の一覧。",
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <div>
      <h1 className="text-2xl font-bold">コラム・編集部記事</h1>
      <p className="mt-3 text-sm text-gray-600">
        編集部が公式情報・規約等の一次情報に基づいて作成する記事です。
        体験談の体裁は取りません（編集部調査と口コミの住み分けについては
        <Link href="/method" className="text-brand underline">評価方法ページ</Link>参照）。
      </p>
      <ul className="mt-6 space-y-4">
        {articles.map((a) => (
          <li key={a.id} className="rounded border border-gray-200 p-4">
            <Link href={`/articles/${a.slug}`} className="text-lg font-bold text-brand hover:underline">
              {a.title}
            </Link>
            <p className="mt-1 text-xs text-gray-500">
              {a.kind === "editorial" ? "編集部調査" : "コラム"} ・ {formatDate(a.published_at)}
            </p>
          </li>
        ))}
        {articles.length === 0 && (
          <li className="text-sm text-gray-500">まだ記事がありません。</li>
        )}
      </ul>
    </div>
  );
}
