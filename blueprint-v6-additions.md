# Blueprint v6 Additions
## New Features for Tabi Po Grant Dashboard

**IMPORTANT FOR ANTIGRAVITY:** These are NEW features to add to the existing grant dashboard. Do NOT rebuild existing features (pipeline, funders, auth, etc.) — just integrate these new modules.

---

## Summary of Additions

| Module | Purpose |
|--------|---------|
| **Module H** | KoBo Field Data Integration |
| **Module I** | Impact Dashboard Scraper |
| **Module J** | Auto-Report Generator |
| **Module E2** | Monitoring Report Reminders |
| **Google Workspace CLI** | Replace API calls with CLI commands |

---

## Module H: KoBo Field Data Integration

**Purpose:** Auto-sync field data from KoBo Toolbox for monitoring reports

### Connected Forms (4 forms)

| Form Name | Data Collected | Report Section |
|-----------|----------------|----------------|
| Tree Planting Log | Trees planted, species, GPS, survival rate | Restoration Progress |
| Aluyan River Watershed Monitoring | Water quality, turbidity, flow, photos | Environmental Impact |
| Bantay Bukid Patrol Report | Patrol dates, incidents, threats, area covered | Community Protection |
| Roots and Rivers: Photo Story | Geotagged photos, captions, timestamps | Visual Evidence |

### KoBo API Configuration

```
API URL: https://kf.kobotoolbox.org/api/v2
API Key: stored in environment variable KOBO_API_KEY
```

### KoBo API Library

Create file: `src/lib/kobo-api.ts`

```typescript
const KOBO_API_URL = process.env.KOBO_API_URL || 'https://kf.kobotoolbox.org/api/v2';
const KOBO_API_KEY = process.env.KOBO_API_KEY;

export const koboApi = {
  async getForms() {
    const response = await fetch(`${KOBO_API_URL}/assets/`, {
      headers: { 'Authorization': `Token ${KOBO_API_KEY}` }
    });
    return response.json();
  },
  
  async getFormData(assetUid: string) {
    const response = await fetch(`${KOBO_API_URL}/assets/${assetUid}/data/`, {
      headers: { 'Authorization': `Token ${KOBO_API_KEY}` }
    });
    return response.json();
  },
  
  async getFormSubmissions(assetUid: string, limit = 100) {
    const response = await fetch(
      `${KOBO_API_URL}/assets/${assetUid}/data/?limit=${limit}&sort={"_submission_time":-1}`,
      { headers: { 'Authorization': `Token ${KOBO_API_KEY}` } }
    );
    return response.json();
  }
};
```

### Form Mapping Configuration

Create file: `src/lib/kobo-mapping.ts`

```typescript
export const KOBO_FORM_MAPPING = {
  'tree_planting_log': {
    displayName: 'Tree Planting Log',
    reportSection: 'Restoration Progress',
    metrics: [
      { field: 'trees_planted', label: 'Trees Planted', aggregation: 'sum' },
      { field: 'species', label: 'Species', aggregation: 'unique_count' },
      { field: 'survival_rate', label: 'Avg Survival Rate', aggregation: 'average' },
      { field: '_geolocation', label: 'Planting Sites', aggregation: 'map_points' }
    ]
  },
  'watershed_monitoring': {
    displayName: 'Aluyan River Watershed Monitoring',
    reportSection: 'Environmental Impact',
    metrics: [
      { field: 'water_quality', label: 'Water Quality Index', aggregation: 'latest' },
      { field: 'turbidity', label: 'Turbidity (NTU)', aggregation: 'average' },
      { field: 'flow_rate', label: 'Flow Rate (L/s)', aggregation: 'average' }
    ]
  },
  'bantay_bukid_patrol': {
    displayName: 'Bantay Bukid Patrol Report',
    reportSection: 'Community Protection',
    metrics: [
      { field: 'patrol_date', label: 'Total Patrols', aggregation: 'count' },
      { field: 'incidents', label: 'Incidents Reported', aggregation: 'sum' },
      { field: 'area_covered_ha', label: 'Area Covered (ha)', aggregation: 'sum' },
      { field: 'threats_detected', label: 'Threats Detected', aggregation: 'list' }
    ]
  },
  'photo_story': {
    displayName: 'Roots and Rivers: Photo Story',
    reportSection: 'Visual Evidence',
    metrics: [
      { field: 'photo', label: 'Photos Collected', aggregation: 'count' },
      { field: 'caption', label: 'Stories Documented', aggregation: 'list' }
    ]
  }
};
```

