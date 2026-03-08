import { NextResponse } from 'next/server';
import { calendarCli } from '@/lib/google-workspace-cli';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get('timeMin') || '';
    const timeMax = searchParams.get('timeMax') || '';

    try {
        const data = await calendarCli.listEvents(timeMin, timeMax);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
