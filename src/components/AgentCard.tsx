"use client";

import { useState } from "react";
import type { Agent } from "@/types";

const toneColors: Record<string, string> = {
    cautious: "border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10",
    ambitious: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-950/10",
    analytical: "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/10",
    skeptical: "border-rose-200 bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/10",
    optimistic: "border-violet-200 bg-violet-50 dark:border-violet-900/30 dark:bg-violet-950/10",
    protective: "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50",
};

interface AgentCardProps {
    agent: Agent;
    onClick?: (agent: Agent) => void;
    isActive?: boolean;
}

export default function AgentCard({ agent, onClick, isActive = false }: AgentCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const colorClass = toneColors[agent.tone.toLowerCase()] || "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50";

    return (
        <div
            onClick={() => onClick?.(agent)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`rounded-lg p-2.5 border transition-all duration-200 ${colorClass} ${onClick ? "cursor-pointer" : ""
                } ${isActive
                    ? "ring-2 ring-slate-400 shadow-sm"
                    : isHovered ? "shadow-md scale-102" : ""
                }`}
        >
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {agent.name}
                </h3>
                {onClick && (
                    <span className="text-xs text-slate-400">→</span>
                )}
            </div>

            {/* Show full details on hover or when active */}
            <div className={`overflow-hidden transition-all duration-200 ${isHovered || isActive ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="space-y-1.5 pt-1">
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            Goal
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {agent.goal}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            Belief
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {agent.belief}
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary when collapsed */}
            {!isHovered && !isActive && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic">
                    Hover for details
                </p>
            )}
        </div>
    );
}
