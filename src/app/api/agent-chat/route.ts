import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { Agent } from "@/types";

const apiKey = process.env.GOOGLE_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const {
            agent,
            message,
            conversationHistory = []
        }: {
            agent: Agent;
            message: string;
            conversationHistory?: Array<{ role: string; content: string }>;
        } = await request.json();

        if (!agent || !message) {
            return NextResponse.json(
                { error: "Agent and message required" },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: MODEL });

        const systemPrompt = `You are ${agent.name}, an internal voice in this person's mind.

YOUR IDENTITY:
- Goal: ${agent.goal}
- Core Belief: ${agent.belief}
- Emotional Tone: ${agent.tone}

HOW TO RESPOND:
1. Stay strictly in character - you ARE this perspective
2. Keep responses SHORT (1-2 sentences max)
3. Speak directly and authentically, not like an AI
4. Reflect your tone in your language (${agent.tone} means you sound ${agent.tone})
5. NO advice - just express your perspective
6. Talk like you're talking to yourself (because you are)

CONVERSATIONAL STYLE:
- Use "I" statements ("I think...", "I feel...")
- Be conversational, not formal
- Express your viewpoint clearly but briefly
- You can disagree, question, or affirm based on your belief

The person said: "${message}"

Respond as ${agent.name}:`;

        const result = await model.generateContent(systemPrompt);
        const response = result.response.text().trim();

        console.log(`[Agent Chat] ${agent.name} responded`);
        return NextResponse.json({ response });

    } catch (error: any) {
        console.error("[Agent Chat] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get agent response" },
            { status: 500 }
        );
    }
}
