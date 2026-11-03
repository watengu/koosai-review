import { sql } from "./db";

/**
 * クラブ専用の取り下げURL（パッケージ仕様の確定形）。
 * - 推測できないトークンでクラブを特定する（club_access）。
 * - 取り下げ = items.is_published を false にし、送客リンクを無効化し、
 *   takedown_events に記録を残す。即時にランキング・比較・詳細から消える。
 * - 復帰はこの経路では行わない（再掲載は新規申込＋再審査。運営側の誤操作復旧は
 *   運営が DB で is_published を戻し、takedown_events に restore を記録する）。
 */

export type ClubAdminInfo = {
  itemId: string;
  slug: string;
  name: string;
  isPublished: boolean;
  lastEventAt: string | null;
  lastEventAction: string | null;
};

export async function getClubByToken(token: string): Promise<ClubAdminInfo | null> {
  if (!sql) return null;
  try {
    const rows = (await sql`
      select i.id, i.slug, i.name, i.is_published
      from public.club_access a
      join public.items i on i.id = a.item_id
      where a.token = ${token}
      limit 1
    `) as Record<string, unknown>[];
    if (rows.length === 0) return null;
    const itemId = String(rows[0].id);
    const events = (await sql`
      select action, created_at from public.takedown_events
      where item_id = ${itemId}
      order by created_at desc
      limit 1
    `) as Record<string, unknown>[];
    return {
      itemId,
      slug: String(rows[0].slug),
      name: String(rows[0].name),
      isPublished: Boolean(rows[0].is_published),
      lastEventAt:
        events.length > 0
          ? events[0].created_at instanceof Date
            ? (events[0].created_at as Date).toISOString()
            : String(events[0].created_at)
          : null,
      lastEventAction: events.length > 0 ? String(events[0].action) : null,
    };
  } catch {
    return null;
  }
}

export async function takedownClub(itemId: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`update public.items set is_published = false, updated_at = now() where id = ${itemId} and is_published = true`;
    await sql`update public.links set is_active = false where item_id = ${itemId}`;
    await sql`insert into public.takedown_events (item_id, action, note) values (${itemId}, 'takedown', 'クラブ専用URLから実施')`;
    return true;
  } catch {
    return false;
  }
}

/** 運営専用トークンでクラブを引く（復旧用。クラブには渡さない） */
export async function getClubByOperatorToken(
  token: string,
): Promise<ClubAdminInfo | null> {
  if (!sql) return null;
  try {
    const rows = (await sql`
      select i.id from public.club_access a
      join public.items i on i.id = a.item_id
      where a.operator_token = ${token}
      limit 1
    `) as Record<string, unknown>[];
    if (rows.length === 0) return null;
    const itemId = String(rows[0].id);
    const items = (await sql`
      select slug, name, is_published from public.items where id = ${itemId} limit 1
    `) as Record<string, unknown>[];
    const events = (await sql`
      select action, created_at from public.takedown_events
      where item_id = ${itemId}
      order by created_at desc
      limit 1
    `) as Record<string, unknown>[];
    return {
      itemId,
      slug: String(items[0].slug),
      name: String(items[0].name),
      isPublished: Boolean(items[0].is_published),
      lastEventAt:
        events.length > 0
          ? events[0].created_at instanceof Date
            ? (events[0].created_at as Date).toISOString()
            : String(events[0].created_at)
          : null,
      lastEventAction: events.length > 0 ? String(events[0].action) : null,
    };
  } catch {
    return null;
  }
}

/** 運営による復旧：再表示し、送客リンクを戻し、記録を残す。データは保持されているので即座に元通りになる */
export async function restoreClub(itemId: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`update public.items set is_published = true, updated_at = now() where id = ${itemId} and is_published = false`;
    await sql`update public.links set is_active = true where item_id = ${itemId}`;
    await sql`insert into public.takedown_events (item_id, action, note) values (${itemId}, 'restore', '運営コンソールから復旧')`;
    return true;
  } catch {
    return false;
  }
}
