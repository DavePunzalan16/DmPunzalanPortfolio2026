import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { getResponse, suggestedQuestions } from "@/data/davebot-data";

const renderMessage = (content) => {
    return content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br/>");
};

export const Chatbot = () => {
    const [isOpen, setIsOpenState] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I'm **DaveBot** 🤖 — Dave's portfolio assistant. Ask me about his skills, projects, AWS experience, community involvement, or how to get in touch. I only answer with what's in his portfolio.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Open/close handler owns the "seen" side effect so we don't call
    // setState synchronously inside an effect (avoids cascading renders).
    const setIsOpen = (next) => {
        const open = typeof next === "function" ? next(isOpen) : next;
        setIsOpenState(open);
        if (open) setHasNewMessage(false);
    };

    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => inputRef.current?.focus(), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    const sendMessage = (text) => {
        const userText = (text || input).trim();
        if (!userText || isTyping) return;

        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userText }]);
        setIsTyping(true);

        // Fixed, natural-feeling typing delay (kept deterministic to stay pure).
        const delay = 800;
        setTimeout(() => {
            const reply = getResponse(userText);
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
            setIsTyping(false);
            if (!isOpen) setHasNewMessage(true);
        }, delay);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
                className={cn(
                    "fixed right-4 sm:right-6 z-[998] p-4 rounded-full shadow-lg transition-all duration-300",
                    "bg-primary text-primary-foreground",
                    "hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]",
                    isOpen ? "rotate-90 scale-110" : "rotate-0"
                )}
                aria-label="Toggle chatbot"
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
                {hasNewMessage && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-background" />
                )}
            </button>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed right-4 sm:right-6 z-[997] rounded-2xl shadow-2xl border border-primary/20",
                    "bg-background/95 backdrop-blur-md flex flex-col overflow-hidden",
                    "transition-all duration-500 origin-bottom-right",
                    "w-[calc(100vw-2rem)] max-w-sm",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-90 translate-y-4 pointer-events-none"
                )}
                style={{
                    bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
                    maxHeight: "min(70vh, 540px)",
                }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border-b border-primary/20 shrink-0">
                    <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground flex items-center gap-1">
                            DaveBot
                            <Sparkles className="h-3 w-3 text-primary" />
                        </p>
                        <p className="text-xs text-green-400">Online • Ask me about Dave!</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-2 items-end",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                                msg.role === "user" ? "bg-primary/20" : "bg-primary/10"
                            )}>
                                {msg.role === "user"
                                    ? <User className="h-4 w-4 text-primary" />
                                    : <Bot className="h-4 w-4 text-primary" />
                                }
                            </div>
                            <div
                                className={cn(
                                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-secondary/80 text-foreground rounded-bl-sm border border-border/50"
                                )}
                                dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                            />
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex gap-2 items-end">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="bg-secondary/80 border border-border/50 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && !isTyping && (
                    <div className="px-4 pb-3 shrink-0">
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            💡 Try asking:
                        </p>
                        <div className="flex flex-col gap-1.5">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(q)}
                                    className="text-left text-xs px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all duration-200 truncate"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-border/50 flex gap-2 shrink-0">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about Dave..."
                        disabled={isTyping}
                        className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 disabled:opacity-50"
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={isTyping || !input.trim()}
                        className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:scale-105 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </>
    );
};