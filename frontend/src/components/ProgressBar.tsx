export function ProgressBar({
  value,
  label,
}: {
  value: number; // 0..1
  label?: string;
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="uppercase tracking-wider text-stone">
          {label ?? "Profili"}
        </span>
        <span className="numeric font-medium text-ink">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-2 rounded-sm overflow-hidden">
        <div
          className="h-full bg-forest transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
