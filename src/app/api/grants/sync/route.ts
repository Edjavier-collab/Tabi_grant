import { NextRequest, NextResponse } from "next/server";
import { getUserTokens } from "@/lib/firebase/db";
import { createGrantFolder, syncDeadlineToCalendar } from "@/lib/google/workspace";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get("gmail_access_token")?.value;
        let refreshToken = cookieStore.get("gmail_refresh_token")?.value;
        const userId = cookieStore.get("uid")?.value;

        const { grantId, funderName, loiDeadline } = await req.json();

        if (!userId) {
            return NextResponse.json({ folderLink: null });
        }

        // Fallback to Firestore tokens
        if (!accessToken || !refreshToken) {
            const tokens = await getUserTokens(userId);
            if (tokens) {
                accessToken = tokens.access_token;
                refreshToken = tokens.refresh_token;
            }
        }

        if (!accessToken || !refreshToken) {
            return NextResponse.json({ folderLink: null });
        }

        const tokens = { access_token: accessToken, refresh_token: refreshToken };

        // Sync Drive Folder
        const folder = await createGrantFolder(tokens, funderName || "New Grant");

        // Sync Calendar Event if deadline exists
        if (loiDeadline) {
            await syncDeadlineToCalendar(
                tokens,
                funderName || "New Grant",
                loiDeadline,
                funderName || "N/A"
            );
        }

        console.log(`Synced Workspace for grant ${grantId}: Folder ${folder.id}`);

        return NextResponse.json({ folderLink: folder.link || null });
    } catch (error: unknown) {
        console.error("Workspace sync error:", error);
        return NextResponse.json({ folderLink: null });
    }
}