### Firestore Collections (New)

```
/koboSync/{formId}
  - formName: string
  - koboAssetUid: string
  - lastSyncedAt: timestamp
  - totalSubmissions: number
  - newSinceLastSync: number

/settings/koboConfig
  - apiKey: string (encrypted reference - actual key in env)
  - forms: [
      { name: "Tree Planting Log", assetUid: "abc123", enabled: true },
      { name: "Aluyan River Watershed Monitoring", assetUid: "def456", enabled: true },
      { name: "Bantay Bukid Patrol Report", assetUid: "ghi789", enabled: true },
      { name: "Roots and Rivers: Photo Story", assetUid: "jkl012", enabled: true }
    ]
  - syncIntervalMinutes: 60
```

### API Routes (New)

```
/api/kobo/forms/route.ts      - List available forms
/api/kobo/sync/route.ts       - Trigger sync for all forms
/api/kobo/data/[formId]/route.ts - Get data for specific form
```

### UI Components (New)

```
src/components/kobo/
├── KoboSyncStatus.tsx    - Shows last sync time, total submissions per form
├── KoboFormCard.tsx      - Card for each form with submission count, sync button
├── KoboDataTable.tsx     - View raw submissions in table format
└── KoboConfigForm.tsx    - Configure forms and sync interval
```

### Pages (New)

```
/field-data     - KoBo sync dashboard
/settings/kobo  - KoBo configuration
```

### KoBo Sync Dashboard UI

```
┌─────────────────────────────────────────────────────────────┐
│  📊 KOBO DATA SYNC                                          │
│  ─────────────────────────────────────────────────────────  │
│  API Status: ✅ Connected                                   │
│  Last Sync: 2 hours ago                                     │
│                                                             │
│  FORM STATUS:                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🌳 Tree Planting Log                                  │ │
│  │    Submissions: 23 | New since last sync: 3           │ │
│  │    Last entry: Mar 5, 2026                            │ │
│  │                                                       │ │
│  │ 💧 Aluyan River Watershed Monitoring                  │ │
│  │    Submissions: 12 | New since last sync: 1           │ │
│  │    Last entry: Mar 3, 2026                            │ │
│  │                                                       │ │
│  │ 🚶 Bantay Bukid Patrol Report                         │ │
│  │    Submissions: 47 | New since last sync: 5           │ │
│  │    Last entry: Mar 6, 2026                            │ │
│  │                                                       │ │
│  │ 📷 Roots and Rivers: Photo Story                      │ │
│  │    Submissions: 8 | New since last sync: 0            │ │
│  │    Last entry: Feb 28, 2026                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [🔄 Sync Now]  [⚙️ Configure Forms]  [📊 View All Data]   │
└─────────────────────────────────────────────────────────────┘
```

### Hook (New)

Create file: `src/hooks/useKobo.ts`

```typescript
import { useState, useEffect } from 'react';
import { koboApi } from '@/lib/kobo-api';
import { KOBO_FORM_MAPPING } from '@/lib/kobo-mapping';

export function useKoboForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchForms() {
      const data = await koboApi.getForms();
      setForms(data.results);
      setLoading(false);
    }
    fetchForms();
  }, []);
  
  return { forms, loading };
}

export function useKoboSync() {
  const [syncing, setSyncing] = useState(false);
  
  async function sync() {
    setSyncing(true);
    await fetch('/api/kobo/sync', { method: 'POST' });
    setSyncing(false);
  }
  
  return { sync, syncing };
}

export function useKoboData(formId: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/kobo/data/${formId}`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    }
    if (formId) fetchData();
  }, [formId]);
  
  return { data, loading };
}
```

---

## Module I: Impact Dashboard Scraper

**Purpose:** Pull live metrics from roots2river.vercel.app/impact for reports

### Impact Scraper Library

Create file: `src/lib/impact-scraper.ts`

```typescript
import * as cheerio from 'cheerio';

export interface ImpactMetrics {
  treesPlanted: number;
  hectaresRestored: number;
  survivalRate: number;
  patrolHours: number;
  communityMembers: number;
  speciesSighted: number;
  waterQuality: string;
  lastScrapedAt: string;
}

