interface StatsBarProps {
  total: number;
  counts: { high: number; medium: number; low: number; unknown: number };
}

export function StatsBar({ total, counts }: StatsBarProps) {
  const stats = [
    { label: 'Total', value: total, color: 'text-accent' },
    { label: 'High Risk', value: counts.high, color: 'text-risk-high' },
    { label: 'Medium', value: counts.medium, color: 'text-risk-medium' },
    { label: 'Low Risk', value: counts.low, color: 'text-risk-low' },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-sand-200 bg-white p-5 text-center shadow-sm"
        >
          <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
