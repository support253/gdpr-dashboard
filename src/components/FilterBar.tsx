interface FilterBarProps {
  active: string;
  onChange: (filter: string) => void;
  counts: { high: number; medium: number; low: number; unknown: number };
}

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'high', label: `High (${counts.high})` },
    { key: 'medium', label: `Medium (${counts.medium})` },
    { key: 'low', label: `Low (${counts.low})` },
  ];

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-2">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            active === f.key
              ? 'bg-accent text-white shadow-sm'
              : 'border border-sand-200 bg-white text-gray-600 hover:border-accent/30 hover:text-accent'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
