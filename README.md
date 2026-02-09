# Cognitive Mirror

A hackathon-fast "Smart Chat" decision-clarity tool that implements a 5-stage reasoning architecture using Gemini 3.

## Features
- **Chat Interface**: Natural language input with inferred activation level.
- **5-Stage Reasoning**: Structured analysis of intent, signals, protective patterns, friction, and forward vectors.
- **Cognitive Architecture**: No hidden chain-of-thought. Pure structured output.
- **Micro-Regulation**: Auto-suggests regulation steps if high intensity is detected.

## Setup & Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    - Create a `.env.local` file in the root directory.
    - Add your Google Gemini API Key:
      ```env
      GOOGLE_API_KEY=your_api_key_here
      ```
    - *Note: This app uses `gemini-2.0-flash` (or 1.5 fallback). Ensure your key has access.*

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

The app uses a single API route (`/api/reflect`) that:
1.  Receives the user message.
2.  Infers `activation_level` (low/medium/high) via the LLM.
3.  Generates a strict JSON object with 5 stages of analysis.
4.  Returns the structured data to the frontend for visualization.

### The 5 Stages
1.  **Intent & Goal**: Clarifies what you actually want.
2.  **Cognitive Signals**: Detects underlying fears or needs.
3.  **Protective Patterns**: Hypothesizes what your mind is trying to protect.
4.  **Friction Map**: Shows how the protection is blocking the goal.
5.  **Forward Vector**: A grounded next step + regulation if needed.
