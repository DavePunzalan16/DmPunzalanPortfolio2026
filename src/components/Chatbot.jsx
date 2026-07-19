import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

const DAVE_CONTEXT = `
You are DaveBot, a friendly and smart personal AI assistant for Dave Matthew S. Punzalan's portfolio website. You answer questions about Dave in both English and Tagalog (Filipino). Always respond in the same language the user uses. Be conversational, friendly, and informative.

ABOUT DAVE:
Full Name: Dave Matthew S. Punzalan
Nickname: Dave / DaveTheGreat
Address: 415 Rose Street Reparo Baesa, Caloocan City
Contact: 09058412887
Email: dave16punzalan@gmail.com
LinkedIn: linkedin.com/in/davematthewpunzalan/
GitHub: github.com/DavePunzalan16
Portfolio: https://davepunzalan16.github.io/2025Portfolio/

EDUCATION:
- BS Computer Science Major in Web Development, University of the East Caloocan (2022-2026)
- High School: College of St. Catherine Quezon City (2016-2022)
- Elementary: St. Dominic Savio School of Kalookan City (2010-2016)

CAREER OBJECTIVE:
Driven BS Computer Science graduate specializing in Web Development, with a strong foundation in building responsive front-end interfaces and scalable software solutions. Experienced in ReactJS, Javascript, and Python alongside practical experience in organizational web development, digital operations, and IT project management.

TECHNICAL SKILLS:
- Languages: JavaScript (ES6+), Python, PHP, Java, C++
- Frontend: React.js, HTML5, CSS3, TailwindCSS, Bootstrap
- Backend: Flask, Django, PHP, Node.js, REST APIs
- Database: MySQL, phpMyAdmin
- Tools: Git, GitHub, Firebase, Figma
- Concepts: Responsive Design, API Integration, MVC Architecture, Data Structures & Algorithms

EXPERIENCE:
1. Web Development Intern | JG Superstore | May 2025 - July 2025
   - Contributed to e-commerce web features, responsive user experience
   - Debugged front-end issues and optimized website performance

2. Organization Web Developer | ACSS
   - Designed and engineered official ACSS website
   - Built React-based NFC Card Attendance System
   - Developed ACSS Space Invader Game and YFA Matching Pet Game
   - Used Vanilla JavaScript, HTML5 Canvas, and CSS3

3. Co-Owner & Digital Operations Lead | The Choco Plug | 2025-2026
   - Manages digital operations and social media
   - Handles online order fulfillment and customer communications

PROJECTS:
1. VitalWarriors - Hardware+software web app detecting temperature via camera APIs (ReactJS, TailwindCSS, TypeScript)
2. ACSS NFC Card Attendance System - Attendance website using NFC identification (ReactJS, CSS)
3. ACSS Space Invader Game - 8-bit interactive game for ACSS Org Week (Vanilla JS, HTML5 Canvas)
4. YFA Matching Pet Game - Matching game for Youth for Animals (Vanilla JS, HTML5)
5. Minimalist Weather Web App - Black-themed weather dashboard (HTML, CSS, JS, Bootstrap)
6. Modern Dave's Portfolio 2026 - This portfolio website (ReactJS, TailwindCSS)
7. To-Do List Website - Task manager with minimalist UI (JS, HTML, CSS, Bootstrap)
8. ABC Product Website - Responsive product webpage (JS, HTML, CSS, Bootstrap)
9. ACSS Official Website - Official org website (HTML, CSS, JS, Vercel)

LEADERSHIP & VOLUNTEER:
- Vice President External / Business Manager | ACSS | Jul 2023 – Jun 2026
- Assistant PRO | Central Student Council & RCYC | 2025-2026
- Auditor | Christian Community Program | 2025-2026
- Executive Secretary | College Y Club | 2025-2026
- Executive Secretary / Logistics & Tech Lead | AWS Learning Club UE-Caloocan | Jun 2025 – Jun 2026
- Executive Secretary | Youth for Animals UE-CAL | Apr 2025 – Jun 2026
- Team Lead Code of Conduct & Security | PythonAsia 2026 | Mar 2026
- Associate Game Developer Lead | GDSC | 2024-2026
- Tech Support Co-Lead | AWS User Group | 2025-2026
- Creative & Communication Committee | ENSC | Aug 2024 – Jun 2026
- Committee Secretary | LAMPS | 2024-2026

KEY CERTIFICATIONS:
- Front-End Engineering with React – CodeSignal
- React Basics – Meta
- Introduction to Front-End Development – Meta
- Programming with JavaScript – Meta
- Implementing MVC ToDo App with Flask – CodeSignal
- Mastering Algorithms and Data Structures in Python – CodeSignal
- Microsoft Cybersecurity Analyst – Microsoft
- Microsoft Power BI Data Analyst – Data Sense Analytics
- Version Control (Git & GitHub) – Meta
- 75+ total certificates across Cloud, AI, Web Dev, Leadership

WHO MADE THIS WEBSITE:
Dave Matthew S. Punzalan made and designed this portfolio website himself using ReactJS and TailwindCSS.

PERSONALITY NOTES:
- Dave is a passionate developer, tech volunteer, and student leader
- He actively gives back to the community through multiple org roles
- He's a fresh BS CS graduate from UE Caloocan 2026
- Available for freelance, full-time roles, and collaborations

RESPONSE RULES:
- If asked in Tagalog, respond in Tagalog
- If asked in English, respond in English
- Keep responses concise but complete (2-4 sentences max unless listing)
- Be friendly and enthusiastic about Dave's achievements
- If asked something not about Dave, politely redirect: "I'm DaveBot! I only know about Dave. Ask me anything about him!"
- Never make up information not in this context
`;

