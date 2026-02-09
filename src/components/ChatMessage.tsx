interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${isUser
                    ? "bg-slate-700 dark:bg-slate-800 text-white ml-12"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 mr-12 border border-slate-200 dark:border-slate-700"
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
}
