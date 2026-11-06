import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "見つかりません" };
  return { title: article.title };
}

/**
 * 記事詳細。
 * v0.1 では body をプレーンテキスト（空行で段落分け）として描画する。
 * 本実装では MDX / マークダウンレンダラへの差し替えを想定（README 参照）。
 */
export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();
  const others = (await getArticles()).filter((a) => a.slug !== article.slug);

  const paragraphs = article.body.split(/\n{2,}/).filter(Boolean);

  return (
    <article>
      <p className="text-sm">
        <Link href="/articles" className="text-brand underline">コラム一覧へ戻る</Link>
      </p>
      <h1 className="mt-3 text-2xl font-bold leading-snug">{article.title}</h1>
      <p className="mt-2 text-xs text-gray-500">
        {article.kind === "editorial" ? "編集部調査" : "コラム"} ・ 公開: {formatDate(article.published_at)} ・
        最終更新: {formatDate(article.updated_at)}
      </p>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-800">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-wrap">{p}</p>
        ))}
      </div>
      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="border-l-[6px] border-brand bg-[#F2F5F9] px-4 py-2.5 text-lg font-bold">ほかのコラム</h2>
          <ul className="mt-4 space-y-4">
            {others.map((a) => (
              <li key={a.id} className="rounded border border-gray-200 p-4">
                <Link href={`/articles/${a.slug}`} className="text-base font-bold text-brand hover:underline">
                  {a.title}
                </Link>
                <p className="mt-1 text-xs text-gray-500">
                  {a.kind === "editorial" ? "編集部調査" : "コラム"} ・ {formatDate(a.published_at)}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link href="/articles" className="text-brand underline">コラム一覧を見る</Link>
          </p>
        </section>
      )}
    </article>
  );
}
