import { NextResponse } from "next/server";
import type { Agent, ExtractionResult, DialogueTurn } from "@/types";
import { generateContentWithRetry } from "@/utils/gemini";

const apiKey = process.env.GOOGLE_API_KEY;

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const {
            agents,
            extraction
        }: {
            agents: Agent[];
            extraction: ExtractionResult;
        } = await request.json();

        if (!agents || agents.length < 2) {
            return NextResponse.json(
                { error: "Agents required" },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        // Map agents by role for easy access in prompt
        const guardian = agents.find(a => a.role === 'guardian') || agents[0];
        const catalyst = agents.find(a => a.role === 'catalyst') || agents[1];
        const processor = agents.find(a => a.role === 'processor') || agents[2];

        const state = extraction.cognitive_state;

        // SEQUENTIAL REASONING PROMPT
        const prompt = `Simulate a Sequential Cognitive Friction loop in the user's mind.

Context:
Core Fear: ${state.core_fear}
Tension: ${state.dominant_tension}

The Forces:
1. ${guardian.name} (Guardian): ${guardian.force}
2. ${catalyst.name} (Catalyst): ${catalyst.force}
3. ${processor.name} (Processor): ${processor.force}

Generate exactly 3 turns of internal pressure (Dialogue):

Turn 1 (${guardian.name}): Reacts immediately with fear. Simple, protective, short.
Turn 2 (${catalyst.name}): Pushes back. Asks for what we want. 
Turn 3 (${processor.name}): Points out the specific disagreement.

Constraints:
- Language Level: Basic English (Grade 6-8).
- NO metaphors (No "poisoning the well", "climbing mountains").
- NO academic jargon.
- NO complex sentences.
- Speak exactly like a part of a person's brain would talk in the middle of a conflict.
- MAX 1-2 short sentences per turn.
- Make them disagree clearly.

Return JSON array:
[
  {"agent_id": "${guardian.id}", "agent_name": "${guardian.name}", "message": "..."},
  {"agent_id": "${catalyst.id}", "agent_name": "${catalyst.name}", "message": "..."},
  {"agent_id": "${processor.id}", "agent_name": "${processor.name}", "message": "..."}
]`;

        const text = await generateContentWithRetry(apiKey, prompt, "Sequential Dialogue");

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from response");
        }

        const dialogue: DialogueTurn[] = JSON.parse(jsonMatch[0]);

        console.log(`[Sequential Dialogue] Generated ${dialogue.length} turns of cognitive friction`);
        return NextResponse.json({ dialogue });

    } catch (error: any) {
        console.error("[Agent Dialogue] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate dialogue" },
            { status: 500 }
        );
    }
}
