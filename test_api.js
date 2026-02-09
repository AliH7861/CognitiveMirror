const { GoogleGenerativeAI } = require("@google/generative-ai");

// Using the key found in your .env.local / hardcoded edit
const API_KEY = "AIzaSyBrw80Ee7VhdcSW8AOyLEVrUUW_YsxQyV8";
const genAI = new GoogleGenerativeAI(API_KEY);

const testInputs = [
    "Hello, are you working?",
    "Tell me a 3-word story about a cat.",
    "What is 2+2?"
];

async function runTests() {
    console.log("--- STARTING GEMINI API KEY TEST ---");
    console.log("Using Key: " + API_KEY.substring(0, 10) + "...");

    for (const input of testInputs) {
        console.log(`\nTesting Input: "${input}"`);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(input);
            const response = await result.response;
            const text = response.text();
            console.log("RESULT: " + text.trim());
        } catch (error) {
            console.error("FAILED for input: " + input);
            console.error("ERROR DETAIL: " + error.message);
            if (error.message.includes("API key not found") || error.message.includes("API_KEY_INVALID")) {
                console.log("CRITICAL: THE API KEY IS DEFINITELY INVALID OR EXPIRED.");
            }
        }
    }
    console.log("\n--- TEST COMPLETE ---");
}

runTests();
