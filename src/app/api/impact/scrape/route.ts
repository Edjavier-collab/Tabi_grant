import { NextResponse } from 'next/server';
import { scrapeImpactDashboard } from '@/lib/impact-scraper';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { projectId } = await request.json();
        if (!projectId) {
            return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
        }

        const metrics = await scrapeImpactDashboard();

        await setDoc(doc(db, 'impactMetrics', projectId), {
            ...metrics,
            sourceUrl: process.env.IMPACT_DASHBOARD_URL || 'https://roots2river.vercel.app/impact'
        });

        return NextResponse.json({ success: true, metrics });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const metrics = await scrapeImpactDashboard();
        return NextResponse.json(metrics);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