export async function scrapeImpactDashboard(): Promise<ImpactMetrics> {
  const response = await fetch('https://roots2river.vercel.app/impact');
  const html = await response.text();
  const $ = cheerio.load(html);
  
  // Adjust selectors based on actual dashboard structure
  // These are placeholder selectors - update after inspecting the actual page
  return {
    treesPlanted: parseInt($('[data-metric="trees"]').text()) || 
                  parseInt($('.trees-planted').text()) || 0,
    hectaresRestored: parseFloat($('[data-metric="hectares"]').text()) || 
                      parseFloat($('.hectares').text()) || 0,
    survivalRate: parseFloat($('[data-metric="survival"]').text()) || 
                  parseFloat($('.survival-rate').text()) || 0,
    patrolHours: parseInt($('[data-metric="patrol-hours"]').text()) || 
                 parseInt($('.patrol-hours').text()) || 0,
    communityMembers: parseInt($('[data-metric="community"]').text()) || 
                      parseInt($('.community-members').text()) || 0,
    speciesSighted: parseInt($('[data-metric="species"]').text()) || 
                    parseInt($('.species-count').text()) || 0,
    waterQuality: $('[data-metric="water-quality"]').text() || 
                  $('.water-quality').text() || 'N/A',
    lastScrapedAt: new Date().toISOString()
  };
}
```

### Firestore Collection (New)

```
/impactMetrics/{projectId}
  - treesPlanted: number
  - hectaresRestored: number
  - survivalRate: number
  - patrolHours: number
  - communityMembers: number
  - speciesSighted: number
  - waterQuality: string
  - lastScrapedAt: timestamp
  - sourceUrl: string

/settings/impactDashboard
  - url: "https://roots2river.vercel.app/impact"
  - syncIntervalMinutes: 30
  - metricSelectors: {
      treesPlanted: '[data-metric="trees"]',
      hectaresRestored: '[data-metric="hectares"]',
      // ... other selectors
    }
```

### API Route (New)

Create file: `src/app/api/impact/scrape/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { scrapeImpactDashboard } from '@/lib/impact-scraper';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    
    const metrics = await scrapeImpactDashboard();
    
    // Save to Firestore
    await setDoc(doc(db, 'impactMetrics', projectId), {
      ...metrics,
      sourceUrl: 'https://roots2river.vercel.app/impact'
    });
    
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const metrics = await scrapeImpactDashboard();
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### UI Components (New)

```
src/components/impact/
├── ImpactMetricsCard.tsx   - Display scraped metrics
└── ImpactSyncStatus.tsx    - Last sync time, sync button
```

### Impact Metrics Card UI

```
┌─────────────────────────────────────────────────────────────┐
│  📈 IMPACT DASHBOARD SYNC                                   │
│  ─────────────────────────────────────────────────────────  │
│  Source: https://roots2river.vercel.app/impact              │
│  Last Sync: 30 minutes ago                                  │
│                                                             │
│  CURRENT METRICS:                                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🌳 Trees Planted:              1,247                  │ │
│  │ 📏 Hectares Restored:          7.3 ha                 │ │
│  │ 🌱 Survival Rate:              84%                    │ │
│  │ 🚶 Patrol Hours:               312 hrs                │ │
│  │ 👥 Community Members Engaged:  45                     │ │
│  │ 🐦 Species Sighted:            12                     │ │
│  │ 💧 Water Quality Index:        Good (7.2/10)          │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [🔄 Sync Now]  [📊 View Dashboard]  [📝 Use in Report]    │
└─────────────────────────────────────────────────────────────┘
```

### Hook (New)

Create file: `src/hooks/useImpactMetrics.ts`

```typescript
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export function useImpactMetrics(projectId: string) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'impactMetrics', projectId),
      (doc) => {
        setMetrics(doc.data());
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [projectId]);
  
  async function sync() {
    setLoading(true);
    await fetch('/api/impact/scrape', {
      method: 'POST',
      body: JSON.stringify({ projectId })
    });
  }
  
  return { metrics, loading, sync };
}
```

---

## Module J: Auto-Report Generator

**Purpose:** Combine KoBo + Impact Dashboard data into donor-ready reports

### Report Generator Library

Create file: `src/lib/report-generator.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ReportParams {
  grantId: string;
  reportType: 'quarterly' | 'annual' | 'final';
  reportingPeriod: { start: Date; end: Date };
  koboData: any;
  impactMetrics: any;
  donorPersona: 'scientific' | 'humanitarian' | 'innovation';
  funderName: string;
  projectName: string;
}

export async function generateReportContent(params: ReportParams) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `
You are a grant report writer for Tabi Po Foundation, a conservation nonprofit.

