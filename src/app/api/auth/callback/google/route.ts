import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/google/gmail";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
    }

    try {
        const client = getOAuth2Client();
        const { tokens } = await client.getToken(code);

        // Store tokens in HTTP-only cookies for session persistence
        const cookieStore = await cookies();

        if (tokens.access_token) {
            cookieStore.set("gmail_access_token", tokens.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 3600, // 1 hour
                path: "/",
            });
        }

        if (tokens.refresh_token) {
            cookieStore.set("gmail_refresh_token", tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
            });
        }

        // Redirect to settings page with success
        return NextResponse.redirect(new URL("/dashboard/settings?gmail=connected", req.url));
    } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(new URL("/dashboard/settings?gmail=error", req.url));
    }
}
