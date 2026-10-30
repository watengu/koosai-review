import type { Config } from "tailwindcss";
import { vertical } from "./config/vertical";

// テーマカラーはバーティカル設定から注入する（ジャンル差し替えで色も変わる）。
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: vertical.theme.primary,
          accent: vertical.theme.accent,
        },
      },
    },
  },
  plugins: [],
};

export default config;
