import Link from "next/link";
import { vertical } from "@/config/vertical";

const NAV = [
  { href: "/ranking", label: "ランキング" },
  { href: "/compare", label: "比較表" },
  { href: "/simulator", label: "料金シミュレーター" },
  { href: "/reviews", label: "口コミ" },
  { href: "/articles", label: "コラム" },
  { href: "/method", label: "評価方法" },
  { href: "/about", label: "運営者情報" },
];

export default function Header() {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-wide">
          {vertical.siteName}
        </Link>
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="underline-offset-2 hover:underline">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
