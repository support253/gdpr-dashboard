import { fetchGDPRData } from '@/lib/sheets';
import { Dashboard } from '@/components/Dashboard';

export const revalidate = 300;

export default async function Home() {
  let rows;
  let error = null;

  try {
    rows = await fetchGDPRData();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch data';
    rows = [];
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            GDPR Compliance Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted">
            Automated audit of {rows.length} n8n workflow{rows.length !== 1 ? 's' : ''} &middot; Updates every 5 min
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-risk-high/20 bg-risk-high/5 p-4 text-sm text-risk-high">
            <strong>Error:</strong> {error}
          </div>
        )}

        <Dashboard rows={rows} />
      </div>
    </main>
  );
}