Generate a ${params.reportType} progress report.

PROJECT: ${params.projectName}
FUNDER: ${params.funderName}
PERIOD: ${params.reportingPeriod.start.toISOString().split('T')[0]} to ${params.reportingPeriod.end.toISOString().split('T')[0]}
DONOR PERSONA: ${params.donorPersona}

KOBO FIELD DATA:
${JSON.stringify(params.koboData, null, 2)}

IMPACT DASHBOARD METRICS:
${JSON.stringify(params.impactMetrics, null, 2)}

INSTRUCTIONS:
1. Write in professional but warm tone
2. Lead with achievements, acknowledge challenges
3. Use specific numbers from the data
4. For Scientific persona: emphasize species names, metrics, methodology
5. For Humanitarian persona: emphasize community involvement, livelihoods
6. For Innovation persona: emphasize data systems, technology, monitoring
7. Include glossary definitions for Filipino terms (first use only):
   - Bantay Bukid = community forest guards
   - Sitio = small village
   - Barangay = smallest administrative division
   - ANR = Assisted Natural Regeneration
8. Keep executive summary under 150 words
9. Each section should be 2-4 bullet points + 1-2 sentences of context

Return ONLY valid JSON (no markdown):
{
  "executive_summary": "string",
  "sections": [
    { 
      "title": "string", 
      "content": "string", 
      "metrics": [{ "label": "string", "value": "string" }] 
    }
  ],
  "challenges": "string",
  "next_steps": "string"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Parse JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text];
  return JSON.parse(jsonMatch[1] || text);
}

