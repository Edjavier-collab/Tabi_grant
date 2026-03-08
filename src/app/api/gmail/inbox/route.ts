import { NextRequest, NextResponse } from "next/server";
import { searchInbox } from "@/lib/google/gmail";
import { getUserTokens } from "@/lib/firebase/db";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get("gmail_access_token")?.value;
        let refreshToken = cookieStore.get("gmail_refresh_token")?.value;
        const userId = cookieStore.get("uid")?.value;

        // Fallback to Firestore if cookies are missing but we have a UID
        if ((!accessToken || !refreshToken) && userId) {
            const tokens = await getUserTokens(userId);
            if (tokens) {
                accessToken = tokens.access_token;
                refreshToken = tokens.refresh_token;
            }
        }

        if (!accessToken || !refreshToken) {
            return NextResponse.json({ error: "Gmail not connected. Please connect via Settings." }, { status: 401 });
        }

        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "label:inbox is:unread";

        const threads = await searchInbox(
            { access_token: accessToken, refresh_token: refreshToken },
            query,
            15
        );

        return NextResponse.json({ threads });
    } catch (error: unknown) {
        console.error("Gmail inbox error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
