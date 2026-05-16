import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Users, Code, Shield, Megaphone, BookOpen,
    Heart, Cpu, Globe, Star, Award, Briefcase, Zap
} from "lucide-react";

const categories = ["All", "Leadership", "Tech", "Advocacy", "Creative"];

const experiences = [
    {
        role: "Vice President - External / Business Manager",
        org: "Association of Computer Studies Students (ACSS)",
        period: "Jul 2023 – Jun 2026",
        category: "Leadership",
        icon: Star,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/30",
        description:
            "Led external affairs and managed business operations for the largest CS org in the university. Spearheaded sponsorship drives, org partnerships, and served as the chief liaison between ACSS and external stakeholders.",
        skills: ["Leadership", "Business Dev", "Partnerships", "Event Management"],
    },
    {
        role: "Executive Secretary / Logistics & Tech Team Lead",
        org: "AWS Learning Club UE-Caloocan & AWS User Group",
        period: "Jun 2025 – Jun 2026",
        category: "Tech",
        icon: Cpu,
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/30",
        description:
            "Managed club documentation and simultaneously led the logistics and tech team, ensuring smooth execution of cloud computing workshops and AWS-focused learning sessions for students.",
        skills: ["AWS", "Cloud Computing", "Tech Ops", "Documentation"],
    },
    {
        role: "Team Lead - Code of Conduct & Security",
        org: "PythonAsia 2026",
        period: "Mar 2026",
        category: "Tech",
        icon: Shield,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/30",
        description:
            "Served as the Code of Conduct and Security team lead for one of Asia's largest Python conferences, overseeing policy enforcement and ensuring a safe, inclusive environment for all attendees.",
        skills: ["Security", "Policy", "Conference Ops", "Team Lead"],
    },
    {
        role: "Associate Game Developer Lead",
        org: "Google Developer Student Clubs (GDSC)",
        period: "2023 – 2025",
        category: "Tech",
        icon: Code,
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/30",
        description:
            "Led game development initiatives within GDSC, guiding student developers in building interactive web-based games and fostering a culture of creative coding and collaboration.",
        skills: ["Game Dev", "JavaScript", "Mentorship", "Google Tech"],
    },
    {
        role: "Tech Support Co-Lead",
        org: "AWS User Group",
        period: "2025 – 2026",
        category: "Tech",
        icon: Zap,
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/30",
        description:
            "Co-led technical support operations for the AWS User Group community, helping members troubleshoot cloud issues and organize knowledge-sharing sessions on AWS services.",
        skills: ["AWS", "Tech Support", "Cloud", "Community"],
    },
    {
        role: "Assistant PRO",
        org: "Central Student Council & Red Cross Youth Council (RCYC)",
        period: "2025 – 2026",
        category: "Creative",
        icon: Megaphone,
        color: "text-pink-400",
        bg: "bg-pink-400/10",
        border: "border-pink-400/30",
        description:
            "Managed public relations and communications for both the Central Student Council and the Red Cross Youth Council, crafting announcements, press releases, and social media content.",
        skills: ["PR", "Communications", "Social Media", "Writing"],
    },
    {
        role: "Executive Secretary",
        org: "Youth for Animals UE-CAL (YFA)",
        period: "Apr 2025 – Jun 2026",
        category: "Advocacy",
        icon: Heart,
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/30",
        description:
            "Handled all official correspondence and documentation for the Youth for Animals organization. Also contributed as a web developer, building the YFA Matching Pet Game to promote animal welfare advocacy.",
        skills: ["Animal Welfare", "Web Dev", "Documentation", "Advocacy"],
    },
    {
        role: "Executive Secretary",
        org: "College Y Club (CYC)",
        period: "2025 – 2026",
        category: "Leadership",
        icon: BookOpen,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/30",
        description:
            "Served as executive secretary managing records, meeting minutes, and official communications for the College Y Club, supporting youth development and campus programs.",
        skills: ["Administration", "Documentation", "Youth Dev", "Leadership"],
    },
    {
        role: "Auditor",
        org: "Christian Community Program (CCP)",
        period: "2025 – 2026",
        category: "Leadership",
        icon: Award,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/30",
        description:
            "Responsible for financial oversight and auditing of organization funds, ensuring transparent and accountable management of resources for community programs and events.",
        skills: ["Auditing", "Finance", "Accountability", "Community"],
    },
    {
        role: "Creative & Communication Committee Member",
        org: "Engineering Student Council (ENSC)",
        period: "Aug 2024 – Jun 2026",
        category: "Creative",
        icon: Globe,
        color: "text-teal-400",
        bg: "bg-teal-400/10",
        border: "border-teal-400/30",
        description:
            "Contributed creative assets, digital content, and communications strategies for the Engineering Student Council, supporting events, publications, and student engagement campaigns.",
        skills: ["Design", "Content", "Communications", "Branding"],
    },
    {
        role: "Committee Secretary",
        org: "LAMPS (Lakas Mag-aral ng Pamantasan)",
        period: "2024 – 2025",
        category: "Leadership",
        icon: Briefcase,
        color: "text-indigo-400",
        bg: "bg-indigo-400/10",
        border: "border-indigo-400/30",
        description:
            "Managed committee documentation and coordination for LAMPS, a student academic empowerment organization focused on strengthening academic culture and peer support across the university.",
        skills: ["Academic Support", "Documentation", "Leadership"],
    },
    {
        role: "Organization Web Developer",
        org: "ACSS — Official Platforms & Games",
        period: "2023 – 2026",
        category: "Tech",
        icon: Code,
        color: "text-violet-400",
        bg: "bg-violet-400/10",
        border: "border-violet-400/30",
        description:
            "Designed and engineered the official ACSS website, a React-based NFC Card Attendance System, the ACSS Space Invader Game, and other interactive web applications using Vanilla JS, HTML5 Canvas, and CSS3.",
        skills: ["React", "NFC", "HTML5 Canvas", "Vanilla JS"],
    },
];

