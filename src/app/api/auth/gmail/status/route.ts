import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const hasAccessToken = cookieStore.has("gmail_access_token");
        const hasRefreshToken = cookieStore.has("gmail_refresh_token");

        // We consider it connected if we have at least a refresh token 
        // (access tokens expire, but refresh tokens let us get new ones)
        const isConnected = hasAccessToken || hasRefreshToken;

        return NextResponse.json({ connected: isConnected });
    } catch (error) {
        console.error("Error checking Gmail status:", error);
        return NextResponse.json({ connected: false });
    }
}
