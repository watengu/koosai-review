import { sql } from "./db";
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
 * データ取得層（Neon / Postgres 版）。
 * - すべてサーバ側で DATABASE_URL の接続を使い、パラメータ化SQLで読む。
 * - 可視範囲は旧 RLS と同じ条件をクエリ側で明示する（二重化ではなく移管）:
 *   items / articles は is_published = true のみ、口コミは status='approved'
 *   のみ、口コミは公開カラムだけを SELECT する（contact_email /
 *   screening_note / ip_hash は型にもクエリにも含めない）。
 * - DATABASE_URL 未設定や取得失敗時は空配列/null を返し、ページ側は
 *   空状態の表示に倒れる（例外で落とさない）。旧 Supabase 版と同じ挙動。
 *
 * 型の正規化: Neon ドライバは numeric を文字列で、timestamptz を
 * Date で返すことがあるため、行ごとに number / ISO文字列へ寄せる。
 */

/** timestamptz の戻り値（Date / 文字列）を ISO 文字列へ寄せる */
function toIso(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/** date 型（checked_at）の戻り値を 'YYYY-MM-DD' 文字列へ寄せる */
function toDateString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

/** numeric の戻り値（文字列）を number へ寄せる。null はそのまま */
function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

type Row = Record<string, unknown>;

function mapAxis(r: Row): ReviewAxis {
  return {
    key: String(r.key),
    label: String(r.label),
    description: (r.description as string | null) ?? null,
    weight: toNumber(r.weight) ?? 0,
    max_score: toNumber(r.max_score) ?? 5,
    source: r.source as ReviewAxis["source"],
    sort_order: Number(r.sort_order ?? 0),
    is_active: Boolean(r.is_active),
  };
}

function mapItem(r: Row): Item {
  return {
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    summary: (r.summary as string | null) ?? null,
    operator_name: (r.operator_name as string | null) ?? null,
    official_url: (r.official_url as string | null) ?? null,
    image_url: (r.image_url as string | null) ?? null,
    price_join: toNumber(r.price_join),
    price_annual: toNumber(r.price_annual),
    price_per_use: toNumber(r.price_per_use),
    specs: (r.specs as Record<string, unknown>) ?? {},
    is_published: Boolean(r.is_published),
    last_checked_at: toIso(r.last_checked_at),
    created_at: toIso(r.created_at) ?? "",
    updated_at: toIso(r.updated_at) ?? "",
  };
}

function mapScore(r: Row): ItemScore {
  return {
    id: String(r.id),
    item_id: String(r.item_id),
    axis_key: String(r.axis_key),
    score: toNumber(r.score),
    source: r.source as ItemScore["source"],
    basis: (r.basis as string | null) ?? null,
    source_url: (r.source_url as string | null) ?? null,
    checked_at: toDateString(r.checked_at),
  };
}

function mapLink(r: Row): OutLink {
  return {
    id: String(r.id),
    item_id: r.item_id === null || r.item_id === undefined ? null : String(r.item_id),
    label: String(r.label),
    url: String(r.url),
    kind: r.kind as OutLink["kind"],
    is_active: Boolean(r.is_active),
    direct: Boolean(r.direct),
  };
}

function mapReview(r: Row): PublicReview {
  return {
    id: String(r.id),
    item_id: String(r.item_id),
    status: "approved",
    axis_ratings: (r.axis_ratings as Record<string, number>) ?? {},
    body: String(r.body),
    author_age_range: (r.author_age_range as string | null) ?? null,
    author_area: (r.author_area as string | null) ?? null,
    used_period: (r.used_period as string | null) ?? null,
    created_at: toIso(r.created_at) ?? "",
    approved_at: toIso(r.approved_at),
  };
}

function mapArticle(r: Row): Article {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    body: String(r.body),
    kind: r.kind as Article["kind"],
    item_id: r.item_id === null || r.item_id === undefined ? null : String(r.item_id),
    is_published: Boolean(r.is_published),
    published_at: toIso(r.published_at),
    updated_at: toIso(r.updated_at) ?? "",
  };
}

export async function getAxes(): Promise<ReviewAxis[]> {
  if (!sql) return [];
  try {
    const rows = (await sql`
      select * from public.review_axes
      where is_active = true
      order by sort_order asc
    `) as Row[];
    return rows.map(mapAxis);
  } catch {
    return [];
  }
}

export async function getPublishedItems(): Promise<Item[]> {
  if (!sql) return [];
  try {
    const rows = (await sql`
      select * from public.items
      where is_published = true
      order by name asc
    `) as Row[];
    return rows.map(mapItem);
  } catch {
    return [];
  }
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  if (!sql) return null;
  try {
    const rows = (await sql`
      select * from public.items
      where slug = ${slug} and is_published = true
      limit 1
    `) as Row[];
    return rows.length > 0 ? mapItem(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function getScores(itemId?: string): Promise<ItemScore[]> {
  if (!sql) return [];
  try {
    const rows = (await (itemId
      ? sql`select * from public.item_scores where item_id = ${itemId}`
      : sql`select * from public.item_scores`)) as Row[];
    return rows.map(mapScore);
  } catch {
    return [];
  }
}

export async function getLinksForItem(itemId: string): Promise<OutLink[]> {
  if (!sql) return [];
  try {
    const rows = (await sql`
      select * from public.links
      where item_id = ${itemId} and is_active = true
      order by created_at asc
    `) as Row[];
    return rows.map(mapLink);
  } catch {
    return [];
  }
}

/** 承認済み口コミ。itemId を渡すとその対象だけに絞る */
export async function getApprovedReviews(options?: {
  limit?: number;
  itemId?: string;
}): Promise<PublicReview[]> {
  if (!sql) return [];
  try {
    const limit = options?.limit ?? null;
    const rows = (await (options?.itemId
      ? sql`
          select id, item_id, status, axis_ratings, body, author_age_range, author_area, used_period, created_at, approved_at from public.reviews
          where status = 'approved' and item_id = ${options.itemId}
          order by approved_at desc
          limit ${limit}
        `
      : sql`
          select id, item_id, status, axis_ratings, body, author_age_range, author_area, used_period, created_at, approved_at from public.reviews
          where status = 'approved'
          order by approved_at desc
          limit ${limit}
        `)) as Row[];
    return rows.map(mapReview);
  } catch {
    return [];
  }
}

export async function getReviewById(id: string): Promise<PublicReview | null> {
  if (!sql) return null;
  try {
    const rows = (await sql`
      select id, item_id, status, axis_ratings, body, author_age_range, author_area, used_period, created_at, approved_at from public.reviews
      where id = ${id} and status = 'approved'
      limit 1
    `) as Row[];
    return rows.length > 0 ? mapReview(rows[0]) : null;
  } catch {
    return null;
  }
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
  if (!sql) return [];
  try {
    const rows = (await sql`
      select * from public.articles
      where is_published = true
      order by published_at desc
    `) as Row[];
    return rows.map(mapArticle);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!sql) return null;
  try {
    const rows = (await sql`
      select * from public.articles
      where slug = ${slug} and is_published = true
      limit 1
    `) as Row[];
    return rows.length > 0 ? mapArticle(rows[0]) : null;
  } catch {
    return null;
  }
}