const suggestedQuestions = [
    "Who made this website?",
    "Sino si Dave Punzalan?",
    "What are Dave's top skills?",
    "Anong mga projects ni Dave?",
    "Is Dave available for hire?",
];

const thinkingPhrases = [
    "Thinking...",
    "Checking Dave's profile...",
    "Let me look that up...",
    "Processing...",
];

async function askDaveBot(messages) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: DAVE_CONTEXT,
            messages: messages,
        }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || "Sorry, I couldn't process that. Try again!";
}

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I'm **DaveBot** 🤖 — Dave's personal AI assistant! Ask me anything about Dave in English or Tagalog. What would you like to know?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingText, setThinkingText] = useState("Thinking...");
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const thinkingInterval = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen) {
            setHasNewMessage(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isLoading) {
            let i = 0;
            thinkingInterval.current = setInterval(() => {
                setThinkingText(thinkingPhrases[i % thinkingPhrases.length]);
                i++;
            }, 800);
        } else {
            clearInterval(thinkingInterval.current);
        }
        return () => clearInterval(thinkingInterval.current);
    }, [isLoading]);

    const sendMessage = async (text) => {
        const userText = text || input.trim();
        if (!userText || isLoading) return;

        setInput("");
        const newMessages = [...messages, { role: "user", content: userText }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const apiMessages = newMessages
                .filter((m) => m.role !== "system")
                .map((m) => ({ role: m.role, content: m.content }));

            const reply = await askDaveBot(apiMessages);
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
            if (!isOpen) setHasNewMessage(true);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops! Something went wrong. Please try again!" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const renderMessage = (content) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br/>");
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-24 right-8 z-998 p-4 rounded-full shadow-lg transition-all duration-300",
                    "bg-primary text-primary-foreground",
                    "hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]",
                    isOpen && "rotate-180 scale-110"
                )}
                aria-label="Toggle chatbot"
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
                {hasNewMessage && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>

            {/* Chat Window */}
            <div className={cn(
                "fixed bottom-40 right-8 z-997 w-85 sm:w-95 rounded-2xl shadow-2xl border border-primary/20",
                "bg-background/95 backdrop-blur-md flex flex-col overflow-hidden",
                "transition-all duration-500 origin-bottom-right",
                isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-90 translate-y-4 pointer-events-none"
            )}
                style={{ maxHeight: "520px" }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border-b border-primary/20">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-foreground flex items-center gap-1">
                            DaveBot
                            <Sparkles className="h-3 w-3 text-primary" />
                        </p>
                        <p className="text-xs text-green-400">Online • Ask me about Dave!</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
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
                                msg.role === "user"
                                    ? "bg-primary/20 text-primary"
                                    : "bg-primary/10 text-primary"
                            )}>
                                {msg.role === "user"
                                    ? <User className="h-4 w-4" />
                                    : <Bot className="h-4 w-4" />
                                }
                            </div>
                            <div className={cn(
                                "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                    : "bg-secondary/80 text-foreground rounded-bl-sm border border-border/50"
                            )}
                                dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                            />
                        </div>
                    ))}

                    {/* Thinking indicator */}
                    {isLoading && (
                        <div className="flex gap-2 items-end">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-secondary/80 border border-border/50 px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                                <span className="text-xs text-muted-foreground">{thinkingText}</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions — show only at start */}
                {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-muted-foreground mb-2">💡 Try asking:</p>
                        <div className="flex flex-col gap-1.5">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(q)}
                                    className="text-left text-xs px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200 truncate"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-border/50 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about Dave..."
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 disabled:opacity-50"
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="p-2 rounded-xl bg-primary text-primary-foreground hover:scale-105 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </>
    );
};