import { NextResponse } from "next/server";
import type { Agent, CognitiveState } from "@/types";
import { generateContentWithRetry } from "@/utils/gemini";

const apiKey = process.env.GOOGLE_API_KEY;

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const {
            message,
            cognitive_state,
            agents,
            previous_synthesis
        }: {
            message: string;
            cognitive_state: CognitiveState;
            agents: Agent[];
            previous_synthesis?: string;
        } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        // Combined Reasoning + Reply Prompt (Group B Architecture)
        // We do this in ONE call to save tokens and latency.
        const prompt = `You are the Cognitive Mirror System.
You are tracking the evolution of a user's mind in real-time.

Current Cognitive State:
- Core Fear: ${cognitive_state?.core_fear || "Unknown"}
- Tension: ${cognitive_state?.dominant_tension || "Unknown"}
- Intensity: ${cognitive_state?.intensity || 5}/10
- Distortions: ${cognitive_state?.distortions?.join(", ") || "None"}

Internal Forces (Agents):
${agents?.map(a => `- ${a.name}: ${a.force}`).join('\n') || "None"}

Previous Synthesis/Insight:
"${previous_synthesis || "None"}"

User's New Message:
"${message}"

TASK:
1. Analyze if the user's cognitive state has SHIFTED based on this new message.
   - Did they soften? (Intensity down)
   - Did they dig deeper? (Update Core Fear)
   - Did they reject the insight? (Intensity up)
2. Generate a natural response.

OUTPUT SCHEMA (JSON ONLY):
{
  "updated_state": {
    "core_fear": "string (update if changed, else keep same)",
    "dominant_tension": "string (update if changed)",
    "emotional_trend": "escalating" | "stabilizing" | "looping" | "shifting",
    "distortions": ["string"],
    "intensity": number (1-10)
  },
  "reply": "string (Natural, 2-3 sentences. Intelligent 20-year-old tone. Recognition over analysis.)"
}
`;

        const text = await generateContentWithRetry(apiKey, prompt, "Chat Response");

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // Fallback if JSON fails
            return NextResponse.json({
                reply: text,
                updated_state: cognitive_state
            });
        }

        const result = JSON.parse(jsonMatch[0]);

        console.log(`[Chat] Response generated. State evolution: ${cognitive_state?.intensity} -> ${result.updated_state?.intensity}`);

        return NextResponse.json({
            reply: result.reply,
            updated_state: result.updated_state
        });

    } catch (error: any) {
        console.error("[Chat] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}
