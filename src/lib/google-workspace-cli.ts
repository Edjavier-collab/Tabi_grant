import { cookies } from "next/headers";
import { getGmailClient } from "./google/gmail";
import { getCalendarClient, getDriveClient } from "./google/workspace";
import { Readable } from 'stream';

async function getAuthTokens() {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("gmail_access_token")?.value;
    const refresh_token = cookieStore.get("gmail_refresh_token")?.value;

    if (!access_token && !refresh_token) {
        throw new Error("No Google authentication tokens found. Please connect your Google account in settings.");
    }

    return { access_token: access_token || "", refresh_token: refresh_token || "" };
}

export const gmailCli = {
    async listEmails(query: string, maxResults = 10) {
        try {
            const tokens = await getAuthTokens();
            const gmail = await getGmailClient(tokens);
            const res = await gmail.users.messages.list({
                userId: "me",
                q: query,
                maxResults,
            });
            const messages = res.data.messages || [];
            return { messages };
        } catch (e: any) {
            console.warn("Failed to list emails via SDK.", e.message);
            return { messages: [] };
        }
    },

    async getEmail(messageId: string) {
        try {
            const tokens = await getAuthTokens();
            const gmail = await getGmailClient(tokens);
            const res = await gmail.users.messages.get({
                userId: "me",
                id: messageId,
                format: "raw",
            });
            return res.data;
        } catch (e) {
            return {};
        }
    },

    async sendEmail(to: string, subject: string, body: string, attachment?: string) {
        try {
            const tokens = await getAuthTokens();
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
            return { stdout: res.data };
        } catch (e: any) {
            console.warn("MOCK SENDING", e.message);
            return { stdout: "mock error" };
        }
    },

    async createDraft(to: string, subject: string, body: string, isHtml: boolean = false) {
        try {
            const tokens = await getAuthTokens();
            const gmail = await getGmailClient(tokens);

            const contentType = isHtml ? 'text/html' : 'text/plain';
            const rawMessage = [
                `To: ${to}`,
                `Subject: ${subject}`,
                `Content-Type: ${contentType}; charset="UTF-8"`,
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
        } catch (e: any) {
            console.error("Failed to create draft", e);
            return { id: "mock-draft-id", error: e.message };
        }
    }
};

export const calendarCli = {
    async listEvents(timeMin: string, timeMax: string) {
        try {
            const tokens = await getAuthTokens();
            const calendar = await getCalendarClient(tokens);
            const res = await calendar.events.list({
                calendarId: "primary",
                timeMin: timeMin ? new Date(timeMin).toISOString() : undefined,
                timeMax: timeMax ? new Date(timeMax).toISOString() : undefined,
                singleEvents: true,
                orderBy: "startTime",
            });
            return { items: res.data.items || [] };
        } catch (e) {
            return { items: [] };
        }
    },

    async createEvent(summary: string, start: string, end: string, description?: string, reminders?: string) {
        try {
            const tokens = await getAuthTokens();
            const calendar = await getCalendarClient(tokens);
            const res = await calendar.events.insert({
                calendarId: "primary",
                requestBody: {
                    summary,
                    description,
                    start: { dateTime: new Date(start).toISOString() },
                    end: { dateTime: new Date(end).toISOString() },
                },
            });
            return res.data;
        } catch (e) {
            return { id: "mock-event-id", status: "confirmed" };
        }
    },

    async deleteEvent(eventId: string) {
        try {
            const tokens = await getAuthTokens();
            const calendar = await getCalendarClient(tokens);
            await calendar.events.delete({
                calendarId: "primary",
                eventId: eventId,
            });
            return { stdout: "deleted" };
        } catch (e) {
            return { stdout: "mock" };
        }
    }
};

export const driveCli = {
    async uploadFile(buffer: Buffer, mimeType: string, parentId: string, name: string) {
        try {
            const tokens = await getAuthTokens();
            const drive = await getDriveClient(tokens);

            const stream = new Readable();
            stream.push(buffer);
            stream.push(null);

            const res = await drive.files.create({
                requestBody: {
                    name,
                    parents: [parentId],
                },
                media: {
                    mimeType,
                    body: stream,
                },
                fields: "id, name, webViewLink",
            });
            return res.data;
        } catch (e) {
            return { id: "mock-file-id" };
        }
    },

    async createFolder(name: string, parentId: string) {
        try {
            const tokens = await getAuthTokens();
            const drive = await getDriveClient(tokens);
            const res = await drive.files.create({
                requestBody: {
                    name,
                    mimeType: "application/vnd.google-apps.folder",
                    parents: [parentId],
                },
                fields: "id",
            });
            return res.data;
        } catch (e) {
            return { id: "mock-folder-id" };
        }
    },

    async listFiles(folderId: string) {
        try {
            const tokens = await getAuthTokens();
            const drive = await getDriveClient(tokens);
            const res = await drive.files.list({
                q: `'${folderId}' in parents`,
                fields: "files(id, name, mimeType, webViewLink)",
            });
            return { files: res.data.files || [] };
        } catch (e) {
            return { files: [] };
        }
    },

    async downloadFile(fileId: string) {
        try {
            const tokens = await getAuthTokens();
            const drive = await getDriveClient(tokens);
            const res = await drive.files.get(
                { fileId, alt: 'media' },
                { responseType: 'arraybuffer' }
            );
            return Buffer.from(res.data as ArrayBuffer);
        } catch (e) {
            return Buffer.from("mock");
        }
    }
};
