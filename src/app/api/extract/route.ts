import { NextResponse } from "next/server";
import type { ExtractionResult, CognitiveState } from "@/types";
import { generateContentWithRetry } from "@/utils/gemini";

const apiKey = process.env.GOOGLE_API_KEY;

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const { thought } = await request.json();

        if (!thought) {
            return NextResponse.json(
                { error: "Thought is required" },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        // COGNITIVE EXTRACTOR PROMPT
        const prompt = `You are a meta-cognitive analyzer. 
Analyze the user's statement to extract the underlying psychological state.

User Statement: "${thought}"

Extract two layers:
1. Surface Signals (Fear, Belief, Goal)
2. deeply Hidden Cognitive State (Core Fear, Distortions, Tension)

Return JSON matching this schema:
{
  "fear": "Surface fear (what they are avoiding right now)",
  "belief": "Surface belief (what they assume is true)",
  "protective_goal": "Surface goal (safety/control/approval)",
  "competing_desire": "What they actually want (or null)",
  "cognitive_state": {
    "core_fear": "The deepest existential fear driving this (e.g., 'I am unlovable')",
    "dominant_tension": "The central conflict (e.g., 'Autonomy vs. Connection')",
    "emotional_trend": "stable" | "challenged" | "evolving" | "new",
    "distortions": ["List 1-2 cognitive distortions found, e.g., 'all-or-nothing thinking']",
    "intensity": 1-10 (number)
  }
}

Rules:
- emotional_trend: Use "stable" if reinforcing patterns, "challenged" if questioning them, "evolving" if actively reframing. Use "new" only for the first message.
- Be clinical but use PLAIN ENGLISH.
- "fear" should be specific (e.g. "looking stupid" not "social evaluation anxiety").
- "core_fear" should be existential but readable (e.g. "I'm not enough").
- Detect the *hidden* desire.
- Avoid academic jargon.`;

        const text = await generateContentWithRetry(apiKey, prompt, "Cognitive Extractor");

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from response");
        }

        const extraction: ExtractionResult = JSON.parse(jsonMatch[0]);
        extraction.confidence = "high";

        console.log(`[Cognitive Extractor] State extracted:`, extraction.cognitive_state);
        return NextResponse.json(extraction);

    } catch (error: any) {
        console.error("[Extract] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to extract signals" },
            { status: 500 }
        );
    }
}
