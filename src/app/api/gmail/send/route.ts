import { NextResponse } from 'next/server';
import { gmailCli } from '@/lib/google-workspace-cli';
import * as fs from 'fs/promises';

export async function POST(request: Request) {
    try {
        const { to, subject, body, attachment } = await request.json();
        const tempFile = `/tmp/email_body_${Date.now()}.txt`;
        await fs.writeFile(tempFile, body);

        await gmailCli.sendEmail(to, subject, tempFile, attachment);
        await fs.unlink(tempFile);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
