/** @type {import('next').NextConfig} */
// ホスティング未決（Vercel Pro / Cloudflare Pages 等）のため、
// 特定ホスティング依存の機能（Vercel固有の画像最適化プロバイダ等）は使わない。
// 画像は当面テキスト中心設計のため next/image の外部ローダも前提にしない。
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/for-business",
        destination: "/for-clubs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
