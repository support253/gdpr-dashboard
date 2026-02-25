'use client';

import { useState } from 'react';
import type { GDPRRow } from '@/lib/sheets';
import { MermaidDiagram } from './MermaidDiagram';

const RISK_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-risk-high/10', text: 'text-risk-high', label: 'High' },
  medium: { bg: 'bg-risk-medium/10', text: 'text-risk-medium', label: 'Medium' },
  low: { bg: 'bg-risk-low/10', text: 'text-risk-low', label: 'Low' },
  unknown: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Unknown' },
};

function normalize(level: string) {
  const l = level.toLowerCase().trim();
  if (l === 'high' || l === 'medium' || l === 'low') return l;
  return 'unknown';
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value || value === 'none found' || value === 'N/A') return null;
  return (
    <div className="py-2">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-gray-700">{value}</dd>
    </div>
  );
}

export function WorkflowCard({ row }: { row: GDPRRow }) {
  const [open, setOpen] = useState(false);
  const risk = normalize(row.riskLevel);
  const style = RISK_STYLES[risk];

  return (
    <div className="overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="truncate font-heading text-lg font-semibold text-gray-900">
              {row.workflowName || 'Unnamed Workflow'}
            </h3>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${style.bg} ${style.text}`}
            >
              {style.label}
            </span>
          </div>
          {row.purpose && (
            <p className="mt-1 truncate text-sm text-muted">{row.purpose}</p>
          )}
        </div>
        <svg
          className={`mt-1 h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-sand-200 px-5 pb-5 pt-4">
          <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            <DetailRow label="Workflow ID" value={row.workflowId} />
            <DetailRow label="Data Categories" value={row.dataCategories} />
            <DetailRow label="Data Subjects" value={row.dataSubjects} />
            <DetailRow label="Sources" value={row.sources} />
            <DetailRow label="Storage" value={row.storage} />
            <DetailRow label="Transfers" value={row.transfers} />
            <DetailRow label="Retention / Deletion" value={row.retentionDeletion} />
            <DetailRow label="Lawful Basis" value={row.lawfulBasis} />
          </dl>

          {row.risks && row.risks !== 'none found' && (
            <div className="mt-4 rounded-lg bg-risk-high/5 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-risk-high">Risks</h4>
              <p className="mt-1 text-sm leading-relaxed text-risk-high/80">{row.risks}</p>
            </div>
          )}

          {row.recommendations && row.recommendations !== 'none found' && (
            <div className="mt-3 rounded-lg bg-accent/5 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Recommendations</h4>
              <p className="mt-1 text-sm leading-relaxed text-accent/80">{row.recommendations}</p>
            </div>
          )}

          {row.mermaidDataFlow && (
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Data Flow</h4>
              <MermaidDiagram chart={row.mermaidDataFlow} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
