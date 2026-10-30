/** ★表示（0〜5、0.5刻みは四捨五入して塗る簡易版） */
export default function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const full = Math.round(value);
  return (
    <span aria-label={`${value} / ${max}`} className="text-amber-500">
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </span>
  );
}
