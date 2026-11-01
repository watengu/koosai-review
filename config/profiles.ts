/**
 * サンプルプロフィール（架空）の定義。
 *
 * デモ表示専用：氏名・年齢・職業・コメント・写真はすべて架空のサンプルで、
 * 実在の登録者ではありません。写真は自前のAI生成モデル素材を使用しています。
 * 実データ運用では、この静的定義ではなく編集部が一次確認したデータに
 * 差し替えること（このファイルに実在者の情報を書かない）。
 */
export interface SampleProfile {
  clubSlug: string;
  displayName: string;
  age: number;
  job: string;
  comment: string;
  photo: string;
}

export const sampleProfiles: SampleProfile[] = [
  {
    clubSlug: "sample-lumiere",
    displayName: "さくら",
    age: 29,
    job: "外資系メーカー勤務",
    comment: "落ち着いたお食事からご一緒できたら嬉しいです。",
    photo: "/images/profiles/sample-lumiere.jpg",
  },
  {
    clubSlug: "sample-sogetsu",
    displayName: "美咲",
    age: 31,
    job: "アパレルPR",
    comment: "大人の余裕のある方との時間を大切にしています。",
    photo: "/images/profiles/sample-sogetsu.jpg",
  },
  {
    clubSlug: "sample-vert",
    displayName: "りな",
    age: 26,
    job: "IT企業勤務",
    comment: "仕事帰りの短い時間でも、お会いできると嬉しいです。",
    photo: "/images/profiles/sample-vert.jpg",
  },
  {
    clubSlug: "sample-hakua",
    displayName: "ゆい",
    age: 24,
    job: "大学院生",
    comment: "知的な会話ができる方に惹かれます。",
    photo: "/images/profiles/sample-hakua.jpg",
  },
  {
    clubSlug: "sample-etoile",
    displayName: "あかり",
    age: 27,
    job: "客室乗務員",
    comment: "各地を移動しているので、出張先でもお会いできます。",
    photo: "/images/profiles/sample-etoile.jpg",
  },
  {
    clubSlug: "sample-amethyst",
    displayName: "ほのか",
    age: 25,
    job: "保育士",
    comment: "穏やかな時間を一緒に過ごしたいです。",
    photo: "/images/profiles/sample-amethyst.jpg",
  },
  {
    clubSlug: "sample-rin",
    displayName: "まい",
    age: 28,
    job: "ネイリスト",
    comment: "明るく笑うのが取り柄です。まずはお茶からどうぞ。",
    photo: "/images/profiles/sample-rin.jpg",
  },
  {
    clubSlug: "sample-tsukikage",
    displayName: "麗",
    age: 30,
    job: "秘書",
    comment: "静かな場所でゆっくりお話しするのが好きです。",
    photo: "/images/profiles/sample-tsukikage.jpg",
  },
];

export function profilesForClub(clubSlug: string): SampleProfile[] {
  return sampleProfiles.filter((p) => p.clubSlug === clubSlug);
}
