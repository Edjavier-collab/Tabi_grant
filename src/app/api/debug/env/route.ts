import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const host = req.headers.get("host");
    const xForwardedHost = req.headers.get("x-forwarded-host");
    const xForwardedProto = req.headers.get("x-forwarded-proto");

    return NextResponse.json({
        reqUrl: req.url,
        host,
        xForwardedHost,
        xForwardedProto,
        APP_URL: process.env.APP_URL || "NOT SET",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT SET",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT SET",
        KOBO_API_KEY: process.env.KOBO_API_KEY ? "SET" : "NOT SET",
        KOBO_API_URL: process.env.KOBO_API_URL || "NOT SET",
        NODE_ENV: process.env.NODE_ENV,
    });
}
