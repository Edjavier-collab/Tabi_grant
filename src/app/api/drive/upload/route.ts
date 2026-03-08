import { NextResponse } from 'next/server';
import { driveCli } from '@/lib/google-workspace-cli';
import * as fs from 'fs/promises';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folderId = formData.get('folderId') as string;

        if (!file || !folderId) {
            return NextResponse.json({ error: 'File and folderId are required.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempFile = `/tmp/drive_upload_${Date.now()}_${file.name}`;
        await fs.writeFile(tempFile, buffer);

        const result = await driveCli.uploadFile(tempFile, folderId, file.name);
        await fs.unlink(tempFile);

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
