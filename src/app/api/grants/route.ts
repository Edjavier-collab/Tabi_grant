import { NextRequest, NextResponse } from "next/server";
import { addGrant, getUserTokens, updateGrant } from "@/lib/firebase/db";
import { createGrantFolder, syncDeadlineToCalendar } from "@/lib/google/workspace";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get("gmail_access_token")?.value;
        let refreshToken = cookieStore.get("gmail_refresh_token")?.value;
        const userId = cookieStore.get("uid")?.value;

        const grantData = await req.json();

        // 1. Create Grant in Firestore
        const grantId = await addGrant(grantData);

        // 2. Handle Workspace Sync if connected
        if (userId) {
            // Fallback to Firestore tokens
            if (!accessToken || !refreshToken) {
                const tokens = await getUserTokens(userId);
                if (tokens) {
                    accessToken = tokens.access_token;
                    refreshToken = tokens.refresh_token;
                }
            }

            if (accessToken && refreshToken) {
                const tokens = { access_token: accessToken, refresh_token: refreshToken };
                
                try {
                    // Sync Drive Folder
                    const folder = await createGrantFolder(tokens, grantData.funderName || "New Grant");
                    
                    // Sync Calendar Event if deadline exists
                    let calendarEventId = null;
                    if (grantData.deadline) {
                        calendarEventId = await syncDeadlineToCalendar(
                            tokens,
                            grantData.funderName || "New Grant",
                            grantData.deadline,
                            grantData.funderName || "N/A"
                        );
                    }

                    // Update Grant with Workspace IDs
                    await updateGrant(grantId, {
                        fpicDocumentUrl: folder.link || undefined,
                        // We could add workspaceIds field if we wanted to track them explicitly
                    });
                    
                    console.log(`Synced Workspace for grant ${grantId}: Folder ${folder.id}`);
                } catch (syncError) {
                    console.error("Workspace Sync Error (continuing...):", syncError);
                    // We don't fail the whole request if sync fails
                }
            }
        }

        return NextResponse.json({ success: true, grantId });
    } catch (error: unknown) {
        console.error("Grant creation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
