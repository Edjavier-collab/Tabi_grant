import { NextResponse } from 'next/server';
import { gmailCli } from '@/lib/google-workspace-cli';

export async function POST(request: Request) {
    try {
        const { to, subject, body } = await request.json();
        const draft = await gmailCli.createDraft(to, subject, body);
        return NextResponse.json(draft);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
