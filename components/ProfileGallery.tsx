import Link from "next/link";
import type { SampleProfile } from "@/config/profiles";

/**
 * サンプルプロフィールのギャラリー。
 * 写真・経歴はすべて架空のサンプルイメージで、実在の登録者ではない旨を
 * セクション内に必ず明示する。
 */
export default function ProfileGallery({
  profiles,
  clubNameBySlug,
}: {
  profiles: SampleProfile[];
  clubNameBySlug?: Map<string, string>;
}) {
  if (profiles.length === 0) return null;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((p) => (
          <article
            key={p.clubSlug + p.displayName}
            className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.photo}
              alt={`${p.displayName}さんのサンプルイメージ`}
              className="aspect-[3/4] w-full object-cover object-top"
              loading="lazy"
            />
            <div className="p-3">
              <p className="font-bold">
                {p.displayName}（{p.age}）
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{p.job}</p>
              <p className="mt-2 text-sm text-gray-700">{p.comment}</p>
              {clubNameBySlug?.get(p.clubSlug) && (
                <p className="mt-2 text-xs">
                  <Link href={`/items/${p.clubSlug}`} className="text-brand underline">
                    {clubNameBySlug.get(p.clubSlug)}
                  </Link>
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">
        ※ 写真とプロフィールはすべてサンプルのイメージです。実在の登録者の情報ではありません。
      </p>
    </div>
  );
}
