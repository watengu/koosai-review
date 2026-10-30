/**
 * 軸別スコアのバー表示。score が null の場合は「データ不足」を明示する
 * （数字がないのに点数があるように見せない：設計書§3）。
 */
export default function ScoreBar({
  label,
  score,
  maxScore = 5,
}: {
  label: string;
  score: number | null;
  maxScore?: number;
}) {
  if (score === null) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-32 shrink-0 text-gray-700">{label}</span>
        <span className="text-gray-400">データ不足（口コミ収集中）</span>
      </div>
    );
  }
  const pct = Math.max(0, Math.min(100, (score / maxScore) * 100));
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-32 shrink-0 text-gray-700">{label}</span>
      <span className="h-2.5 w-40 overflow-hidden rounded bg-gray-200">
        <span className="block h-full bg-brand-accent" style={{ width: `${pct}%` }} />
      </span>
      <span className="font-bold">{score.toFixed(1)}</span>
      <span className="text-gray-400">/ {maxScore}</span>
    </div>
  );
}
