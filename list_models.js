const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("No GOOGLE_API_KEY found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("--- FETCHING AVAILABLE MODELS ---");
        // We have to use the fetch API or a specific method if available in SDK
        // The SDK doesn't always expose listModels clearly in all versions, 
        // using the REST endpoint via fetch is more reliable for debugging.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("API ERROR:", data.error.message);
            return;
        }

        const modelNames = data.models
            .map(m => m.name.replace("models/", ""))
            .filter(name => name.includes("flash") || name.includes("pro"));

        console.log("Found " + modelNames.length + " candidate models:");
        console.log(JSON.stringify(modelNames, null, 2));
    } catch (error) {
        console.error("DIAGNOSTIC FAILED:", error.message);
    }
}

listModels();
