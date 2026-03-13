import { NextRequest, NextResponse } from 'next/server';
import { koboApi } from '@/lib/kobo-api';
import { KOBO_FORM_MAPPING } from '@/lib/kobo-mapping';
import { withAuth } from '@/lib/auth-api';

export const GET = withAuth(async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {
    try {
        const { formId } = await params;
        const formInfo = KOBO_FORM_MAPPING[formId];

        let data = [];
        if (formInfo && formInfo.uid) {
            try {
                const response = await koboApi.getFormSubmissions(formInfo.uid, 50);
                if (response && response.results) {
                    data = response.results;
                }
            } catch (e) {
                console.warn(`Could not fetch submissions for UID ${formInfo.uid}`, e);
            }
        } else {
            console.warn(`No mapping or UID found for formId: ${formId}`);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
