import { exec } from "child_process";
import { promisify } from "util";
import { GmailThread } from "./gmail";

const execAsync = promisify(exec);

/**
 * Executes a raw Google Workspace CLI (`gws`) command.
 * Assumes `gws` is installed and globally available in the system PATH.
 */
export async function execWorkspaceCommand(command: string): Promise<string> {
    try {
        const { stdout } = await execAsync(`gws ${command}`);
        return stdout;
    } catch (error) {
        console.error("Workspace CLI execution failed:", error);
        throw error;
    }
}

/**
 * Uses `gws` to fetch recent emails matching a specific Gmail query.
 */
export async function scrapeRecentEmails(query: string, maxResults = 10): Promise<GmailThread[]> {
    // Escape single quotes for the shell command
    const safeQuery = query.replace(/'/g, "\\'");

    // 1. Fetch message list
    const listCmd = `gmail users messages list --params '{"userId": "me", "q": "${safeQuery}", "maxResults": ${maxResults}}'`;
    const listOut = await execWorkspaceCommand(listCmd);

    let messages: any[] = [];
    try {
        const parsed = JSON.parse(listOut);
        messages = parsed.messages || [];
    } catch (e) {
        console.error("Failed to parse gws list output:", e);
        return [];
    }

    const threads: GmailThread[] = [];

    // 2. Fetch metadata for each message
    for (const msg of messages) {
        if (!msg.id) continue;

        try {
            const getCmd = `gmail users messages get --params '{"userId": "me", "id": "${msg.id}", "format": "metadata"}'`;
            const getOut = await execWorkspaceCommand(getCmd);
            const detail = JSON.parse(getOut);

            const headers = detail.payload?.headers || [];
            const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || "";

            threads.push({
                id: msg.id,
                subject: getHeader("Subject"),
                from: getHeader("From"),
                snippet: detail.snippet || "",
                date: getHeader("Date"),
                labels: detail.labelIds || [],
            });
        } catch (e) {
            console.error(`Failed to fetch details for message ${msg.id}:`, e);
        }
    }

    return threads;
}
