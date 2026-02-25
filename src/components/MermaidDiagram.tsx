'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'DM Sans, system-ui, sans-serif',
});

export function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const render = async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to render diagram');
      }
    };

    render();
  }, [chart]);

  if (error) {
    return (
      <div className="rounded-lg border border-sand-200 bg-sand-50 p-4">
        <p className="mb-2 text-xs text-muted">Could not render diagram:</p>
        <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-gray-600">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container overflow-x-auto rounded-lg border border-sand-200 bg-sand-50 p-4"
    />
  );
}
