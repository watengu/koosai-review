import type { Item } from "./types";

/**
 * 料金シミュレーターの計算（モデルケース型：設計書§5に対応）
 *
 * 総額 = 初期費用(price_join)
 *      + 年額(price_annual) × 年数
 *      + 1回あたり(price_per_use) × 月あたり回数 × 12 × 年数
 *
 * 金額が1つでも非公開（null）の対象は「試算不可」として null を返す。
 * 推測で補完しない（設計書§3: 非公開は「非公開」と明示する）。
 */

export interface SimulatorInput {
  years: number; // 利用年数（1〜5）
  sessionsPerMonth: number; // 月あたり利用回数
}

export interface SimulatorRow {
  item: Item;
  total: number | null; // null = 試算不可（金額非公開あり）
  breakdown: {
    join: number | null;
    annualTotal: number | null;
    perUseTotal: number | null;
  } | null;
}

export function estimateTotal(item: Item, input: SimulatorInput): SimulatorRow {
  const { years, sessionsPerMonth } = input;
  if (item.price_join === null || item.price_annual === null || item.price_per_use === null) {
    return { item, total: null, breakdown: null };
  }
  const annualTotal = item.price_annual * years;
  const perUseTotal = item.price_per_use * sessionsPerMonth * 12 * years;
  return {
    item,
    total: item.price_join + annualTotal + perUseTotal,
    breakdown: { join: item.price_join, annualTotal, perUseTotal },
  };
}

/** 試算可能なものを総額の安い順に並べ、試算不可は末尾に回す */
export function rankByTotal(rows: SimulatorRow[]): SimulatorRow[] {
  return [...rows].sort((a, b) => {
    if (a.total === null && b.total === null) return a.item.name.localeCompare(b.item.name);
    if (a.total === null) return 1;
    if (b.total === null) return -1;
    return a.total - b.total;
  });
}