export async function generateWordDocument(reportData: any, letterhead: any) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Letterhead
        new Paragraph({
          children: [
            new TextRun({ text: letterhead.organizationName, bold: true, size: 32 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: letterhead.taxStatus, size: 20, color: '666666' }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: letterhead.address, size: 20 }),
          ],
          spacing: { after: 400 },
        }),
        
        // Report title
        new Paragraph({
          text: 'QUARTERLY PROGRESS REPORT',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
        
        // Executive Summary
        new Paragraph({
          text: 'Executive Summary',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: reportData.executive_summary,
          spacing: { after: 300 },
        }),
        
        // Dynamic sections
        ...reportData.sections.flatMap((section: any) => [
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: section.content,
            spacing: { after: 200 },
          }),
          // Metrics as bullet points
          ...section.metrics.map((m: any) => 
            new Paragraph({
              text: `• ${m.label}: ${m.value}`,
              spacing: { after: 100 },
            })
          ),
        ]),
        
        // Challenges & Next Steps
        new Paragraph({
          text: 'Challenges & Next Steps',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: reportData.challenges,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: reportData.next_steps,
          spacing: { after: 300 },
        }),
        
        // Footer
        new Paragraph({
          children: [
            new TextRun({ text: '─'.repeat(50), color: 'CCCCCC' }),
          ],
          spacing: { before: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${letterhead.email} | ${letterhead.website}`, size: 18, color: '666666' }),
          ],
        }),
      ],
    }],
  });
  
  return await Packer.toBuffer(doc);
}

export async function generateCoverEmail(params: {
  funderContact: string;
  reportType: string;
  projectName: string;
  keyHighlights: string[];
  donorPersona: string;
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `
Generate a brief cover email for submitting a ${params.reportType} report.

Funder Contact: ${params.funderContact}
Project: ${params.projectName}
Key Highlights: ${params.keyHighlights.join(', ')}
Tone: Professional but warm, ${params.donorPersona} focus

Keep under 150 words. Include:
- Brief greeting
- 3 bullet points of key achievements
- Offer to discuss
- Warm sign-off (don't include signature - that's added automatically)

Return just the email body text, no subject line.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Firestore Collection (New)

```
/grants/{grantId}/monitoringReports/{reportId}
  - reportType: string (quarterly, annual, final)
  - reportingPeriodStart: timestamp
  - reportingPeriodEnd: timestamp
  - dueDate: timestamp
  - status: string (upcoming, draft, submitted, acknowledged)
  - koboDataSyncedAt: timestamp
  - impactDataSyncedAt: timestamp
  - generatedDocUrl: string | null
  - coverEmailDraft: string | null
  - submittedAt: timestamp | null
  - createdAt: timestamp
```

### API Routes (New)

Create file: `src/app/api/reports/generate/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { generateReportContent, generateWordDocument, generateCoverEmail } from '@/lib/report-generator';
import { koboApi } from '@/lib/kobo-api';
import { scrapeImpactDashboard } from '@/lib/impact-scraper';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { driveCli } from '@/lib/google-workspace-cli';

export async function POST(request: Request) {
  try {
    const { 
      grantId, 
      reportType, 
      reportingPeriod, 
      donorPersona,
      outputFormat // 'docx' | 'email' | 'both'
    } = await request.json();
    
    // Get grant details
    const grantDoc = await getDoc(doc(db, 'grants', grantId));
    const grant = grantDoc.data();
    
    // Sync KoBo data
    const koboData = {};
    for (const formId of ['tree_planting_log', 'watershed_monitoring', 'bantay_bukid_patrol', 'photo_story']) {
      const data = await koboApi.getFormSubmissions(formId, 100);
      koboData[formId] = data.results;
    }
    
    // Sync Impact data
    const impactMetrics = await scrapeImpactDashboard();
    
    // Generate report content
    const reportContent = await generateReportContent({
      grantId,
      reportType,
      reportingPeriod,
      koboData,
      impactMetrics,
      donorPersona,
      funderName: grant.funderName,
      projectName: grant.projectName || 'Roots & Rivers'
    });
    
    const result: any = { reportContent };
    
    // Generate Word document
    if (outputFormat === 'docx' || outputFormat === 'both') {
      const letterhead = await getDoc(doc(db, 'settings', 'letterhead'));
      const docBuffer = await generateWordDocument(reportContent, letterhead.data());
      
      // Save to temp file and upload to Drive
      const fileName = `${reportType}_Report_${grant.funderName}_${new Date().toISOString().split('T')[0]}.docx`;
      // ... upload logic
      
      result.documentUrl = `https://drive.google.com/...`; // Return Drive URL
    }
    
    // Generate cover email
    if (outputFormat === 'email' || outputFormat === 'both') {
      const coverEmail = await generateCoverEmail({
        funderContact: grant.primaryContactName || 'there',
        reportType,
        projectName: grant.projectName || 'Roots & Rivers',
        keyHighlights: reportContent.sections.slice(0, 3).map(s => s.title),
        donorPersona
      });
      
      result.coverEmail = coverEmail;
    }
    
    // Save report record
    const reportId = `${reportType}_${Date.now()}`;
    await setDoc(doc(db, 'grants', grantId, 'monitoringReports', reportId), {
      reportType,
      reportingPeriodStart: new Date(reportingPeriod.start),
      reportingPeriodEnd: new Date(reportingPeriod.end),
      status: 'draft',
      koboDataSyncedAt: new Date(),
      impactDataSyncedAt: new Date(),
      generatedDocUrl: result.documentUrl || null,
      coverEmailDraft: result.coverEmail || null,
      createdAt: new Date()
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### UI Components (New)

```
src/components/reports/
├── ReportGenerator.tsx       - Full report generation wizard
├── ReportPreview.tsx         - Preview generated report before saving
├── ReportDataSources.tsx     - Show connected data sources with sync status
└── MonitoringReminders.tsx   - List upcoming report deadlines
```

### Pages (New)

```
/reports - Report generation dashboard
```

### Report Generator UI

```
┌─────────────────────────────────────────────────────────────┐
│  📝 AUTO-GENERATE MONITORING REPORT                         │
│  ─────────────────────────────────────────────────────────  │
│  Grant: Moore Foundation - Roots & Rivers                   │
│  Report Type: Q1 Progress Report                            │
│  Reporting Period: Jan 1 - Mar 31, 2026                     │
│                                                             │
│  DATA SOURCES:                                              │
│  ☑️ KoBo: Tree Planting Log (23 entries)                   │
│  ☑️ KoBo: Bantay Bukid Patrol Report (47 entries)          │
│  ☑️ KoBo: Watershed Monitoring (12 entries)                │
│  ☑️ KoBo: Photo Stories (8 entries)                        │
│  ☑️ Impact Dashboard (synced 30 min ago)                   │
│  ☐ Manual Notes (optional)                                 │
│                                                             │
│  OUTPUT FORMAT:                                             │
│  ○ Word Document (.docx) only                              │
│  ○ Email Narrative only                                    │
│  ● Both (recommended)                                      │
│                                                             │
│  DONOR PERSONA:                                             │
│  ● 🔬 Scientific/Conservation                               │
│  ○ 🤝 Humanitarian/Social                                  │
│  ○ 💡 Innovation/Tech                                      │
│                                                             │
│  ☑️ Include Glossary Definitions                            │
│  ☑️ Attach Photo Evidence (top 5)                          │
│                                                             │
│  [📝 Generate Report]                                       │
└─────────────────────────────────────────────────────────────┘
```

### Hook (New)

Create file: `src/hooks/useReportGenerator.ts`

```typescript
import { useState } from 'react';

interface ReportConfig {
  grantId: string;
  reportType: 'quarterly' | 'annual' | 'final';
  reportingPeriod: { start: Date; end: Date };
  donorPersona: 'scientific' | 'humanitarian' | 'innovation';
  outputFormat: 'docx' | 'email' | 'both';
  includeGlossary: boolean;
  includePhotos: boolean;
}

export function useReportGenerator() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  async function generate(config: ReportConfig) {
    setGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGenerating(false);
    }
  }
  
  return { generate, generating, result, error };
}
```

---

## Module E2: Monitoring Report Reminders

**Purpose:** Never miss a monitoring submission; auto-draft reports from field data

### Add to Existing Compliance Tracker

Update the compliance module to include monitoring report deadlines.

### Reminder Timeline

| Days Before Due | Alert Type | Auto-Action |
|-----------------|------------|-------------|
| 30 days | 🟡 Early Notice | Dashboard notification |
| 14 days | 🟠 Prepare Report | Auto-sync KoBo + Impact data |
| 7 days | 🔴 Urgent | Auto-generate draft report |
| 1 day | 🔴 Final Warning | Auto-draft cover email |
| 0 days (due) | ⚫ Overdue | Escalation alert |

### Firebase Cloud Function (New)

Create file: `functions/src/monitoring-reminders.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const checkMonitoringDeadlines = functions.pubsub
  .schedule('0 8 * * *') // Run daily at 8am
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    const now = new Date();
    
    // Get all active grants
    const grantsSnapshot = await db
      .collection('grants')
      .where('stage', '==', 'active')
      .get();
    
    for (const grantDoc of grantsSnapshot.docs) {
      const grant = grantDoc.data();
      
      // Get upcoming monitoring reports
      const reportsSnapshot = await db
        .collection('grants')
        .doc(grantDoc.id)
        .collection('monitoringReports')
        .where('status', '==', 'upcoming')
        .get();
      
      for (const reportDoc of reportsSnapshot.docs) {
        const report = reportDoc.data();
        const dueDate = report.dueDate.toDate();
        const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        // 14 days: Auto-sync data
        if (daysUntilDue === 14) {
          await triggerDataSync(grantDoc.id, reportDoc.id);
        }
        
        // 7 days: Auto-generate draft
        if (daysUntilDue === 7) {
          await triggerReportGeneration(grantDoc.id, reportDoc.id);
        }
        
        // 1 day: Auto-draft email
        if (daysUntilDue === 1) {
          await triggerEmailDraft(grantDoc.id, reportDoc.id);
        }
        
        // Create notification
        if ([30, 14, 7, 1, 0].includes(daysUntilDue)) {
          await createNotification(grantDoc.id, reportDoc.id, daysUntilDue);
        }
      }
    }
  });

async function triggerDataSync(grantId: string, reportId: string) {
  // Call KoBo sync and Impact scrape
  // Update report record with sync timestamps
}

async function triggerReportGeneration(grantId: string, reportId: string) {
  // Call report generation API
  // Update report status to 'draft'
}

async function triggerEmailDraft(grantId: string, reportId: string) {
  // Generate cover email
  // Store in report record
}

async function createNotification(grantId: string, reportId: string, daysUntilDue: number) {
  const urgency = daysUntilDue <= 1 ? 'urgent' : daysUntilDue <= 7 ? 'high' : 'normal';
  
  await db.collection('notifications').add({
    grantId,
    reportId,
    type: 'monitoring_reminder',
    message: `Monitoring report due in ${daysUntilDue} days`,
    urgency,
    createdAt: new Date(),
    read: false
  });
}
```

### Monitoring Reminders UI

```
┌─────────────────────────────────────────────────────────────┐
│  📊 MONITORING REPORT DUE IN 7 DAYS                         │
│  ─────────────────────────────────────────────────────────  │
│  Grant: Moore Foundation - Roots & Rivers                   │
│  Report Type: Q1 Progress Report                            │
│  Due: April 15, 2026                                        │
│                                                             │
│  DATA SOURCES (Auto-Synced):                                │
│  ☑️ KoBo: Tree Planting Log (23 submissions)               │
│  ☑️ KoBo: Bantay Bukid Patrol Report (47 submissions)      │
│  ☑️ KoBo: Watershed Monitoring (12 submissions)            │
│  ☑️ KoBo: Photo Stories (8 submissions)                    │
│  ☑️ roots2river.vercel.app/impact (last sync: 2 hrs ago)   │
│                                                             │
│  [🔄 Sync All Sources]  [📝 Generate Report]  [✉️ Draft Email] │
└─────────────────────────────────────────────────────────────┘
```

---

## Google Workspace CLI Integration

**Purpose:** Replace direct API calls with Google Workspace CLI commands

### Installation & Authentication

```bash
# Install Google Cloud SDK (includes Workspace CLI)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Authenticate with Google Workspace
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable gmail.googleapis.com
gcloud services enable calendar-json.googleapis.com
gcloud services enable drive.googleapis.com
```

### CLI Wrapper Library

Create file: `src/lib/google-workspace-cli.ts`

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

export const gmailCli = {
  async listEmails(query: string, maxResults = 10) {
    const { stdout } = await execAsync(
      `gcloud workspace gmail messages list --user="me" --query="${query}" --max-results=${maxResults} --format="json"`
    );
    return JSON.parse(stdout);
  },

  async getEmail(messageId: string) {
    const { stdout } = await execAsync(
      `gcloud workspace gmail messages get --user="me" --id="${messageId}" --format="json"`
    );
    return JSON.parse(stdout);
  },

  async sendEmail(to: string, subject: string, bodyFile: string, attachment?: string) {
    let cmd = `gcloud workspace gmail messages send --user="me" --to="${to}" --subject="${subject}" --body-file="${bodyFile}"`;
    if (attachment) cmd += ` --attachment="${attachment}"`;
    return execAsync(cmd);
  },

  async createDraft(to: string, subject: string, body: string) {
    const tempFile = `/tmp/email_${Date.now()}.txt`;
    await fs.writeFile(tempFile, body);
    const { stdout } = await execAsync(
      `gcloud workspace gmail drafts create --user="me" --to="${to}" --subject="${subject}" --body-file="${tempFile}" --format="json"`
    );
    await fs.unlink(tempFile);
    return JSON.parse(stdout);
  }
};

export const calendarCli = {
  async listEvents(timeMin: string, timeMax: string) {
    const { stdout } = await execAsync(
      `gcloud workspace calendar events list --calendar="primary" --time-min="${timeMin}" --time-max="${timeMax}" --format="json"`
    );
    return JSON.parse(stdout);
  },

  async createEvent(summary: string, start: string, end: string, description?: string, reminders?: string) {
    let cmd = `gcloud workspace calendar events create --calendar="primary" --summary="${summary}" --start="${start}" --end="${end}"`;
    if (description) cmd += ` --description="${description}"`;
    if (reminders) cmd += ` --reminders="${reminders}"`;
    cmd += ' --format="json"';
    const { stdout } = await execAsync(cmd);
    return JSON.parse(stdout);
  },

  async deleteEvent(eventId: string) {
    return execAsync(
      `gcloud workspace calendar events delete --calendar="primary" --event-id="${eventId}"`
    );
  }
};

export const driveCli = {
  async uploadFile(filePath: string, parentId: string, name: string) {
    const { stdout } = await execAsync(
      `gcloud workspace drive files upload --file="${filePath}" --parent="${parentId}" --name="${name}" --format="json"`
    );
    return JSON.parse(stdout);
  },

  async createFolder(name: string, parentId: string) {
    const { stdout } = await execAsync(
      `gcloud workspace drive files create --name="${name}" --mime-type="application/vnd.google-apps.folder" --parent="${parentId}" --format="json"`
    );
    return JSON.parse(stdout);
  },

  async listFiles(folderId: string) {
    const { stdout } = await execAsync(
      `gcloud workspace drive files list --query="'${folderId}' in parents" --format="json"`
    );
    return JSON.parse(stdout);
  },

  async downloadFile(fileId: string, destination: string) {
    return execAsync(
      `gcloud workspace drive files download --file-id="${fileId}" --destination="${destination}"`
    );
  }
};
```

### Hook (New)

Create file: `src/hooks/useGoogleWorkspace.ts`

```typescript
import { useState } from 'react';

export function useGmail() {
  const [loading, setLoading] = useState(false);
  
  async function listEmails(query: string) {
    setLoading(true);
    const response = await fetch(`/api/gmail/list?query=${encodeURIComponent(query)}`);
    setLoading(false);
    return response.json();
  }
  
  async function sendEmail(to: string, subject: string, body: string, attachment?: string) {
    setLoading(true);
    const response = await fetch('/api/gmail/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body, attachment })
    });
    setLoading(false);
    return response.json();
  }
  
  async function createDraft(to: string, subject: string, body: string) {
    setLoading(true);
    const response = await fetch('/api/gmail/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body })
    });
    setLoading(false);
    return response.json();
  }
  
  return { listEmails, sendEmail, createDraft, loading };
}

export function useCalendar() {
  const [loading, setLoading] = useState(false);
  
  async function listEvents(timeMin: string, timeMax: string) {
    setLoading(true);
    const response = await fetch(`/api/calendar/events?timeMin=${timeMin}&timeMax=${timeMax}`);
    setLoading(false);
    return response.json();
  }
  
  async function createEvent(summary: string, start: string, end: string, description?: string) {
    setLoading(true);
    const response = await fetch('/api/calendar/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary, start, end, description })
    });
    setLoading(false);
    return response.json();
  }
  
  return { listEvents, createEvent, loading };
}

export function useDrive() {
  const [loading, setLoading] = useState(false);
  
  async function uploadFile(file: File, folderId: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);
    
    const response = await fetch('/api/drive/upload', {
      method: 'POST',
      body: formData
    });
    setLoading(false);
    return response.json();
  }
  
  async function listFiles(folderId: string) {
    setLoading(true);
    const response = await fetch(`/api/drive/list?folderId=${folderId}`);
    setLoading(false);
    return response.json();
  }
  
  return { uploadFile, listFiles, loading };
}
```

---

## Environment Variables (Add to .env.local)

```bash
# KoBo Toolbox (NEW)
KOBO_API_KEY=YOUR_KOBO_API_KEY
KOBO_API_URL=https://kf.kobotoolbox.org/api/v2

