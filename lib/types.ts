/**
 * DB 行型（supabase/schema.sql に対応する最小定義）
 * 本実装では Supabase CLI の型生成（supabase gen types）に差し替え可能。
 */

export interface Item {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  operator_name: string | null;
  official_url: string | null;
  image_url: string | null;
  price_join: number | null;
  price_annual: number | null;
  price_per_use: number | null;
  specs: Record<string, unknown>;
  is_published: boolean;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewAxis {
  key: string;
  label: string;
  description: string | null;
  weight: number;
  max_score: number;
  source: "editorial" | "review_avg";
  sort_order: number;
  is_active: boolean;
}

export interface ItemScore {
  id: string;
  item_id: string;
  axis_key: string;
  score: number | null; // null = データ不足（採点しない）
  source: "editorial" | "review_avg";
  basis: string | null;
  source_url: string | null;
  checked_at: string | null;
}

/** 公開カラムのみ（contact_email 等の内部情報は型にも含めない） */
export interface PublicReview {
  id: string;
  item_id: string;
  status: "approved";
  axis_ratings: Record<string, number>;
  body: string;
  author_age_range: string | null;
  author_area: string | null;
  used_period: string | null;
  created_at: string;
  approved_at: string | null;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  body: string;
  kind: "column" | "editorial";
  item_id: string | null;
  is_published: boolean;
  published_at: string | null;
  updated_at: string;
}

export interface OutLink {
  id: string;
  item_id: string | null;
  label: string;
  url: string;
  kind: "official" | "affiliate";
  is_active: boolean;
  /** true のとき /go の計測リダイレクトを経由せず遷移先へ直接リンクする */
  direct: boolean;
}

/** ランキング表示用に集計した対象 */
export interface RankedItem {
  item: Item;
  /** 100点満点に正規化した総合スコア。採点済み軸が無い場合は null */
  totalScore: number | null;
  /** 採点できている軸の数 */
  scoredAxes: number;
  /** 評価軸の総数 */
  totalAxes: number;
  /** 承認済み口コミ件数 */
  reviewCount: number;
  scores: ItemScore[];
}
