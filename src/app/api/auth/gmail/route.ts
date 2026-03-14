import { NextRequest, NextResponse } from "next/server";
import { getWorkspaceAuthUrl } from "@/lib/google/gmail";

export async function GET(req: NextRequest) {
    const url = getWorkspaceAuthUrl(req.url);
    return NextResponse.redirect(url);
}
