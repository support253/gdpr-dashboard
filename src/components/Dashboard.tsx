'use client';

import { useState } from 'react';
import type { GDPRRow } from '@/lib/sheets';
import { StatsBar } from './StatsBar';
import { FilterBar } from './FilterBar';
import { WorkflowCard } from './WorkflowCard';

export function Dashboard({ rows }: { rows: GDPRRow[] }) {
  const [filter, setFilter] = useState<string>('all');

  const normalize = (level: string) => {
    const l = level.toLowerCase().trim();
    if (l === 'high') return 'high';
    if (l === 'medium') return 'medium';
    if (l === 'low') return 'low';
    return 'unknown';
  };

  const counts = { high: 0, medium: 0, low: 0, unknown: 0 };
  rows.forEach((r) => {
    counts[normalize(r.riskLevel)]++;
  });

  const filtered = filter === 'all' ? rows : rows.filter((r) => normalize(r.riskLevel) === filter);

  return (
    <>
      <StatsBar total={rows.length} counts={counts} />
      <FilterBar active={filter} onChange={setFilter} counts={counts} />
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-sand-200 bg-white p-12 text-center text-muted">
            No workflows found{filter !== 'all' ? ` with ${filter} risk level` : ''}.
          </div>
        ) : (
          filtered.map((row, i) => (
            <WorkflowCard key={row.workflowId || i} row={row} />
          ))
        )}
      </div>
    </>
  );
}
