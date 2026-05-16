import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

const roles = [
    "Full Stack Developer",
    "React Specialist",
    "UI/UX Enthusiast",
    "Tech Volunteer",
    "Software Engineer",
];

export const HeroSection = () => {
    const [currentRole, setCurrentRole] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);

    // Typewriter effect
    useEffect(() => {
        const role = roles[currentRole];
        let timeout;

        if (typing) {
            if (displayed.length < role.length) {
                timeout = setTimeout(() => {
                    setDisplayed(role.slice(0, displayed.length + 1));
                }, 80);
            } else {
                timeout = setTimeout(() => setTyping(false), 1800);
            }
        } else {
            if (displayed.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayed(displayed.slice(0, -1));
                }, 40);
            } else {
                setCurrentRole((prev) => (prev + 1) % roles.length);
                setTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayed, typing, currentRole]);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20"
        >
            <div className="container max-w-5xl mx-auto z-10">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

                    <div className="flex-1 text-center lg:text-left space-y-6">

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium opacity-0 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Available for opportunities
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg text-muted-foreground opacity-0 animate-fade-in">
                                Hi there 👋, I'm
                            </p>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight opacity-0 animate-fade-in-delay-1">
                                Dave{" "}
                                <span className="text-primary text-glow">
                                    Punzalan
                                </span>
                            </h1>
                        </div>
                        <div className="h-10 flex items-center justify-center lg:justify-start opacity-0 animate-fade-in-delay-2">
                            <span className="text-xl sm:text-2xl font-semibold text-foreground/80">
                                {displayed}
                                <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse" />
                            </span>
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in-delay-3 leading-relaxed">
                            BS Computer Science graduate from UE Caloocan specializing in
                            Web Development. I build fast, accessible, and visually
                            stunning web apps using React, Node.js, and modern tech.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 opacity-0 animate-fade-in-delay-3">
                            {[
                                { value: "10+", label: "Projects Built" },
                                { value: "11+", label: "Org Roles" },
                                { value: "3+", label: "Years Active" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2 opacity-0 animate-fade-in-delay-4">
                            <a href="#projects" className="cosmic-button">
                                View My Work
                            </a>
                            <a
                                href="#contact"
                                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 font-medium"
                            >
                                Contact Me
                            </a>
                        </div>

                        <div className="flex gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-delay-4">
                            <a
                                href="https://github.com/DavePunzalan16"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground/70 transition-all duration-300 hover:scale-110"
                                aria-label="GitHub"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/davematthewpunzalan/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground/70 transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:dave16punzalan@gmail.com"
                                className="p-2 rounded-full bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground/70 transition-all duration-300 hover:scale-110"
                                aria-label="Email"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="shrink-0 opacity-0 animate-fade-in-delay-2">
                        <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-4 rounded-full bg-primary/10 blur-xl" />
                            <div className="absolute inset-0 rounded-full animate-[spin_8s_linear_infinite]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                            </div>
                            <div className="absolute inset-0 rounded-full animate-[spin_12s_linear_infinite_reverse]">
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                            </div>
                            <div className="absolute inset-3 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                <img
                                    src="assets/DavePFP.jpg"
                                    alt="Dave Punzalan"
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "flex";
                                    }}
                                />
                                <div
                                    style={{ display: "none" }}
                                    className="w-full h-full bg-primary/20 items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/50">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
                <span className="text-xs text-primary font-medium tracking-widest uppercase">Scroll</span>
                <ArrowDown className="h-4 w-4 text-primary" />
            </div>
        </section>
    );
};