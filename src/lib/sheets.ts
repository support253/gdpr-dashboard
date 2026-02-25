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

const COLUMN_MAP: Record<string, keyof GDPRRow> = {
  'Workflowid': 'workflowId',
  'workflowId': 'workflowId',
  'workflow name': 'workflowName',
  'workflowName': 'workflowName',
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
  'retentionDeletion': 'retentionDeletion',
  'Retention / Deletion': 'retentionDeletion',
  'Lawful basis': 'lawfulBasis',
  'lawfulBasisSuggestions': 'lawfulBasis',
  'Risks': 'risks',
  'risks': 'risks',
  'Recommendations': 'recommendations',
  'recommendations': 'recommendations',
  'Data Flow': 'mermaidDataFlow',
  'mermaidDataFlow': 'mermaidDataFlow',
};

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
    return {
      workflowId: '',
      workflowName: '',
      purpose: '',
      riskLevel: 'unknown',
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
  });
}
