import { google } from "googleapis";

// Identity-only scopes — used for initial OAuth login.
// These are the only scopes shown on the consent screen at sign-in.
const AUTH_SCOPES = [
    "openid",
    "email",
    "profile",
];

// Full Workspace scopes — requested only when user explicitly connects
// their Google Workspace (Gmail, Drive, Calendar integration).
export const WORKSPACE_SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/calendar.events",
];

export function getOAuth2Client() {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
    
    if (!baseUrl && process.env.NODE_ENV === 'production') {
        console.warn("Warning: No base URL (NEXTAUTH_URL) defined in production environment.");
    }

    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${baseUrl || "http://localhost:3000"}/api/auth/callback/google`
    );
}

export function getAuthUrl() {
    const client = getOAuth2Client();
    return client.generateAuthUrl({
        access_type: "offline",
        scope: AUTH_SCOPES,
        prompt: "consent",
    });
}

export function getWorkspaceAuthUrl() {
    const client = getOAuth2Client();
    return client.generateAuthUrl({
        access_type: "offline",
        scope: WORKSPACE_SCOPES,
        prompt: "consent",
    });
}

export async function getGmailClient(tokens: { access_token: string; refresh_token: string }) {
    const client = getOAuth2Client();
    client.setCredentials(tokens);
    return google.gmail({ version: "v1", auth: client });
}

export interface GmailThread {
    id: string;
    subject: string;
    from: string;
    snippet: string;
    date: string;
    labels: string[];
}

/**
 * Fetch recent emails matching a search query (e.g., from a funder).
 */
export async function searchInbox(
    tokens: { access_token: string; refresh_token: string },
    query: string,
    maxResults = 15
): Promise<GmailThread[]> {
    const gmail = await getGmailClient(tokens);

    const res = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults,
    });

    const messages = res.data.messages || [];
    const threads: GmailThread[] = [];

    for (const msg of messages) {
        const detail = await gmail.users.messages.get({
            userId: "me",
            id: msg.id!,
            format: "metadata",
            metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = detail.data.payload?.headers || [];
        const getHeader = (name: string) => headers.find((h) => h.name === name)?.value || "";

        threads.push({
            id: msg.id!,
            subject: getHeader("Subject"),
            from: getHeader("From"),
            snippet: detail.data.snippet || "",
            date: getHeader("Date"),
            labels: detail.data.labelIds || [],
        });
    }

    return threads;
}

/**
 * Send an email via Gmail API.
 */
export async function sendEmail(
    tokens: { access_token: string; refresh_token: string },
    to: string,
    subject: string,
    body: string
) {
    const gmail = await getGmailClient(tokens);

    const rawMessage = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        "",
        body,
    ].join("\n");

    const encodedMessage = Buffer.from(rawMessage)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage,
        },
    });

    return res.data;
}

/**
 * Create a Gmail draft without sending.
 */
export async function createDraft(
    tokens: { access_token: string; refresh_token: string },
    to: string,
    subject: string,
    body: string
) {
    const gmail = await getGmailClient(tokens);

    const rawMessage = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        "",
        body,
    ].join("\n");

    const encodedMessage = Buffer.from(rawMessage)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const res = await gmail.users.drafts.create({
        userId: "me",
        requestBody: {
            message: {
                raw: encodedMessage,
            },
        },
    });

    return res.data;
}
