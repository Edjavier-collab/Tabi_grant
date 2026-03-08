import { NextResponse } from 'next/server';
import { calendarCli } from '@/lib/google-workspace-cli';

export async function POST(request: Request) {
    try {
        const { summary, start, end, description, reminders } = await request.json();
        const event = await calendarCli.createEvent(summary, start, end, description, reminders);
        return NextResponse.json(event);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
