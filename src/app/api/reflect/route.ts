import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_API_KEY;
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const FALLBACK_MODEL = "gemini-flash-latest";

export const runtime = 'nodejs';

const schema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        activation_level: { type: SchemaType.STRING, format: "enum", enum: ["low", "medium", "high"] },
        stage1_intent: {
            type: SchemaType.OBJECT,
            properties: {
                goal: { type: SchemaType.STRING },
                context_bullets: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            },
            required: ["goal", "context_bullets"],
        },
        stage2_signals: {
            type: SchemaType.OBJECT,
            properties: {
                signals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            },
            required: ["signals"],
        },
        stage3_protective_patterns: {
            type: SchemaType.OBJECT,
            properties: {
                patterns: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                protecting: { type: SchemaType.STRING },
            },
            required: ["patterns", "protecting"],
        },
        stage4_friction_map: {
            type: SchemaType.OBJECT,
            properties: {
                frictions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            },
            required: ["frictions"],
        },
        stage5_forward_vector: {
            type: SchemaType.OBJECT,
            properties: {
                core_tension: { type: SchemaType.STRING },
                balanced_interpretation: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                next_step: { type: SchemaType.STRING },
                micro_regulation_step: { type: SchemaType.STRING, nullable: true },
            },
            required: ["core_tension", "balanced_interpretation", "next_step"],
        },
    },
    required: [
        "activation_level",
        "stage1_intent",
        "stage2_signals",
        "stage3_protective_patterns",
        "stage4_friction_map",
        "stage5_forward_vector",
    ],
};

async function generateWithFallback(prompt: string) {
    if (!apiKey) {
        throw new Error("GOOGLE_API_KEY is not defined in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const tryModel = async (modelName: string) => {
        console.log(`[Cognitive Mirror] Attempting Model: ${modelName}`);
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
    };

    try {
        return await tryModel(PRIMARY_MODEL);
    } catch (primaryError: any) {
        console.warn(`[Cognitive Mirror] Primary Model (${PRIMARY_MODEL}) failed: ${primaryError.message}`);

        // Only try fallback if it's different from the primary
        if (PRIMARY_MODEL !== FALLBACK_MODEL) {
            try {
                console.log(`[Cognitive Mirror] Trying Fallback: ${FALLBACK_MODEL}`);
                return await tryModel(FALLBACK_MODEL);
            } catch (fallbackError: any) {
                console.error(`[Cognitive Mirror] Fallback failed: ${fallbackError.message}`);
                throw fallbackError;
            }
        }
        throw primaryError;
    }
}

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const systemPrompt = `
      You are COGNITIVE MIRROR, a high-fidelity decision-support system.
      You are NOT a chatbot. You are a hierarchical reasoning engine.
      
      Your Architecture simulates FIVE specialist modules to analyze the user's thought: "${message}"

      ---
      MODULE 1: INTENT EXTRACTOR
      - Identify the user's forward-moving goal.
      - Contextualize the motivation.

      MODULE 2: COGNITIVE SIGNAL DETECTOR
      - Detect internal emotional/cognitive signals (fear, uncertainty, desire, etc).
      - Return as concise bullets.

      MODULE 3: PROTECTIVE PATTERN MAPPER
      - Identify the specific behavioral pattern trying to protect the user (e.g. "Perfectionist Delay").
      - State WHAT it is protecting them from. (Avoid clinical terms).

      MODULE 4: FRICTION ANALYZER
      - Map exactly how the specific pattern interferes with the specific goal.

      MODULE 5: FORWARD VECTOR GENERATOR
      - Synthesize a grounded forward vector.
      - Core Tension: The central conflict.
      - Balanced Interpretation: A fair view of the situation.
      - Next Step: ONE small, realistic action.
      - Micro-Regulation: IF activation is high, suggest a regulation step (breathing/grounding).

      ---
      OUTPUT RULES:
      1. Infer 'activation_level' (low, medium, high) based on urgency/emotion.
      2. Return ONLY strict JSON matching the provided schema.
      3. Be concise. High clarity. Low verbosity.
    `;

        const jsonText = await generateWithFallback(systemPrompt);
        const data = JSON.parse(jsonText);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate reflection" },
            { status: 500 }
        );
    }
}
