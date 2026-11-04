/** クラブ確認用ミラーのクッキー名。Edge（middleware）からも読めるよう、依存なしの定数だけを置く。 */
/** 権限の判断に使うトークン本体（httpOnly） */
export const PREVIEW_TOKEN_COOKIE = "koosai_preview_token";
/** ミラー表示中であることだけを示す非 httpOnly の目印（帯の表示用。権限の判断には使わない） */
export const MIRROR_FLAG_COOKIE = "koosai_mirror";
