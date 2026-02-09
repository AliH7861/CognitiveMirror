// Shared types for Cognitive Mirror multi-agent system

export interface CognitiveState {
    // The "Soul" of the user's current problem
    core_fear: string;          // e.g., "Abandonment if I fail"
    dominant_tension: string;   // e.g., "Safety vs. Growth"
    emotional_trend: "stable" | "challenged" | "evolving" | "new";

    // The "Narrative" (What they tell themselves)
    distortions: string[];      // e.g., ["Catastrophizing", "Black-and-white thinking"]

    // The "Engine" (Intensity)
    intensity: number;          // 1-10
}

export interface ExtractionResult {
    // We keep the old fields for backward compatibility/display, 
    // but the engine runs on CognitiveState
    fear: string;
    belief: string;
    protective_goal: string;
    competing_desire: string | null;

    // New Engine Field
    cognitive_state: CognitiveState;

    confidence?: "high" | "medium" | "low";
}

export interface Agent {
    id: string;
    name: string;
    role: "guardian" | "catalyst" | "processor"; // Archetype
    force: string; // "Cognitive pressure toward caution" - The instruction for the LLM
    goal: string;   // Display goal
    belief: string; // Display belief
    tone: string;
}

export interface DialogueTurn {
    agent_id: string;
    agent_name: string;
    message: string;
}

export interface SynthesisResult {
    synthesis: string;
}
