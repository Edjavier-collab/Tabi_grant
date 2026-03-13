import { NextResponse } from 'next/server';
import { koboApi } from '@/lib/kobo-api';
import { withAuth } from '@/lib/auth-api';

export const GET = withAuth(async () => {
    try {
        const data = await koboApi.getForms();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
