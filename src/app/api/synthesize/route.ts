import { NextResponse } from "next/server";
import type { DialogueTurn, ExtractionResult } from "@/types";
import { generateContentWithRetry } from "@/utils/gemini";

const apiKey = process.env.GOOGLE_API_KEY;

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const {
            dialogue,
            extraction
        }: {
            dialogue: DialogueTurn[];
            extraction: ExtractionResult;
        } = await request.json();

        if (!dialogue || !extraction) {
            return NextResponse.json(
                { error: "Dialogue and extraction required" },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const state = extraction.cognitive_state;

        // META-SYNTHESIS PROMPT
        const prompt = `You are the Meta-Cognitive Observer.

User's Cognitive State:
Core Fear: ${state.core_fear}
Tension: ${state.dominant_tension}

Internal Friction (Dialogue):
${dialogue.map(d => `${d.agent_name}: "${d.message}"`).join('\n')}

Task:
Generate ONE single, simple sentence that explains the exact conflict.

Rules:
- Use Basic English.
- NO metaphors.
- Format: "You want [X], but you are doing [Y] because you are afraid of [Z]."
- Create RECOGNITION ("That sounds exactly like me").
- Max 15 words.
- Be direct.

Return JSON:
{ "synthesis": "..." }`;

        const text = await generateContentWithRetry(apiKey, prompt, "Meta Synthesis");

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from response");
        }

        const result = JSON.parse(jsonMatch[0]);
        const synthesis = result.synthesis.replace(/^["']|["']$/g, '');

        console.log(`[Synthesize] Insight generated: "${synthesis}"`);
        return NextResponse.json({ synthesis });

    } catch (error: any) {
        console.error("[Synthesize] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to synthesize" },
            { status: 500 }
        );
    }
}
