import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const { funderName, projectName, amountRequested, persona, programName } = await req.json();

        if (!funderName || !projectName) {
            return NextResponse.json({ error: "funderName and projectName are required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const personaInstructions: Record<string, string> = {
            Scientific: "Use scientific conservation language. Reference biodiversity metrics, IUCN status of species like the Negros Bleeding-heart Dove and Visayan Warty Pig, carbon sequestration data, and watershed health indicators.",
            Humanitarian: "Emphasize community-led conservation, the Aluyan Caduha-an Farmers Association partnership, poverty alleviation, livelihood uplift, women's participation, and indigenous knowledge preservation.",
            Innovation: "Highlight innovative approaches like KoBo/ODK data pipelines, drone monitoring, camera trap AI analysis, real-time dashboards, and GIS mapping for conservation impact measurement.",
        };

        const personaGuide = persona && personaInstructions[persona]
            ? personaInstructions[persona]
            : "Balance conservation science, community impact, and innovative monitoring approaches.";

        const prompt = `You are a professional grant writer for the Tabi Po Foundation, a 501(c)(3) conservation organization working on watershed restoration and biodiversity protection in Northern Negros, Philippines.

Generate a formal Letter of Inquiry (LOI) addressed to ${funderName}${programName ? ` (${programName})` : ""}.

Project: ${projectName}
Amount Requested: $${Number(amountRequested).toLocaleString()}

Donor Persona Guidance: ${personaGuide}

Key project details to incorporate:
- Roots & Rivers: 3-year watershed restoration initiative in Northern Negros Natural Park (NNNP)
- Partners: Aluyan Caduha-an Farmers Association, DENR, local LGUs
- Activities: Assisted Natural Regeneration (ANR), Bantay Bukid (community forest guard) patrols, biodiversity monitoring
- Impact metrics: 500+ hectares restored, 47 patrol incidents logged, 3 Negros Bleeding-heart Dove sightings

Format the LOI with these sections:
1. Opening paragraph (introduce org and purpose)
2. Problem Statement (2-3 sentences)
3. Project Description (key activities and approach)
4. Expected Outcomes (measurable impact)
5. Budget Summary (one line referencing the amount)
6. Closing (express gratitude and next steps)

Keep it professional, warm, and under 600 words. Do NOT include letterhead or addresses — those will be added separately.`;

        const result = await model.generateContent(prompt);
        const loiText = result.response.text();

        return NextResponse.json({ loi: loiText });
    } catch (error: unknown) {
        console.error("LOI Generation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: `Failed to generate LOI: ${message}` }, { status: 500 });
    }
}
