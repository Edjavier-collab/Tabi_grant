import { NextResponse } from 'next/server';
import { gmailCli } from '@/lib/google-workspace-cli';

export async function POST(request: Request) {
    try {
        const { to, subject, body, attachment } = await request.json();
        await gmailCli.sendEmail(to, subject, body, attachment);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
