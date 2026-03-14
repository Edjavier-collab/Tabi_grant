import { NextResponse } from "next/server";
import { getWorkspaceAuthUrl } from "@/lib/google/gmail";

export async function GET() {
    const url = getWorkspaceAuthUrl();
    return NextResponse.redirect(url);
}
