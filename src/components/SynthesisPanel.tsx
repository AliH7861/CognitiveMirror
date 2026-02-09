interface SynthesisPanelProps {
    synthesis: string;
}

export default function SynthesisPanel({ synthesis }: SynthesisPanelProps) {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔮</span>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Reflection
                </h2>
            </div>

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {synthesis}
            </p>

            <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    This is a mirror, not a guide. Both perspectives serve important purposes.
                </p>
            </div>
        </div>
    );
}
