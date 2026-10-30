import { getAnonClient } from "./supabase";
import { computeTotalScore } from "./scoring";
import type {
  Article,
  Item,
  ItemScore,
  OutLink,
  PublicReview,
  RankedItem,
  ReviewAxis,
} from "./types";

/**
 * データ取得層。
 * - すべて anon クライアント（RLS 前提）で読む。書き込みは口コミ投稿と
 *   クリック記録のサーバルートだけが担う。
 * - Supabase 未設定（スキャフォールドを DB なしで開いた状態）や取得失敗時は
 *   空配列/null を返し、ページ側は空状態の表示に倒れる（例外で落とさない）。
 * - 表示する口コミは承認済みのみ。RLS でも担保しているが、クエリ側でも
 *   status='approved' を明示する（二重化）。
 */

const PUBLIC_REVIEW_COLUMNS =
  "id,item_id,status,axis_ratings,body,author_age_range,author_area,used_period,created_at,approved_at";

export async function getAxes(): Promise<ReviewAxis[]> {
  const sb = getAnonClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("review_axes")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as ReviewAxis[];
}

export async function getPublishedItems(): Promise<Item[]> {
  const sb = getAnonClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("items")
    .select("*")
    .eq("is_published", true)
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data as Item[];
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  const sb = getAnonClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("items")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as Item;
}

export async function getScores(itemId?: string): Promise<ItemScore[]> {
  const sb = getAnonClient();
  if (!sb) return [];
  let query = sb.from("item_scores").select("*");
  if (itemId) query = query.eq("item_id", itemId);
  const { data, error } = await query;
  if (error || !data) return [];
  return data as ItemScore[];
}

export async function getLinksForItem(itemId: string): Promise<OutLink[]> {
  const sb = getAnonClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("links")
    .select("*")
    .eq("item_id", itemId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as OutLink[];
}

/** 承認済み口コミ。itemSlug を渡すとその対象だけに絞る */
export async function getApprovedReviews(options?: {
  limit?: number;
  itemId?: string;
}): Promise<PublicReview[]> {
  const sb = getAnonClient();
  if (!sb) return [];
  let query = sb
    .from("reviews")
    .select(PUBLIC_REVIEW_COLUMNS)
    .eq("status", "approved")
    .order("approved_at", { ascending: false });
  if (options?.itemId) query = query.eq("item_id", options.itemId);
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error || !data) return [];
  return data as unknown as PublicReview[];
}

export async function getReviewById(id: string): Promise<PublicReview | null> {
  const sb = getAnonClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("reviews")
    .select(PUBLIC_REVIEW_COLUMNS)
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as PublicReview;
}

/** ランキング: 総合スコア降順（スコアなしは末尾）。lib/scoring.ts で算出 */
export async function getRanking(): Promise<RankedItem[]> {
  const [items, axes, scores, reviews] = await Promise.all([
    getPublishedItems(),
    getAxes(),
    getScores(),
    getApprovedReviews(),
  ]);

  const scoresByItem = new Map<string, ItemScore[]>();
  for (const s of scores) {
    const list = scoresByItem.get(s.item_id) ?? [];
    list.push(s);
    scoresByItem.set(s.item_id, list);
  }
  const reviewCountByItem = new Map<string, number>();
  for (const r of reviews) {
    reviewCountByItem.set(r.item_id, (reviewCountByItem.get(r.item_id) ?? 0) + 1);
  }

  const ranked: RankedItem[] = items.map((item) => {
    const itemScores = scoresByItem.get(item.id) ?? [];
    const { total, scoredAxes } = computeTotalScore(itemScores, axes);
    return {
      item,
      totalScore: total,
      scoredAxes,
      totalAxes: axes.length,
      reviewCount: reviewCountByItem.get(item.id) ?? 0,
      scores: itemScores,
    };
  });

  return ranked.sort((a, b) => {
    if (a.totalScore === null && b.totalScore === null) return 0;
    if (a.totalScore === null) return 1;
    if (b.totalScore === null) return -1;
    return b.totalScore - a.totalScore;
  });
}

export async function getArticles(): Promise<Article[]> {
  const sb = getAnonClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const sb = getAnonClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as Article;
}
