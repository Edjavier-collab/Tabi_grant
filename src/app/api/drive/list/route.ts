import { NextResponse } from 'next/server';
import { driveCli } from '@/lib/google-workspace-cli';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
        return NextResponse.json({ error: 'folderId query parameter is required' }, { status: 400 });
    }

    try {
        const data = await driveCli.listFiles(folderId);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
