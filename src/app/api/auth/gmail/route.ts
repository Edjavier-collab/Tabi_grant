import { NextRequest, NextResponse } from "next/server";
import { getWorkspaceAuthUrl, getOriginFromHeaders } from "@/lib/google/gmail";

export async function GET(req: NextRequest) {
    const origin = getOriginFromHeaders(req.headers);
    const url = getWorkspaceAuthUrl(origin);
    return NextResponse.redirect(url);
}
