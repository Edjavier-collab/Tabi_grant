import { NextResponse } from 'next/server';
import { koboApi } from '@/lib/kobo-api';

export async function GET() {
    try {
        const data = await koboApi.getForms();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
