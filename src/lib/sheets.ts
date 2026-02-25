export interface GDPRRow {
  workflowId: string;
  workflowName: string;
  purpose: string;
  riskLevel: string;
  dataCategories: string;
  dataSubjects: string;
  sources: string;
  storage: string;
  transfers: string;
  retentionDeletion: string;
  lawfulBasis: string;
  risks: string;
  recommendations: string;
  mermaidDataFlow: string;
}

// Map every possible column header from the sheet to our internal key
const COLUMN_MAP: Record<string, keyof GDPRRow> = {
  'Workflowid': 'workflowId',
  'workflowId': 'workflowId',
  'Workflow ID': 'workflowId',
  'workflow name': 'workflowName',
  'workflowName': 'workflowName',
  'Workflow Name': 'workflowName',
  'Purpose': 'purpose',
  'purpose': 'purpose',
  'Risk Level': 'riskLevel',
  'riskLevel': 'riskLevel',
  'Data categories': 'dataCategories',
  'dataCategories': 'dataCategories',
  'Data subjects': 'dataSubjects',
  'dataSubjects': 'dataSubjects',
  'Sources': 'sources',
  'sources': 'sources',
  'Storage': 'storage',
  'storage': 'storage',
  'Transfers': 'transfers',
  'transfers': 'transfers',
  'Transfered': 'transfers',
  'retentionDeletion': 'retentionDeletion',
  'Retention / Deletion': 'retentionDeletion',
  'Lawful basis': 'lawfulBasis',
  'lawfulBasisSuggestions': 'lawfulBasis',
  'Lawful Basis Suggestions': 'lawfulBasis',
  'Risks': 'risks',
  'risks': 'risks',
  'Recommendations': 'recommendations',
  'recommendations': 'recommendations',
  'Data Flow': 'mermaidDataFlow',
  'mermaidDataFlow': 'mermaidDataFlow',
};

// Infer risk level from risk text when no explicit level is set
function inferRiskLevel(risks: string): string {
  const lower = risks.toLowerCase();
  const highSignals = [
    'third-country', 'third country', 'without sccs',
    'sensitive data', 'special category', 'no deletion',
    'no retention', 'mass data', 'no consent', 'health data',
    'biometric', 'criminal', 'racial', 'ethnic',
  ];
  const mediumSignals = [
    'personal data', 'transfer', 'email', 'name',
    'location', 'ip address', 'cookie', 'tracking',
  ];

  const highCount = highSignals.filter((s) => lower.includes(s)).length;
  const mediumCount = mediumSignals.filter((s) => lower.includes(s)).length;

  if (highCount >= 2 || lower.includes('without sccs')) return 'high';
  if (highCount >= 1 || mediumCount >= 2) return 'medium';
  if (mediumCount >= 1) return 'low';
  return 'low';
}

// Clean mermaid chart text so it renders properly
function cleanMermaid(raw: string): string {
  if (!raw) return '';
  // Replace literal \n with actual newlines
  let cleaned = raw.replace(/\\n/g, '\n');
  // Remove wrapping backticks if present
  cleaned = cleaned.replace(/^```(?:mermaid)?\s*/i, '').replace(/```\s*$/, '').trim();
  return cleaned;
}

export async function fetchGDPRData(): Promise<GDPRRow[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!apiKey || !sheetId) {
    throw new Error('Missing GOOGLE_SHEETS_API_KEY or GOOGLE_SHEET_ID env vars');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    throw new Error(`Google Sheets API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const [headerRow, ...dataRows] = data.values || [];

  if (!headerRow) return [];

  return dataRows.map((row: string[]) => {
    const obj: Partial<GDPRRow> = {};
    headerRow.forEach((header: string, i: number) => {
      const key = COLUMN_MAP[header.trim()];
      if (key) {
        obj[key] = row[i] || '';
      }
    });

    const result: GDPRRow = {
      workflowId: '',
      workflowName: '',
      purpose: '',
      riskLevel: '',
      dataCategories: '',
      dataSubjects: '',
      sources: '',
      storage: '',
      transfers: '',
      retentionDeletion: '',
      lawfulBasis: '',
      risks: '',
      recommendations: '',
      mermaidDataFlow: '',
      ...obj,
    };

    // Infer risk level if missing
    if (!result.riskLevel || result.riskLevel === 'unknown' || result.riskLevel === '') {
      result.riskLevel = result.risks ? inferRiskLevel(result.risks) : 'low';
    }

    // Clean mermaid diagram
    result.mermaidDataFlow = cleanMermaid(result.mermaidDataFlow);

    return result;
  });
}
