import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as cheerio from "cheerio";
import { withAuth } from "@/lib/auth-api";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const POST = withAuth(async (req: NextRequest) => {
    if (!apiKey) {
        return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { url, textContent } = body;

        if (!url && !textContent) {
            return NextResponse.json(
                { error: "Must provide either a URL or textContent." },
                { status: 400 }
            );
        }

        let contentToAnalyze = textContent;

        // If a URL is provided, fetch and extract the text
        if (url) {
            try {
                const response = await fetch(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch URL: ${response.statusText}`);
                }

                const html = await response.text();
                const $ = cheerio.load(html);

                // Remove scripts, styles, and empty elements to clean up the payload
                $('script, style, noscript, nav, footer, iframe').remove();
                contentToAnalyze = $('body').text().replace(/\s+/g, ' ').trim();

                // Truncate to avoid massive payloads (Gemini Flash has 1M token context, but best to be safe)
                if (contentToAnalyze.length > 100000) {
                    contentToAnalyze = contentToAnalyze.substring(0, 100000);
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                return NextResponse.json(
                    { error: `Failed to scrape URL: ${message}` },
                    { status: 400 }
                );
            }
        }

        // Setup the Gemini Model with JSON schema
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        funderName: {
                            type: SchemaType.STRING,
                            description: "The name of the foundation, organization, or granting agency."
                        },
                        amountRequested: {
                            type: SchemaType.NUMBER,
                            description: "The maximum or average recommended grant amount requested in USD. If a range is given, provide the maximum amount. If no exact number, return 0."
                        },
                        loiDeadline: {
                            type: SchemaType.STRING,
                            description: "The deadline for the Next Letter of Inquiry (LOI) or Phase 1 application. Format as YYYY-MM-DD. If none found or rolling, return empty string."
                        },
                        focusAreas: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.STRING
                            },
                            description: "List of 1-3 key focus areas or priorities of the grant (e.g. 'Marine Conservation', 'Capacity Building')."
                        }
                    },
                    required: ["funderName", "amountRequested", "loiDeadline", "focusAreas"],
                },
            }
        });

        const prompt = `
        Analyze the following text or grant guidelines and extract the requested fields regarding the grant opportunity.
        Be as precise as possible. For dates, infer the closest upcoming year if ambiguous (e.g. assume 2026 if today is 2026).
        
        TEXT TO ANALYZE:
        ${contentToAnalyze}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const extractedData = JSON.parse(responseText);

        return NextResponse.json({ data: extractedData });

    } catch (error) {
        console.error("Extraction error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Internal server error: ${message}` },
            { status: 500 }
        );
    }
});
