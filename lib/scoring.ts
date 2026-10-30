import type { ItemScore, ReviewAxis } from "./types";

/**
 * 採点ロジック（設計書§3「順位付けと根拠公開の方針」に対応）
 *
 * 総合スコア = 採点済み軸だけを使った加重平均を 100 点満点に正規化したもの。
 *   total = Σ(score / max_score × weight) / Σ(weight of scored axes) × 100
 *
 * - score が null の軸（データ不足）は分子・分母の両方から除外する。
 *   → 「データがないのに点数がある」状態を作らない。
 * - 契約の有無・送客リンクの有無は入力に含まれない（順位と報酬を分離する）。
 * - DB 側の ranking ビューと同じ式。表示側で再計算する場合もここを使う。
 */
export function computeTotalScore(
  scores: ItemScore[],
  axes: ReviewAxis[],
): { total: number | null; scoredAxes: number } {
  const axisByKey = new Map(axes.map((a) => [a.key, a]));
  let weighted = 0;
  let weightSum = 0;
  let scoredAxes = 0;

  for (const s of scores) {
    if (s.score === null) continue;
    const axis = axisByKey.get(s.axis_key);
    if (!axis || !axis.is_active) continue;
    weighted += (s.score / axis.max_score) * axis.weight;
    weightSum += axis.weight;
    scoredAxes += 1;
  }

  if (weightSum === 0) return { total: null, scoredAxes: 0 };
  return { total: Math.round((weighted / weightSum) * 1000) / 10, scoredAxes };
}

/**
 * 承認済み口コミの axis_ratings から、対象×軸の平均を出す。
 * DB の review_axis_stats ビューと同じ計算（表示側のフォールバック用）。
 */
export function averageRatings(
  ratingsList: Record<string, number>[],
): Record<string, { avg: number; count: number }> {
  const acc: Record<string, { sum: number; count: number }> = {};
  for (const ratings of ratingsList) {
    for (const [key, value] of Object.entries(ratings)) {
      if (typeof value !== "number") continue;
      acc[key] = acc[key] ?? { sum: 0, count: 0 };
      acc[key].sum += value;
      acc[key].count += 1;
    }
  }
  const out: Record<string, { avg: number; count: number }> = {};
  for (const [key, v] of Object.entries(acc)) {
    out[key] = { avg: Math.round((v.sum / v.count) * 100) / 100, count: v.count };
  }
  return out;
}
