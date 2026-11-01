import Link from "next/link";
import { vertical } from "@/config/vertical";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <p className="font-bold text-gray-800">{vertical.siteName}</p>
        <p className="mt-2">{vertical.prNotice}</p>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/method" className="hover:underline">評価方法・採点式</Link>
          <Link href="/about" className="hover:underline">運営者情報・PR表記</Link>
          <Link href="/removal" className="hover:underline">削除要請窓口</Link>
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/reviews/post" className="hover:underline">口コミを投稿する</Link>
          <Link href="/for-business" className="hover:underline">事業者の方へ（掲載のご案内）</Link>
        </nav>
        <p className="mt-4 text-xs text-gray-400">
          掲載情報は編集部が一次確認した時点のものです。最新情報は各{vertical.itemNoun}の公式情報でご確認ください。
        </p>
      </div>
    </footer>
  );
}
