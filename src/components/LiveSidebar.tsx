import type { ExtractionResult, Agent } from "@/types";
import AgentCard from "./AgentCard";

interface LiveSidebarProps {
    extraction: Partial<ExtractionResult>;
    agents: Agent[];
    onStartDialogue: () => void;
    onAgentClick?: (agent: Agent) => void;
    activeAgent?: Agent | null;
    dialogueActive: boolean;
}

export default function LiveSidebar({
    extraction,
    agents,
    onStartDialogue,
    onAgentClick,
    activeAgent,
    dialogueActive
}: LiveSidebarProps) {
    const hasExtraction = Object.keys(extraction).length > 0;
    const hasAgents = agents.length > 0;

    return (
        <div className="w-full h-full bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Belief Status
                        </h2>
                        {extraction.cognitive_state?.emotional_trend && (
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${extraction.cognitive_state.emotional_trend === 'evolving' || extraction.cognitive_state.emotional_trend === 'new'
                                ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 animate-pulse'
                                : extraction.cognitive_state.emotional_trend === 'stable'
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
                                    : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
                                }`}>
                                {extraction.cognitive_state.emotional_trend === 'evolving' ? 'Evolving' :
                                    extraction.cognitive_state.emotional_trend === 'new' ? 'Discovery' :
                                        extraction.cognitive_state.emotional_trend === 'stable' ? 'Stable' : 'Challenged'}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activeAgent ? `Talking to ${activeAgent.name}` : "Real-time signal detection"}
                    </p>
                </div>

                {/* Cognitive Signals - Collapsed when talking to agent */}
                {hasExtraction && !activeAgent && (
                    <div className="space-y-3">
                        {extraction.fear && (
                            <div className="animate-fade-in">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    FEAR
                                </p>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {extraction.fear}
                                </p>
                            </div>
                        )}

                        {extraction.belief && (
                            <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    BELIEF
                                </p>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {extraction.belief}
                                </p>
                            </div>
                        )}

                        {extraction.protective_goal && (
                            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    PROTECTIVE GOAL
                                </p>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {extraction.protective_goal}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Agents Section */}
                {hasAgents && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                            Parts of You
                        </h3>
                        <div className="space-y-2">
                            {agents.map((agent, index) => (
                                <div
                                    key={agent.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <AgentCard
                                        agent={agent}
                                        onClick={onAgentClick}
                                        isActive={activeAgent?.id === agent.id}
                                    />
                                </div>
                            ))}
                        </div>

                        {!dialogueActive && !activeAgent && (
                            <button
                                onClick={onStartDialogue}
                                className="w-full mt-4 bg-slate-700 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg text-xs transition-all"
                            >
                                Initiate Internal Dialogue
                            </button>
                        )}

                        {activeAgent && (
                            <button
                                onClick={() => onAgentClick?.(null as any)}
                                className="w-full mt-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-2 px-4 rounded-lg text-xs transition-all"
                            >
                                ← Back
                            </button>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!hasExtraction && !hasAgents && (
                    <div className="text-center py-12">
                        <p className="text-slate-400 dark:text-slate-600 text-xs">
                            Share a thought to begin
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
