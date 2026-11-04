import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import MirrorBanner from "@/components/MirrorBanner";
import Footer from "@/components/Footer";
import PrNotice from "@/components/PrNotice";
import SampleNotice from "@/components/SampleNotice";
import { vertical } from "@/config/vertical";

export const metadata: Metadata = {
  title: {
    default: `${vertical.siteName} | ${vertical.tagline}`,
    template: `%s | ${vertical.siteName}`,
  },
  description: vertical.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <MirrorBanner />
        <Header />
        <PrNotice />
        <SampleNotice />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