export const VolunteerSection = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [expanded, setExpanded] = useState(null);

    const filtered = experiences.filter(
        (e) => activeCategory === "All" || e.category === activeCategory
    );

    return (
        <section id="volunteer" className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 relative bg-secondary/30">
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                        Leadership &{" "}
                        <span className="text-primary">Volunteer</span>{" "}
                        Experience
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Actively contributing to tech communities, student organizations,
                        and advocacy groups across the university and beyond.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
                    {[
                        { label: "Organizations", value: "11+" },
                        { label: "Years Active", value: "3+" },
                        { label: "Leadership Roles", value: "8+" },
                        { label: "Tech Projects", value: "10+" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="gradient-border p-3 sm:p-4 text-center card-hover"
                        >
                            <div className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
                    {categories.map((cat, key) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-4 sm:px-5 py-2 rounded-full transition-colors duration-300 capitalize text-sm sm:text-base",
                                activeCategory === cat
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary/70 text-foreground hover:bg-secondary"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {filtered.map((exp, index) => {
                        const Icon = exp.icon;
                        const isOpen = expanded === index;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "gradient-border p-4 sm:p-6 card-hover cursor-pointer transition-all duration-300",
                                    isOpen && "ring-1 ring-primary/40"
                                )}
                                onClick={() => setExpanded(isOpen ? null : index)}
                            >
                                {/* Top Row - Mobile Optimized */}
                                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                    <div className={cn("p-2.5 sm:p-3 rounded-full shrink-0", exp.bg)}>
                                        <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", exp.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <h4 className="font-semibold text-sm sm:text-base leading-snug">
                                            {exp.role}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-primary mt-0.5 truncate">{exp.org}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {exp.period}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] sm:text-xs px-2 py-1 rounded-full shrink-0 border self-start mt-0.5",
                                            exp.bg,
                                            exp.color,
                                            exp.border
                                        )}
                                    >
                                        {exp.category}
                                    </span>
                                </div>

                                {/* Expandable Description */}
                                <div
                                    className={cn(
                                        "overflow-hidden transition-all duration-300",
                                        isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                    )}
                                >
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                                    {exp.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-secondary/70 text-foreground hover:bg-secondary transition-colors duration-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Expand hint */}
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 text-right">
                                    {isOpen ? "▲ collapse" : "▼ read more"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};