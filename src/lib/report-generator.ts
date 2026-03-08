import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ReportParams {
  grantId: string;
  reportType: 'quarterly' | 'annual' | 'final' | string;
  reportingPeriod: { start: Date | string; end: Date | string };
  koboData: any;
  impactMetrics: any;
  donorPersona: 'scientific' | 'humanitarian' | 'innovation' | string;
  funderName: string;
  projectName: string;
}

export async function generateReportContent(params: ReportParams) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const startDate = new Date(params.reportingPeriod.start).toISOString().split('T')[0];
  const endDate = new Date(params.reportingPeriod.end).toISOString().split('T')[0];

  const prompt = `
You are a grant report writer for Tabi Po Foundation, a conservation nonprofit.

Generate a ${params.reportType} progress report.

PROJECT: ${params.projectName}
FUNDER: ${params.funderName}
PERIOD: ${startDate} to ${endDate}
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

Return ONLY valid JSON (no markdown block or surrounding text):
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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, text];
    const parsed = JSON.parse(jsonMatch[1] || text);
    return parsed;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

export async function generateWordDocument(reportData: any, letterhead: any) {
  const safeLetterhead = letterhead || {
    organizationName: "Tabi Po Foundation",
    taxStatus: "A 501(c)(3) Tax-Exempt Organization",
    address: "P.O. Box 10163, Palm Desert, California, USA",
    email: "email@tabipofoundation.org",
    website: "www.tabipofoundation.org"
  };

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: safeLetterhead.organizationName, bold: true, size: 32 })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: safeLetterhead.taxStatus, size: 20, color: '666666' })],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: safeLetterhead.address, size: 20 })],
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'PROGRESS REPORT',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Executive Summary',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: reportData.executive_summary || "Sample summary.",
          spacing: { after: 300 },
        }),
        ...(reportData.sections || []).flatMap((section: any) => [
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: section.content,
            spacing: { after: 200 },
          }),
          ...(section.metrics || []).map((m: any) =>
            new Paragraph({
              text: `• ${m.label}: ${m.value}`,
              spacing: { after: 100 },
              bullet: { level: 0 }
            })
          ),
        ]),
        new Paragraph({
          text: 'Challenges & Next Steps',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: reportData.challenges || "None",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: reportData.next_steps || "None",
          spacing: { after: 300 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '─'.repeat(50), color: 'CCCCCC' })],
          spacing: { before: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `${safeLetterhead.email} | ${safeLetterhead.website}`, size: 18, color: '666666' })],
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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
- Warm sign-off (don't include signature)
Return just the email body text, no subject line.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini mail generation failed:", error);
    return "Dear " + params.funderContact + ",\n\nPlease find the attached report.\n\nBest,\nTabi Po Foundation";
  }
}
