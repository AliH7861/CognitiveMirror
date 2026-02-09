import React from "react";
import {
    Target,
    Radio,
    Shield,
    AlertTriangle,
    ArrowRight,
    Wind
} from "lucide-react";

export type ReflectionData = {
    activation_level: "low" | "medium" | "high";
    stage1_intent: {
        goal: string;
        context_bullets: string[];
    };
    stage2_signals: {
        signals: string[];
    };
    stage3_protective_patterns: {
        patterns: string[];
        protecting: string;
    };
    stage4_friction_map: {
        frictions: string[];
    };
    stage5_forward_vector: {
        core_tension: string;
        balanced_interpretation: string[];
        next_step: string;
        micro_regulation_step?: string | null;
    };
};

export function StageCards({ data }: { data: ReflectionData }) {
    return (
        <div className="flex flex-col gap-4 w-full my-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stage 1: Intent */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold">
                    <Target className="w-5 h-5" />
                    <h3>Stage 1: Intent & Context</h3>
                </div>
                <div className="space-y-2">
                    <p className="font-medium text-gray-800">{data.stage1_intent.goal}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {data.stage1_intent.context_bullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Stage 2: Signals */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-amber-700 font-semibold">
                    <Radio className="w-5 h-5" />
                    <h3>Stage 2: Cognitive Signals</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {data.stage2_signals.signals.map((signal, i) => (
                        <li key={i}>{signal}</li>
                    ))}
                </ul>
            </div>

            {/* Stage 3: Protective Patterns */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-rose-700 font-semibold">
                    <Shield className="w-5 h-5" />
                    <h3>Stage 3: Protective Hypothesis</h3>
                </div>
                <div className="space-y-3">
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {data.stage3_protective_patterns.patterns.map((pattern, i) => (
                            <li key={i}>{pattern}</li>
                        ))}
                    </ul>
                    <div className="text-xs bg-rose-100/50 p-2 rounded-lg text-rose-800">
                        <strong>Trying to protect:</strong> {data.stage3_protective_patterns.protecting}
                    </div>
                </div>
            </div>

            {/* Stage 4: Friction Map */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-orange-700 font-semibold">
                    <AlertTriangle className="w-5 h-5" />
                    <h3>Stage 4: Friction Map</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {data.stage4_friction_map.frictions.map((friction, i) => (
                        <li key={i}>{friction}</li>
                    ))}
                </ul>
            </div>

            {/* Stage 5: Grounded Forward Vector */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm ring-1 ring-emerald-200">
                <div className="flex items-center gap-2 mb-3 text-emerald-800 font-semibold">
                    <ArrowRight className="w-5 h-5" />
                    <h3>Stage 5: Grounded Forward Vector</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Core Tension</span>
                        <p className="text-sm text-gray-800">{data.stage5_forward_vector.core_tension}</p>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Balanced View</span>
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                            {data.stage5_forward_vector.balanced_interpretation.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Next Step</span>
                        <p className="font-semibold text-emerald-900 mt-1">{data.stage5_forward_vector.next_step}</p>
                    </div>

                    {data.stage5_forward_vector.micro_regulation_step && (
                        <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg text-blue-800 text-sm">
                            <Wind className="w-4 h-4 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-bold">Regulation Micro-step:</span>
                                <span className="ml-1">{data.stage5_forward_vector.micro_regulation_step}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
