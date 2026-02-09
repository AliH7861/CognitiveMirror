import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateContentWithRetry(
    apiKey: string,
    prompt: string,
    context: string = "API"
) {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError;

    // 1. Try Primary Model with Retries (for Rate Limits)
    try {
        // Prioritize the environment variable, else default to 2.0 Flash
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const model = genAI.getGenerativeModel({ model: modelName });
        return await attemptGeneration(model, prompt);
    } catch (error: any) {
        console.warn(`[${context}] Primary model failed: ${error.message}`);
        lastError = error;
    }

    // 2. If Primary failed (404 or persistent 429), try Fallbacks
    for (const modelName of MODELS) {
        if (modelName === (process.env.GEMINI_MODEL || "gemini-2.0-flash-exp")) continue;

        try {
            console.log(`[${context}] Trying fallback model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            return await attemptGeneration(model, prompt);
        } catch (error: any) {
            console.warn(`[${context}] Fallback ${modelName} failed: ${error.message}`);
            lastError = error;
        }
    }

    throw lastError;
}

async function attemptGeneration(model: any, prompt: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error: any) {
            // If Rate Limit (429), wait and retry
            if (error.message?.includes('429') || error.status === 429) {
                if (i === retries - 1) throw error; // No more retries

                const waitTime = 2000 * (i + 1); // 2s, 4s, 6s
                console.log(`[Rate Limit] Waiting ${waitTime}ms before retry...`);
                await delay(waitTime);
                continue;
            }

            // If 404 (Model Not Found), throw immediately to try next model
            if (error.message?.includes('404') || error.status === 404) {
                throw error;
            }

            throw error; // Other errors
        }
    }
}
