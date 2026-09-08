import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
    {
        id: 1,
        title: "David Portfolio 2025 Website",
        description: "A personal portfolio website built with HTML/CSS and JavaScript, showcasing my skills, projects, and experience in a visually appealing and responsive design.",
        image: "assets/PROJECT1.png",
        tags: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
        demoUrl: "https://davepunzalan16.github.io/2025Portfolio/",
        githubUrl: "https://github.com/DavePunzalan16/2025Portfolio",
        badge: "Live",
        comingSoon: false,
    },
    {
        id: 2,
        title: "ACSS Space Invader Game",
        description: "A classic space invader game built using HTML5, CSS, and JavaScript with simple controls, engaging gameplay, and retro-style graphics.",
        image: "assets/PROJECT2.jpg",
        tags: ["HTML", "CSS", "Vanilla JS", "Github Actions"],
        demoUrl: "https://acss-space-invader-game.vercel.app/",
        githubUrl: "https://github.com/DavePunzalan16/ACSS-SPACE-INVADER-GAME",
        badge: "Game",
        comingSoon: false,
    },
    {
        id: 3,
        title: "ACSS NFC Attendance System",
        description: "A web-based attendance system that utilizes NFC technology to streamline event check-ins, allowing users to register and track attendance efficiently.",
        image: "assets/PROJECT3.jpg",
        tags: ["ReactJS", "Tailwind CSS", "Typescript", "Netlify"],
        demoUrl: "https://legendary-sable-b03450.netlify.app/",
        githubUrl: "https://github.com/DavePunzalan16/acss-nfc-websiteReact",
        badge: "Live",
        comingSoon: false,
    },
    {
        id: 4,
        title: "YFA Matching Pet Game",
        description: "A fun and interactive pet matching game built with HTML5, CSS, and JavaScript, where players match pairs of adorable pets while enjoying colorful gameplay.",
        image: "assets/PROJECT4.jpg",
        tags: ["HTML", "CSS", "Vanilla JS", "Github Actions"],
        demoUrl: "https://davepunzalan16.github.io/YFA-MATCHING-PET-GAME-2025-PROJECT/game.html",
        githubUrl: "https://github.com/DavePunzalan16/YFA-MATCHING-PET-GAME-2025-PROJECT",
        badge: "Game",
        comingSoon: false,
    },
    {
        id: 5,
        title: "Vital Warriors Website",
        description: "A dynamic website for Vital UE Warriors with hardware integration, predicting UE warriors health by scanning their faces using open camera APIs.",
        image: "assets/PROJECT5.png",
        tags: ["ReactJS", "Supabase", "Typescript", "Netlify"],
        demoUrl: "https://funny-clafoutis-8c4f75.netlify.app/",
        githubUrl: "https://github.com/DavePunzalan16/VitalWarriosPR",
        badge: "Live",
        comingSoon: false,
    },
    {
        id: 6,
        title: "ACSS Official Website",
        description: "Official website for the Association of Computer Science Students (ACSS) at UE, providing information about the organization, events, and student resources.",
        image: "assets/PROJECT6.jpg",
        tags: ["HTML", "CSS", "JavaScript", "Vercel"],
        demoUrl: "https://acssofficialwebsite2526.vercel.app/",
        githubUrl: "https://github.com/DavePunzalan16/ACSSWEBSITE2526",
        badge: "Live",
        comingSoon: false,
    },
    {
        id: 7,
        title: "AI-Powered SEO Website Ranker",
        description: "An AI-powered SEO analysis tool built with Firecrawl and Gemini AI that can rank and audit any website, uncovering hidden issues and optimizing performance to outrank the competition.",
        image: "assets/PROJECT7.jpg",
        tags: ["Firecrawl", "Gemini AI", "Vercel", "JavaScript"],
        demoUrl: "#",
        githubUrl: "https://github.com/DavePunzalan16/WebsiteTracker",
        badge: "AI",
        comingSoon: true,
    },
    {
        id: 8,
        title: "DMP Live Stock Market App",
        description: "A real-time stock market dashboard featuring live stock charts, heatmaps, watchlists, personalized investment goals, country selection, and risk tolerance settings for data-driven investors.",
        image: "assets/PROJECT8.jpg",
        tags: ["ReactJS", "TailwindCSS", "Stock API", "Real-time"],
        demoUrl: "https://github.com/DavePunzalan16/DMPStockMarket",
        githubUrl: "https://github.com/DavePunzalan16/DMPStockMarket",
        badge: "Live",
        comingSoon: false,
    },
    {
        id: 9,
        title: "DMP Full Stack Academy",
        description: "A full-featured Java-powered learning management system for front-end lovers — featuring 50+ courses, coding challenges, video lessons, quizzes, XP system, level-ups, and badge collection.",
        image: "assets/PROJECT9.jpg",
        tags: ["Java", "Full Stack", "LMS", "ReactJS"],
        demoUrl: "#",
        githubUrl: "https://github.com/DavePunzalan16/DMPFullStackAcademyFrontendLearning",
        badge: "Full Stack",
        comingSoon: true,
    },
    {
        id: 10,
        title: "M.A.G.E. — Guild Social Platform",
        description: "A full-stack social media platform for the UE Caloocan Manga, Anime & Game Enthusiasts Guild — featuring 60+ arcade games, musical SFX integration, 2FA security, dynamic theme engine, events, feed, gallery, and officer management.",
        image: "assets/PROJECT10.jpg",
        tags: ["Full Stack", "Social Media", "2FA", "Game Engine"],
        demoUrl: "https://officialmagewebsite.vercel.app/",
        githubUrl: "https://github.com/DavePunzalan16/magewebsite20262027",
        badge: "Featured",
        comingSoon: false,
    },
];

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

