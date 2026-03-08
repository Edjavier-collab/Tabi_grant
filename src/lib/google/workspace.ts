import { google } from "googleapis";
import { getOAuth2Client } from "./gmail";

/**
 * Get the Google Drive client.
 */
export async function getDriveClient(tokens: { access_token: string; refresh_token: string }) {
    const client = getOAuth2Client();
    client.setCredentials(tokens);
    return google.drive({ version: "v3", auth: client });
}

/**
 * Get the Google Calendar client.
 */
export async function getCalendarClient(tokens: { access_token: string; refresh_token: string }) {
    const client = getOAuth2Client();
    client.setCredentials(tokens);
    return google.calendar({ version: "v3", auth: client });
}

/**
 * Create a folder in Google Drive for a grant.
 */
export async function createGrantFolder(
    tokens: { access_token: string; refresh_token: string },
    grantName: string
) {
    const drive = await getDriveClient(tokens);
    
    const fileMetadata = {
        name: `Grant: ${grantName}`,
        mimeType: "application/vnd.google-apps.folder",
    };

    const res = await drive.files.create({
        requestBody: fileMetadata,
        fields: "id, webViewLink",
    });

    return {
        id: res.data.id,
        link: res.data.webViewLink,
    };
}

/**
 * Sync a grant deadline to the user's Google Calendar.
 */
export async function syncDeadlineToCalendar(
    tokens: { access_token: string; refresh_token: string },
    grantName: string,
    deadlineDate: string,
    funder: string
) {
    const calendar = await getCalendarClient(tokens);

    const event = {
        summary: `GRANT DEADLINE: ${grantName} (${funder})`,
        description: `Deadline for grant proposal: ${grantName}`,
        start: {
            date: deadlineDate, // Deadlines are usually all-day
        },
        end: {
            date: deadlineDate,
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: "email", minutes: 24 * 60 * 7 }, // 1 week before
                { method: "popup", minutes: 24 * 60 },      // 1 day before
            ],
        },
    };

    const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
    });

    return res.data.id;
}