# Impact Dashboard (NEW)
IMPACT_DASHBOARD_URL=https://roots2river.vercel.app/impact
```

---

## New Files Summary

### Libraries (`src/lib/`)
- `kobo-api.ts` - KoBo API wrapper
- `kobo-mapping.ts` - Form field mapping
- `impact-scraper.ts` - Dashboard scraper
- `report-generator.ts` - AI report generation + Word doc
- `google-workspace-cli.ts` - CLI wrapper functions

### Hooks (`src/hooks/`)
- `useKobo.ts` - KoBo data hooks
- `useImpactMetrics.ts` - Impact dashboard hooks
- `useReportGenerator.ts` - Report generation hooks
- `useGoogleWorkspace.ts` - Gmail, Calendar, Drive hooks

### Components (`src/components/`)
- `kobo/KoboSyncStatus.tsx`
- `kobo/KoboFormCard.tsx`
- `kobo/KoboDataTable.tsx`
- `kobo/KoboConfigForm.tsx`
- `impact/ImpactMetricsCard.tsx`
- `impact/ImpactSyncStatus.tsx`
- `reports/ReportGenerator.tsx`
- `reports/ReportPreview.tsx`
- `reports/ReportDataSources.tsx`
- `reports/MonitoringReminders.tsx`

### API Routes (`src/app/api/`)
- `kobo/forms/route.ts`
- `kobo/sync/route.ts`
- `kobo/data/[formId]/route.ts`
- `impact/scrape/route.ts`
- `reports/generate/route.ts`
- `gmail/list/route.ts`
- `gmail/send/route.ts`
- `gmail/draft/route.ts`
- `calendar/events/route.ts`
- `calendar/create/route.ts`
- `drive/upload/route.ts`
- `drive/list/route.ts`

### Pages (`src/app/(dashboard)/`)
- `field-data/page.tsx`
- `reports/page.tsx`
- `settings/kobo/page.tsx`

### Cloud Functions (`functions/src/`)
- `kobo-sync.ts` - Scheduled KoBo sync
- `impact-scrape.ts` - Scheduled impact scrape
- `monitoring-reminders.ts` - Daily reminder check

---

## Dependencies to Install

```bash
npm install cheerio docx @google/generative-ai
```

---

*Blueprint v6 Additions - For use with existing Tabi Po Grant Dashboard*
