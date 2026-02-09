import React from "react";

const EXAMPLES = [
    "Networking event anxiety",
    "Procrastinating on an assignment",
    "Overthinking texting someone",
    "Feeling imposter syndrome at work"
];

export function QuickChips({ onSelect }: { onSelect: (text: string) => void }) {
    return (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {EXAMPLES.map((text) => (
                <button
                    key={text}
                    onClick={() => onSelect(text)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-medium transition-colors"
                >
                    {text}
                </button>
            ))}
        </div>
    );
}
