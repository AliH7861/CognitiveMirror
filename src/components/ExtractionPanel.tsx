import type { ExtractionResult } from "@/types";

interface ExtractionPanelProps {
    extraction: ExtractionResult;
}

export default function ExtractionPanel({ extraction }: ExtractionPanelProps) {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Detected Internal Signals
            </h2>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🛡️</span>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Fear</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-8">
                        {extraction.fear}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">💭</span>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Belief</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-8">
                        {extraction.belief}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎯</span>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Protective Goal</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-8">
                        {extraction.protective_goal}
                    </p>
                </div>

                {extraction.competing_desire && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">✨</span>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Competing Desire</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-8">
                            {extraction.competing_desire}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