const ImageFallback = ({ title }) => (
    <div className="w-full h-full bg-secondary/50 flex flex-col items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <span className="text-xs text-muted-foreground text-center px-4">{title}</span>
    </div>
);

const tagColors = [
    "bg-primary/20 text-primary border-primary/30 hover:bg-primary/40",
    "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/40",
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/40",
    "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/40",
    "bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/40",
];

const badgeStyles = {
    "Live":       { style: "bg-green-500/20 text-green-300 border-green-400/40",   icon: "🟢" },
    "Game":       { style: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40", icon: "🎮" },
    "AI":         { style: "bg-blue-500/20 text-blue-300 border-blue-400/40",       icon: "🤖" },
    "Full Stack": { style: "bg-orange-500/20 text-orange-300 border-orange-400/40", icon: "⚡" },
    "Featured":   { style: "bg-primary/20 text-primary border-primary/40",          icon: "✦" },
};

export const ProjectsSection = () => {
    const [hovered, setHovered] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const INITIAL_COUNT = 6;
    const displayed = showAll ? projects : projects.slice(0, INITIAL_COUNT);

    return (
        <section id="projects" className="py-16 sm:py-20 md:py-24 px-4 relative">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Featured{" "}
                        <span className="text-primary">Projects</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        A collection of projects I've built — from interactive games to AI-powered tools
                        and full-stack platforms, each solving real-world problems with modern tech.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        {[
                            { value: `${projects.length}+`, label: "Projects Built" },
                            { value: "4", label: "Full Stack Apps" },
                            { value: "2", label: "AI Projects" },
                            { value: "10+", label: "Technologies" },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-bold text-primary">{s.value}</div>
                                <div className="text-xs text-muted-foreground">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {displayed.map((project, key) => {
                        const badge = badgeStyles[project.badge];
                        return (
                            <div
                                key={key}
                                onMouseEnter={() => setHovered(key)}
                                onMouseLeave={() => setHovered(null)}
                                className={cn(
                                    "group relative bg-card rounded-2xl overflow-hidden flex flex-col",
                                    "border border-border/50 transition-all duration-500",
                                    hovered === key
                                        ? "shadow-[0_0_30px_rgba(139,92,246,0.2)] border-primary/40 -translate-y-1"
                                        : "shadow-md hover:shadow-lg"
                                )}
                            >
                                {/* Badge */}
                                {badge && (
                                    <div className="absolute top-3 left-3 z-20">
                                        <span className={cn(
                                            "text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm flex items-center gap-1",
                                            badge.style
                                        )}>
                                            {badge.icon} {project.badge}
                                        </span>
                                    </div>
                                )}

                                {/* Coming Soon ribbon */}
                                {project.comingSoon && (
                                    <div className="absolute top-3 right-3 z-20">
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm bg-secondary/80 text-muted-foreground border-border">
                                            🚧 Coming Soon
                                        </span>
                                    </div>
                                )}

                                {/* Image */}
                                <div className="relative h-48 sm:h-44 md:h-48 overflow-hidden bg-secondary/30">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "flex";
                                        }}
                                    />
                                    <div style={{ display: "none" }} className="w-full h-full">
                                        <ImageFallback title={project.title} />
                                    </div>

                                    <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Hover buttons */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        {!project.comingSoon && project.demoUrl !== "#" ? (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:scale-105 transition-transform duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ExternalLink size={14} /> Live Demo
                                            </a>
                                        ) : project.comingSoon ? (
                                            <span className="px-4 py-2 rounded-full bg-secondary/90 text-muted-foreground text-sm font-medium border border-border">
                                                🚧 Coming Soon
                                            </span>
                                        ) : null}

                                        {project.githubUrl !== "#" && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 text-foreground text-sm font-medium border border-border shadow-lg hover:scale-105 transition-transform duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <GithubIcon /> GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={cn(
                                                    "text-xs font-semibold px-3 py-1 rounded-full border transition-colors duration-300",
                                                    tagColors[index % tagColors.length]
                                                )}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-primary transition-colors duration-300">
                                        {project.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                                        {project.description}
                                    </p>

                                    {/* Bottom links */}
                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50 sm:group-hover:opacity-0 transition-opacity duration-300">
                                        {!project.comingSoon && project.demoUrl !== "#" ? (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
                                            >
                                                <ExternalLink size={14} /> Live Demo
                                            </a>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground/50">
                                                🚧 Coming Soon
                                            </span>
                                        )}
                                        {project.githubUrl !== "#" && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
                                            >
                                                <GithubIcon /> GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Ring glow */}
                                <div className={cn(
                                    "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ring-1 ring-primary/0",
                                    hovered === key && "ring-primary/30 ring-1"
                                )} />
                            </div>
                        );
                    })}
                </div>

                {/* Show More / Less */}
                <div className="text-center mt-10">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary hover:bg-primary/10 transition-all duration-300 font-medium hover:scale-105 mb-8"
                    >
                        {showAll ? "Show Less" : `Show All ${projects.length} Projects`}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={cn("transition-transform duration-300", showAll && "rotate-180")}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <p className="text-muted-foreground mb-4">Want to see more of my work?</p>
                    <a
                        href="https://github.com/DavePunzalan16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cosmic-button inline-flex items-center gap-2"
                    >
                        <GithubIcon /> View All on GitHub
                    </a>
                </div>
            </div>
        </section>
    );
};