import { NextRequest, NextResponse } from 'next/server';
import { koboApi } from '@/lib/kobo-api';

export async function GET(request: NextRequest, { params }: { params: Promise<{ formId: string }> }) {
    try {
        const { formId } = await params;
        const mockAssetUid = `mock-uid-for-${formId}`;

        let data = [];
        try {
            const response = await koboApi.getFormSubmissions(mockAssetUid, 10);
            if (response && response.results) {
                data = response.results;
            }
        } catch (e) {
            console.warn("Could not fetch submissions for mock UID", e);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
