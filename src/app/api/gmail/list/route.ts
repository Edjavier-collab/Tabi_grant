import { NextResponse } from 'next/server';
import { gmailCli } from '@/lib/google-workspace-cli';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    try {
        const data = await gmailCli.listEmails(query);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
