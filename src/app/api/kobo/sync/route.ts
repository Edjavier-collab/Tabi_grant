import { NextResponse } from 'next/server';
import { KOBO_FORM_MAPPING } from '@/lib/kobo-mapping';
import { koboApi } from '@/lib/kobo-api';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export async function POST() {
    try {
        const forms = Object.keys(KOBO_FORM_MAPPING);
        const results = [];

        for (const formId of forms) {
            const formInfo = KOBO_FORM_MAPPING[formId];
            const syncDocRef = doc(db, 'koboSync', formId);

            let totalSubmissions = 0;
            if (formInfo.uid) {
                try {
                    const data = await koboApi.getFormSubmissions(formInfo.uid, 500); // 500 max per sync for now
                    totalSubmissions = data.results ? data.results.length : 0;
                } catch (e) {
                    console.error(`Failed to fetch real data for ${formId}`, e);
                }
            }

            // Update sync status tracking
            await setDoc(syncDocRef, {
                formName: formInfo.displayName,
                lastSyncedAt: new Date().toISOString(),
                totalSubmissions: totalSubmissions,
                newSinceLastSync: 0 // Would require storing previous count to calculate diff
            }, { merge: true });

            results.push({ formId, synced: true, count: totalSubmissions });
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
