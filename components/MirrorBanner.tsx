"use client";

import { useEffect, useState } from "react";
import { MIRROR_FLAG_COOKIE } from "@/lib/mirror-constants";

/**
 * 確認用ミラー表示中の帯。サーバ側の描画に影響させないため、
 * フラグ用クッキーの有無だけをクライアント側で見て出す。
 * 権限の判断はサーバ側の httpOnly トークンで行う（この帯は表示だけ）。
 */
export default function MirrorBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(
      document.cookie
        .split(";")
        .some((c) => c.trim().startsWith(`${MIRROR_FLAG_COOKIE}=`)),
    );
  }, []);

  if (!shown) return null;

  return (
    <div className="bg-[#B08D3E] px-4 py-2 text-center text-sm font-bold text-white">
      確認用ミラー表示中（一般公開前の状態です）{" "}
      <a href="/mirror-exit" className="underline">
        通常表示に戻る
      </a>
    </div>
  );
}
