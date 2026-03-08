import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { scrapeRecentEmails } from "@/lib/google/workspace-cli";
import { addGrant } from "@/lib/firebase/db";
import { Stage } from "@/types/grant";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST() {
    if (!apiKey) {
        return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
    }

    try {
        // Scrape the last 5 funder-related emails
        // Adjust the query as needed. Using "is:unread" could limit it to new ones.
        const emails = await scrapeRecentEmails("label:inbox AND (grant OR funding OR proposal OR LOI)", 5);

        if (emails.length === 0) {
            return NextResponse.json({ message: "No relevant emails found.", count: 0 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        funderName: {
                            type: SchemaType.STRING,
                            description: "The name of the foundation or organization in the email."
                        },
                        amountRequested: {
                            type: SchemaType.NUMBER,
                            description: "Any grant amount mentioned. 0 if not mentioned."
                        },
                        nextDeadline: {
                            type: SchemaType.STRING,
                            description: "Any upcoming deadline mentioned (YYYY-MM-DD). Empty string if none."
                        },
                        isRelevantGrant: {
                            type: SchemaType.BOOLEAN,
                            description: "True if this email represents a new grant opportunity or actionable update. False if it's just spam, a newsletter, or unrelated."
                        }
                    },
                    required: ["funderName", "amountRequested", "nextDeadline", "isRelevantGrant"],
                },
            }
        });

        let addedCount = 0;

        for (const email of emails) {
            const prompt = `
            Analyze the following email and extract grant-related information. 
            Is this a relevant grant opportunity for our foundation?
            
            Subject: ${email.subject}
            From: ${email.from}
            Snippet: ${email.snippet}
            `;

            try {
                const result = await model.generateContent(prompt);
                const extracted = JSON.parse(result.response.text());

                // Only add to dashboard if the AI thinks it's a relevant grant
                if (extracted.isRelevantGrant && extracted.funderName) {
                    await addGrant({
                        funderName: extracted.funderName,
                        amountRequested: extracted.amountRequested || 0,
                        currentStage: "Prospect",
                        projectLinked: "Sync from Inbox", // Placeholder
                        primaryContact: {
                            name: "Unknown",
                            email: email.from
                        },
                        notes: `Auto-imported from Gmail via Workspace CLI.\nSubject: ${email.subject}\nDeadline: ${extracted.nextDeadline || "Unknown"}`
                    });
                    addedCount++;
                }
            } catch (err) {
                console.error("Failed to process email with AI:", err);
            }
        }

        return NextResponse.json({
            message: `Successfully processed ${emails.length} emails. Added ${addedCount} new prospects.`,
            count: addedCount
        });

    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json(
            { error: "Internal server error during sync." },
            { status: 500 }
        );
    }
}
