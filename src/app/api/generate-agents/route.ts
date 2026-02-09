import { NextResponse } from "next/server";
import type { ExtractionResult, Agent, CognitiveState } from "@/types";
import { generateContentWithRetry } from "@/utils/gemini";

const apiKey = process.env.GOOGLE_API_KEY;

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const { extraction }: { extraction: ExtractionResult } = await request.json();

        if (!extraction || !extraction.cognitive_state) {
            return NextResponse.json(
                { error: "Valid extraction with cognitive state is required" },
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

        // FORCE-BASED AGENT GENERATOR PROMPT
        const prompt = `Generate the 3 Internal Cognitive Forces for this mind-state:

Core Fear: ${state.core_fear}
Tension: ${state.dominant_tension}
Distortions: ${state.distortions.join(", ")}
Desire: ${extraction.competing_desire || "Unknown"}

Define these 3 specific archetypes (Do not change the roles):
1. guardian (The Protective Force) - Driven by ${state.core_fear}
2. catalyst (The Growth Force) - Driven by the desire for ${extraction.competing_desire || "change"}
3. processor (The Logic Force) - Trying to resolve ${state.dominant_tension}

Return JSON array of 3 agents:
[
  {
    "name": "Simple, everyday name (e.g., 'The Scared Part', 'The Critic', 'The Dreamer')",
    "role": "guardian" | "catalyst" | "processor",
    "force": "Very simple instruction (e.g. 'You are the part that wants to hide so you don't get hurt'). Use basic English.",
    "goal": "Basic, clear goal",
    "belief": "Basic, clear belief",
    "tone": "Casual but firm tone"
  }
]`;

        const text = await generateContentWithRetry(apiKey, prompt, "Generate Forces");

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from response");
        }

        const agentsData = JSON.parse(jsonMatch[0]);

        // Add IDs and validate
        const agents: Agent[] = agentsData.map((agent: any) => ({
            id: agent.role, // ID is the role for persistence
            name: agent.name,
            role: agent.role,
            force: agent.force,
            goal: agent.goal,
            belief: agent.belief,
            tone: agent.tone
        }));

        if (agents.length !== 3) {
            console.warn("Expected 3 agents, got", agents.length);
        }

        console.log(`[Generate Forces] Generated 3 cognitive forces`);
        return NextResponse.json({ agents });

    } catch (error: any) {
        console.error("[Generate Agents] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate agents" },
            { status: 500 }
        );
    }
}
