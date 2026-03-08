import { NextResponse } from 'next/server';
import { generateReportContent, generateWordDocument, generateCoverEmail } from '@/lib/report-generator';
import { koboApi } from '@/lib/kobo-api';
import { scrapeImpactDashboard } from '@/lib/impact-scraper';
import { KOBO_FORM_MAPPING } from '@/lib/kobo-mapping';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            grantId,
            reportType,
            reportingPeriod,
            donorPersona,
            outputFormat // 'docx' | 'email' | 'both'
        } = body;

        let grant = { funderName: 'Example Funder', projectName: 'Roots & Rivers Integration', primaryContactName: 'Funder Contact' };
        try {
            const grantDoc = await getDoc(doc(db, 'grants', grantId));
            if (grantDoc.exists()) {
                grant = { ...grant, ...grantDoc.data() as any };
            }
        } catch (e) { }

        const koboData: Record<string, any> = {};
        for (const formId of ['tree_planting_log', 'watershed_monitoring', 'bantay_bukid_patrol', 'photo_story']) {
            try {
                // Ensure formInfo and its UID exist
                const formInfo = KOBO_FORM_MAPPING[formId];
                if (formInfo && formInfo.uid) {
                    const data = await koboApi.getFormSubmissions(formInfo.uid, 10);
                    koboData[formId] = data.results || [];
                } else {
                    koboData[formId] = [];
                }
            } catch (e) { koboData[formId] = []; }
        }

        const impactMetrics = await scrapeImpactDashboard();

        const reportContent = await generateReportContent({
            grantId,
            reportType,
            reportingPeriod,
            koboData,
            impactMetrics,
            donorPersona,
            funderName: grant.funderName,
            projectName: grant.projectName
        });

        const result: any = { reportContent };

        if (outputFormat === 'docx' || outputFormat === 'both') {
            let letterhead = null;
            try {
                const lh = await getDoc(doc(db, 'settings', 'letterhead'));
                if (lh.exists()) letterhead = lh.data();
            } catch (e) { }

            const buffer = await generateWordDocument(reportContent, letterhead);
            const base64Doc = Buffer.from(buffer).toString('base64');
            // Sending base64 as download via data URL for now
            result.documentUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64Doc}`;
        }

        if (outputFormat === 'email' || outputFormat === 'both') {
            const coverEmail = await generateCoverEmail({
                funderContact: grant.primaryContactName,
                reportType,
                projectName: grant.projectName,
                keyHighlights: (reportContent.sections || []).slice(0, 3).map((s: any) => s.title),
                donorPersona
            });
            result.coverEmail = coverEmail;
        }

        try {
            const reportId = `${reportType}_${Date.now()}`;
            await setDoc(doc(db, 'grants', grantId, 'monitoringReports', reportId), {
                reportType,
                reportingPeriodStart: new Date(reportingPeriod.start).toISOString(),
                reportingPeriodEnd: new Date(reportingPeriod.end).toISOString(),
                status: 'draft',
                koboDataSyncedAt: new Date().toISOString(),
                impactDataSyncedAt: new Date().toISOString(),
                generatedDocUrl: result.documentUrl ? "Generated" : null,
                coverEmailDraft: result.coverEmail || null,
                createdAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Failed recording to DB", e);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
