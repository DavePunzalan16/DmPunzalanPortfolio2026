import { Briefcase, Headphones, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Work experience — newest first.
const experiences = [
    {
        role: "Freelance Full-Stack Developer (Self-Employed)",
        org: "TLTXTRA.Labs",
        period: "2026 – Present",
        icon: Code2,
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/30",
        points: [
            "Work as an independent full-stack developer.",
            "Self-employed, building and delivering projects for clients.",
        ],
    },
    {
        role: "TSR (Telephone Sales Representative)",
        org: "Harte Hanks",
        period: "2026 – Present",
        icon: Headphones,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/30",
        points: [
            "Project-Based TSR position on the NBA Season 2026 Project.",
            "Work night-shift hours as part of the project.",
        ],
    },
    {
        role: "Web Development Intern",
        org: "JG Superstore",
        period: "May 2025 – July 2025",
        icon: Briefcase,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/30",
        points: [
            "Edited and improved responsive web pages on Shopify.",
            "Added details and updated web documentation.",
        ],
    },
];

export const ExperienceSection = () => {
    return (
        <section id="experience" className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 relative">
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                        Work <span className="text-primary">Experience</span>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Hands-on roles across freelance development, project-based work, and internships.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative border-l border-border/60 ml-3 sm:ml-4 space-y-6 sm:space-y-8">
                    {experiences.map((exp, index) => {
                        const Icon = exp.icon;
                        return (
                            <div key={index} className="relative pl-6 sm:pl-8">
                                {/* Timeline dot */}
                                <span
                                    className={cn(
                                        "absolute -left-[9px] sm:-left-[11px] top-5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center",
                                        exp.bg,
                                        exp.border,
                                        exp.color
                                    )}
                                    aria-hidden="true"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                </span>

                                <div className="gradient-border p-4 sm:p-6 card-hover">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className={cn("p-2.5 sm:p-3 rounded-full shrink-0", exp.bg)}>
                                            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", exp.color)} aria-hidden="true" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <h3 className="font-semibold text-sm sm:text-base leading-snug">
                                                {exp.role}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-primary mt-0.5">{exp.org}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{exp.period}</p>

                                            <ul className="mt-3 space-y-1.5">
                                                {exp.points.map((p, i) => (
                                                    <li
                                                        key={i}
                                                        className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex gap-2"
                                                    >
                                                        <span className="text-primary mt-0.5 shrink-0">•</span>
                                                        <span>{p}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
