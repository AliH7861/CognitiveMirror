"use client";

import { useState, useRef, useEffect } from "react";
import type { ExtractionResult, Agent, DialogueTurn } from "@/types";
import ChatMessage from "@/components/ChatMessage";
import LiveSidebar from "@/components/LiveSidebar";
import DialogueView from "@/components/DialogueView";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Describe a thought, tension, or decision. Cognitive signals will be interpreted in real time.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [extraction, setExtraction] = useState<Partial<ExtractionResult>>({});
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationPhase, setConversationPhase] = useState<"initial" | "extracting" | "extracted" | "dialogue">("initial");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (conversationPhase === "initial") {
        // Initial extraction
        const extractRes = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thought: input }),
        });

        if (!extractRes.ok) throw new Error("Extraction failed");

        const extractionData: ExtractionResult = await extractRes.json();
        setExtraction(extractionData);
        setConversationPhase("extracted");

        // Generate agents
        const agentsRes = await fetch("/api/generate-agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ extraction: extractionData }),
        });

        if (!agentsRes.ok) throw new Error("Agent generation failed");

        const agentsData = await agentsRes.json();
        setAgents(agentsData.agents);

        // AI response
        const aiMessage: Message = {
          role: "assistant",
          content: `Signals detected. ${agentsData.agents.length} internal perspectives identified.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else if (conversationPhase === "dialogue" || conversationPhase === "extracted") {
        // Conversational Phase - Call /api/chat
        // We pass the current context to the chat endpoint

        let contextBody: any = {
          message: input,
          // We need to pass the state if available, but extraction might be Partial
          cognitive_state: (extraction as ExtractionResult)?.cognitive_state,
          agents: agents,
          // Find the last synthesis if it exists
          previous_synthesis: messages.slice().reverse().find(m => m.role === "assistant" && !m.content.includes("Signals detected"))?.content
        };

        const chatRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contextBody),
        });

        if (!chatRes.ok) throw new Error("Chat response failed");

        const chatData = await chatRes.json();

        const aiMessage: Message = {
          role: "assistant",
          content: chatData.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Default / Fallback
        const aiMessage: Message = {
          role: "assistant",
          content: "What would you like to explore?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDialogue = async () => {
    if (agents.length === 0 || !extraction.fear) return;

    setIsLoading(true);
    setConversationPhase("dialogue");

    try {
      // Generate dialogue
      const dialogueRes = await fetch("/api/agent-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agents,
          extraction: extraction as ExtractionResult,
          turns: 3
        }),
      });

      if (!dialogueRes.ok) throw new Error("Dialogue generation failed");

      const dialogueData = await dialogueRes.json();
      setDialogue(dialogueData.dialogue);

      // Synthesize
      const synthesisRes = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialogue: dialogueData.dialogue,
          extraction: extraction as ExtractionResult
        }),
      });

      if (!synthesisRes.ok) throw new Error("Synthesis failed");

      const synthesisData = await synthesisRes.json();

      // Add synthesis as AI message (shorter)
      const synthesisMessage: Message = {
        role: "assistant",
        content: synthesisData.synthesis,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, synthesisMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Cognitive Mirror
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reflective AI for introspection · Not medical advice
          </p>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-1"
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-xs text-slate-500">Processing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share a thought..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium px-5 py-2.5 rounded-lg transition-all disabled:cursor-not-allowed text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Live Sidebar */}
      <div className="w-[400px] flex flex-col relative">
        <LiveSidebar
          extraction={extraction}
          agents={agents}
          onStartDialogue={handleStartDialogue}
          dialogueActive={dialogue.length > 0}
        />

        {dialogue.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 max-h-[40%] overflow-y-auto">
            <DialogueView dialogue={dialogue} />
          </div>
        )}
      </div>
    </div>
  );
}
