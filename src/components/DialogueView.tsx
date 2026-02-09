import type { DialogueTurn } from "@/types";

const avatars = ["🔵", "🟣", "🟢", "🟡", "🔴"];

interface DialogueViewProps {
    dialogue: DialogueTurn[];
}

const getAvatar = (agentId: string) => {
    const index = parseInt(agentId.split("-").pop() || "0", 10);
    return avatars[index % avatars.length];
};

export default function DialogueView({ dialogue }: DialogueViewProps) {
    return (
        <div className="space-y-3">
            {/* Strategic Label */}
            <div className="mb-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Internal Conversation
                </p>
            </div>

            <div className="space-y-3">
                {dialogue.map((turn, index) => (
                    <div
                        key={index}
                        className="flex gap-2 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">
                            {getAvatar(turn.agent_id)}
                        </div>

                        <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                                {turn.agent_name}
                            </p>
                            <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
                                "{turn.message}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
