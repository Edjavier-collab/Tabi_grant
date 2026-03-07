import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/google/gmail";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("gmail_access_token")?.value;
        const refreshToken = cookieStore.get("gmail_refresh_token")?.value;

        if (!accessToken || !refreshToken) {
            return NextResponse.json({ error: "Gmail not connected" }, { status: 401 });
        }

        const { to, subject, body } = await req.json();

        if (!to || !subject || !body) {
            return NextResponse.json({ error: "to, subject, and body are required" }, { status: 400 });
        }

        const result = await sendEmail(
            { access_token: accessToken, refresh_token: refreshToken },
            to,
            subject,
            body
        );

        return NextResponse.json({ success: true, messageId: result.id });
    } catch (error: unknown) {
        console.error("Gmail send error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
