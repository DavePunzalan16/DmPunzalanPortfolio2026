import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Award, ChevronDown, Search, X, Star, ExternalLink } from "lucide-react";

const LINKEDIN_CERTS_URL = "https://www.linkedin.com/in/davematthewpunzalan/details/certifications/";

const categories = [
    "All",
    "Cloud & Cybersecurity",
    "AI & Data Analytics",
    "Front-End & Web Dev",
    "Backend & Flask",
    "Programming & CS",
    "Leadership & Volunteer",
    "Career & Workshops",
    "Competitions & Events",
];

const categoryColors = {
    "Cloud & Cybersecurity":  { bg: "bg-orange-500/20",  text: "text-orange-400",  border: "border-orange-500/30",  dot: "bg-orange-400",  glow: "rgba(249,115,22,0.2)"  },
    "AI & Data Analytics":    { bg: "bg-blue-500/20",    text: "text-blue-400",    border: "border-blue-500/30",    dot: "bg-blue-400",    glow: "rgba(59,130,246,0.2)"  },
    "Front-End & Web Dev":    { bg: "bg-primary/20",     text: "text-primary",     border: "border-primary/30",     dot: "bg-primary",     glow: "rgba(139,92,246,0.2)"  },
    "Backend & Flask":        { bg: "bg-green-500/20",   text: "text-green-400",   border: "border-green-500/30",   dot: "bg-green-400",   glow: "rgba(34,197,94,0.2)"   },
    "Programming & CS":       { bg: "bg-yellow-500/20",  text: "text-yellow-400",  border: "border-yellow-500/30",  dot: "bg-yellow-400",  glow: "rgba(234,179,8,0.2)"   },
    "Leadership & Volunteer": { bg: "bg-pink-500/20",    text: "text-pink-400",    border: "border-pink-500/30",    dot: "bg-pink-400",    glow: "rgba(236,72,153,0.2)"  },
    "Career & Workshops":     { bg: "bg-teal-500/20",    text: "text-teal-400",    border: "border-teal-500/30",    dot: "bg-teal-400",    glow: "rgba(20,184,166,0.2)"  },
    "Competitions & Events":  { bg: "bg-red-500/20",     text: "text-red-400",     border: "border-red-500/30",     dot: "bg-red-400",     glow: "rgba(239,68,68,0.2)"   },
};

const issuerLogos = {
    "CodeSignal":           "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/CodeSignal_logo.svg/1200px-CodeSignal_logo.svg.png",
    "Meta":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/800px-Meta_Platforms_Inc._logo.svg.png",
    "Google":               "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
    "Microsoft":            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
    "AWS":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png",
    "Codecademy":           "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Codecademy.svg/800px-Codecademy.svg.png",
    "Philippine Red Cross": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/320px-Flag_of_the_Red_Cross.svg.png",
};

const certificates = [
    // Cloud & Cybersecurity
    { title: "Organizer — AWS Student re:Invent re:Cap 2026", issuer: "AWS User Group Philippines", date: "Mar 2026", category: "Cloud & Cybersecurity", platform: "Google Meet", featured: true },
    { title: "Azure Fundamentals Training", issuer: "STYAVA.DEV", date: "Mar 2025", category: "Cloud & Cybersecurity", platform: "Online" },
    { title: "Building AI Agents and Apps with Azure AI Foundry", issuer: "STYAVA.DEV", date: "Mar 2025", category: "Cloud & Cybersecurity", platform: "Online" },
    { title: "Mastering Entra ID", issuer: "STYAVA.DEV", date: "Apr 2025", category: "Cloud & Cybersecurity", platform: "Online" },
    { title: "Microsoft Cybersecurity Analyst", issuer: "Microsoft", date: "Mar 2025", category: "Cloud & Cybersecurity", platform: "Online", featured: true },

    // AI & Data Analytics
    { title: "Microsoft Power BI Data Analyst Certification", issuer: "Data Sense Analytics", date: "Mar 2025", category: "AI & Data Analytics", platform: "Online", featured: true },
    { title: "Data Analyst Specialist Open House Mentoring Program", issuer: "DataSense Analytics", date: "May 2025", category: "AI & Data Analytics", platform: "Zoom" },
    { title: "Fundamentals of Python Programming", issuer: "Data Analytics Philippines", date: "Apr 2025", category: "AI & Data Analytics", platform: "Online" },
    { title: "Getting Started with OpenAI Whisper API in Python", issuer: "CodeSignal", date: "Jul 2025", category: "AI & Data Analytics", platform: "Online" },
    { title: "Transcribing Large Files in Python using FFmpeg", issuer: "CodeSignal", date: "Aug 2025", category: "AI & Data Analytics", platform: "Online" },
    { title: "Tech Everywhere 2025", issuer: "Google Developer Groups on Campus Loyola", date: "Mar 2025", category: "AI & Data Analytics", platform: "Online" },

    // Front-End & Web Dev
    { title: "Front-End Engineering with React", issuer: "CodeSignal", date: "Apr 2025", category: "Front-End & Web Dev", platform: "Online", featured: true },
    { title: "Introduction to Web Development in React", issuer: "CodeSignal", date: "Apr 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "Getting Deeper into React", issuer: "CodeSignal", date: "Apr 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "Understanding and Using APIs in React", issuer: "CodeSignal", date: "Apr 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "Routing in React Applications", issuer: "CodeSignal", date: "Apr 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "React Basics", issuer: "Meta", date: "Mar 2025", category: "Front-End & Web Dev", platform: "Online", featured: true },
    { title: "Introduction to Front-End Development", issuer: "Meta", date: "Mar 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "HTML and CSS in Depth", issuer: "Meta", date: "Mar 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "Learn HTML Course", issuer: "Codecademy", date: "Apr 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "Introduction to HTML and CSS", issuer: "Alison", date: "Apr 2025", category: "Front-End & Web Dev", platform: "Online" },
    { title: "Web Foundations: Building the HTML Basics", issuer: "Google Developer Student Clubs UE Caloocan", date: "Jan 2024", category: "Front-End & Web Dev", platform: "Google Meet" },
    { title: "Designing the Future: UI/UX Exploration with FIGMA", issuer: "Google Developer Student Clubs UE Caloocan", date: "Mar 2024", category: "Front-End & Web Dev", platform: "Online" },
    { title: "Prototyping with Figma: A Step-by-Step Guide", issuer: "Mariano Marcos State University", date: "May 2025", category: "Front-End & Web Dev", platform: "Online" },

    // Backend & Flask
    { title: "Getting Started with Flask and Web Development", issuer: "CodeSignal", date: "Apr 2025", category: "Backend & Flask", platform: "Online" },
    { title: "Building a ToDo App with Flask", issuer: "CodeSignal", date: "Apr 2025", category: "Backend & Flask", platform: "Online" },
    { title: "Integrating a SQL Database to Flask", issuer: "CodeSignal", date: "Jun 2025", category: "Backend & Flask", platform: "Online" },
    { title: "Securing Flask ToDo App with Session Authentication", issuer: "CodeSignal", date: "Jun 2025", category: "Backend & Flask", platform: "Online" },
    { title: "Enhancing Flask with Additional Features", issuer: "CodeSignal", date: "Jun 2025", category: "Backend & Flask", platform: "Online" },
    { title: "Implementing MVC ToDo App with Flask", issuer: "CodeSignal", date: "Jun 2025", category: "Backend & Flask", platform: "Online", featured: true },

    // Programming & CS
    { title: "Revisiting Python Essentials", issuer: "CodeSignal", date: "May 2026", category: "Programming & CS", platform: "Online" },
    { title: "Mastering Algorithms and Data Structures in Python", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online", featured: true },
    { title: "Sorting and Searching Algorithms in Python", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "Linked Lists, Stacks, and Queues in Python", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "Understanding and Using Trees in Python", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "Hashing, Dictionaries, and Sets in Python", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "Getting Started with Java", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "Learning Simple Data Structures in Java", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "Programming with JavaScript", issuer: "Meta", date: "Mar 2025", category: "Programming & CS", platform: "Online", featured: true },
    { title: "Intro to JavaScript for React Developers", issuer: "CodeSignal", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "Learn JavaScript Course", issuer: "Codecademy", date: "Apr 2025", category: "Programming & CS", platform: "Online" },
    { title: "C++ Basics", issuer: "CodeSignal", date: "May 2026", category: "Programming & CS", platform: "Online" },
    { title: "C++ Loops and Conditional Statements", issuer: "CodeSignal", date: "May 2026", category: "Programming & CS", platform: "Online" },
    { title: "Version Control (Git & GitHub)", issuer: "Meta", date: "Mar 2025", category: "Programming & CS", platform: "Online" },

    // Leadership & Volunteer
    { title: "Certificate of Appreciation — Youth for Animals Executive Secretary", issuer: "Youth for Animals (YFA)", date: "May 2026", category: "Leadership & Volunteer", platform: "UE Caloocan", featured: true },
    { title: "PAWS Shelter Visit, Tour, and Cleaning", issuer: "Youth for Animals (YFA)", date: "Jan 2026", category: "Leadership & Volunteer", platform: "PAWS Philippines" },
    { title: "Hearts & Paws: A Webinar on Compassionate Pet Ownership", issuer: "Youth for Animals (YFA)", date: "Mar 2026", category: "Leadership & Volunteer", platform: "Online Webinar" },
    { title: "Trails and Tails: The Fur Real Legacy Seminar", issuer: "Youth for Animals (YFA)", date: "Oct 2025", category: "Leadership & Volunteer", platform: "Online" },
    { title: "Certificate of Appreciation — RCYC Service Recognition", issuer: "UERM Red Cross Youth Council", date: "May 2026", category: "Leadership & Volunteer", platform: "UE Caloocan", featured: true },
    { title: "Youth Volunteer Formation Course (YVFC)", issuer: "Philippine Red Cross", date: "Dec 2025", category: "Leadership & Volunteer", platform: "Caloocan City" },
    { title: "CPR Caravan: Life-Saving Skills Training", issuer: "Philippine Red Cross", date: "Oct 2025", category: "Leadership & Volunteer", platform: "UE Caloocan" },
    { title: "PythonAsia 2026 Volunteer Certificate", issuer: "Python Asia Organization MTÜ", date: "Mar 2026", category: "Leadership & Volunteer", platform: "PythonAsia 2026", featured: true },
    { title: "Code of Conduct Enforcement Workshop", issuer: "Otter Tech LLC", date: "Feb 2026", category: "Leadership & Volunteer", platform: "Online" },
    { title: "Certificate of Membership — UE Zenith", issuer: "UE Zenith", date: "Aug 2025", category: "Leadership & Volunteer", platform: "UE Caloocan" },
    { title: "Student Leaders Orientation", issuer: "University of the East", date: "Jul 2025", category: "Leadership & Volunteer", platform: "UE Caloocan" },
    { title: "Creatives Committee for ENvision 2024–2025", issuer: "Engineering Student Council UE Caloocan", date: "Jun 2025", category: "Leadership & Volunteer", platform: "UE Caloocan" },
    { title: "iThink Hackathon Volunteer", issuer: "ICP HUB Philippines", date: "Jun 2025", category: "Leadership & Volunteer", platform: "SMX Convention Center Manila" },
    { title: "GDSC UE 2023–2024 Membership Certificate", issuer: "Google Developer Student Clubs UE Caloocan", date: "Jul 2023", category: "Leadership & Volunteer", platform: "UE Caloocan" },

    // Career & Workshops
    { title: "Labor Education for Graduating Students", issuer: "University of the East", date: "Mar 2026", category: "Career & Workshops", platform: "UE Caloocan" },
    { title: "Workplace Readiness and Professionalism", issuer: "University of the East", date: "Apr 2025", category: "Career & Workshops", platform: "UE Caloocan" },
    { title: "Understanding Labor Laws & Employee Rights", issuer: "University of the East", date: "Apr 2025", category: "Career & Workshops", platform: "UE Caloocan" },
    { title: "Career Accelerator: Master your Resume, Interviews & Future Success!", issuer: "ActsofLove", date: "Mar 2025", category: "Career & Workshops", platform: "Online" },
    { title: "Mastering Business Communication: Win Clients & Influence Teams", issuer: "UniAthena", date: "Mar 2025", category: "Career & Workshops", platform: "Online" },
    { title: "Introduction to Excel Webinar", issuer: "Virtual Mentors", date: "Mar 2025", category: "Career & Workshops", platform: "Online" },
    { title: "Advanced Excel: Unlocking Powerful Features and Functions", issuer: "Virtual Mentors", date: "Mar 2025", category: "Career & Workshops", platform: "Online" },
    { title: "ACSSessment: Navigating Your Future in Tech", issuer: "Association of Computer Studies Students", date: "Oct 2025", category: "Career & Workshops", platform: "UE Caloocan" },
    { title: "5GEN: The 5G Innovation Impact", issuer: "Engineering Student Council UE Caloocan", date: "Apr 2025", category: "Career & Workshops", platform: "UE Caloocan" },
    { title: "Breaking the Silence: An Anti-Bullying Awareness Seminar", issuer: "Engineering Student Council UE Caloocan", date: "Mar 2025", category: "Career & Workshops", platform: "UE Caloocan" },

    // Competitions & Events
    { title: "Fork-or-Treat: First PRs, No Scares for Hacktoberfest!", issuer: "Google Developer Student Clubs", date: "Oct 2025", category: "Competitions & Events", platform: "Online" },
    { title: "Study Jams Repo Con", issuer: "Google Developer Student Clubs UE Caloocan", date: "Nov 2023", category: "Competitions & Events", platform: "UE Caloocan" },
    { title: "SharpEN: Battle of the Pens", issuer: "Engineering Student Council UE Caloocan", date: "Nov 2023", category: "Competitions & Events", platform: "UE Caloocan" },
    { title: "LITS ScanQuest Amazing Race", issuer: "League of Information Technology Students", date: "Sep 2024", category: "Competitions & Events", platform: "UE Caloocan" },
    { title: "IT Convention", issuer: "League of Information Technology Students", date: "Nov 2024", category: "Competitions & Events", platform: "UE Caloocan" },
    { title: "HTML5 Game Development — Lessons and Development Planning", issuer: "Alison", date: "Apr 2025", category: "Competitions & Events", platform: "Online" },
];

const IssuerAvatar = ({ issuer }) => {
    const logoUrl = Object.entries(issuerLogos).find(([key]) =>
        issuer.toLowerCase().includes(key.toLowerCase())
    )?.[1];

    const initials = issuer.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

    if (logoUrl) {
        return (
            <div className="relative w-9 h-9 shrink-0">
                <img
                    src={logoUrl}
                    alt={issuer}
                    className="w-9 h-9 object-contain rounded-lg bg-white/5 p-0.5"
                    onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                    }}
                />
                <div
                    style={{ display: "none" }}
                    className="w-9 h-9 rounded-lg bg-primary/20 items-center justify-center text-xs font-bold text-primary absolute inset-0"
                >
                    {initials}
                </div>
            </div>
        );
    }

    return (
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {initials}
        </div>
    );
};

const CertCard = ({ cert, index }) => {
    const colors = categoryColors[cert.category] || categoryColors["Front-End & Web Dev"];
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setVisible(true), (index % 12) * 50);
                }
            },
            { threshold: 0.05 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [index]);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "group relative bg-card rounded-2xl border border-border/50 p-5 flex flex-col gap-3",
                "transition-all duration-500",
                hovered && `shadow-[0_0_25px_${colors.glow}] border-opacity-80 -translate-y-1`,
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
                borderColor: hovered ? colors.dot.replace("bg-", "") : undefined,
            }}
        >
            {/* Featured star */}
            {cert.featured && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-primary rounded-full p-1 shadow-[0_0_12px_rgba(139,92,246,0.7)] animate-pulse">
                        <Star className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
                    </div>
                </div>
            )}

            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
                <IssuerAvatar issuer={cert.issuer} />
                <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ml-auto",
                    colors.bg, colors.text, colors.border
                )}>
                    {cert.date}
                </span>
            </div>

            {/* Title & Issuer */}
            <div className="flex-1 space-y-1">
                <h4 className={cn(
                    "font-semibold text-sm leading-snug transition-colors duration-300 line-clamp-2",
                    hovered ? colors.text : "text-foreground"
                )}>
                    {cert.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{cert.issuer}</p>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium",
                    colors.bg, colors.text, colors.border
                )}>
                    <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle", colors.dot)} />
                    {cert.category.split(" ")[0]}
                </span>

                {/* View on LinkedIn */}
                <a
                    href={LINKEDIN_CERTS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                        "flex items-center gap-1 text-xs font-medium transition-all duration-300 px-2 py-1 rounded-lg",
                        hovered
                            ? `${colors.bg} ${colors.text} opacity-100`
                            : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary"
                    )}
                    aria-label="View on LinkedIn"
                >
                    <ExternalLink className="h-3 w-3" />
                    View
                </a>
            </div>
        </div>
    );
};

export const CertificatesSection = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);
    const INITIAL_COUNT = 12;

    const filtered = certificates.filter((c) => {
        const matchCat = activeCategory === "All" || c.category === activeCategory;
        const matchSearch =
            search === "" ||
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.issuer.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

    const stats = [
        { value: `${certificates.length}+`, label: "Certificates" },
        { value: `${certificates.filter(c => c.featured).length}`, label: "Featured" },
        { value: `${[...new Set(certificates.map(c => c.issuer))].length}+`, label: "Issuers" },
        { value: `${categories.length - 1}`, label: "Categories" },
    ];

    return (
        <section id="certificates" className="py-24 px-4 relative bg-secondary/20">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <Award className="h-4 w-4" />
                        Continuous Learning
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Certificates &{" "}
                        <span className="text-primary">Achievements</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        A collection of certifications, training completions, and recognitions
                        earned through continuous learning and active community involvement.
                    </p>
                    <a
                        href={LINKEDIN_CERTS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-full border border-primary/30 text-primary text-sm hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        View All on LinkedIn
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                    {stats.map((s, i) => (
                        <div key={i} className="gradient-border p-4 rounded-2xl text-center card-hover">
                            <div className="text-2xl font-bold text-primary">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-md mx-auto mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setShowAll(true); }}
                        placeholder="Search certificates or issuers..."
                        className="w-full pl-11 pr-10 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-sm"
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(""); setShowAll(false); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat) => {
                        const count = cat === "All"
                            ? certificates.length
                            : certificates.filter(c => c.category === cat).length;
                        const colors = cat !== "All" ? categoryColors[cat] : null;

                        return (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 border",
                                    activeCategory === cat
                                        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-105"
                                        : "bg-secondary/70 text-foreground hover:bg-secondary border-border/50 hover:border-primary/30"
                                )}
                            >
                                {cat !== "All" && colors && (
                                    <span className={cn("w-2 h-2 rounded-full shrink-0", colors.dot)} />
                                )}
                                {cat}
                                <span className={cn(
                                    "text-xs rounded-full px-1.5 py-0.5 font-bold ml-0.5",
                                    activeCategory === cat
                                        ? "bg-white/20 text-white"
                                        : "bg-border/80 text-muted-foreground"
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Results count */}
                <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="text-primary font-semibold">{displayed.length}</span>
                        {" "}of{" "}
                        <span className="text-primary font-semibold">{filtered.length}</span>
                        {" "}certificates
                        {search && (
                            <span> matching "<span className="text-foreground font-medium">{search}</span>"</span>
                        )}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayed.map((cert, index) => (
                        <CertCard key={`${cert.title}-${index}`} cert={cert} index={index} />
                    ))}
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <Award className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg font-medium">No certificates found.</p>
                        <p className="text-muted-foreground/60 text-sm mt-1">Try a different search or category.</p>
                        <button
                            onClick={() => { setSearch(""); setActiveCategory("All"); setShowAll(false); }}
                            className="mt-4 text-primary hover:underline text-sm font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Show More / Less */}
                {filtered.length > INITIAL_COUNT && (
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary/10 transition-all duration-300 font-medium group hover:scale-105"
                        >
                            {showAll ? (
                                <>
                                    Show Less
                                    <ChevronDown className="h-4 w-4 rotate-180 transition-transform duration-300" />
                                </>
                            ) : (
                                <>
                                    Show All {filtered.length} Certificates
                                    <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Footer CTA */}
                <div className="mt-16 pt-8 border-t border-border/50 text-center">
                    <p className="text-muted-foreground text-sm mb-4">
                        Want to verify all certificates?
                    </p>
                    <a
                        href={LINKEDIN_CERTS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cosmic-button inline-flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        View All Certificates on LinkedIn
                        <ExternalLink className="h-4 w-4" />
                    </a>

                    {/* Legend */}
                    <div className="mt-10">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Category Legend</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {Object.entries(categoryColors).map(([cat, colors]) => (
                                <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <span className={cn("w-2 h-2 rounded-full shrink-0", colors.dot)} />
                                    {cat}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                            <div className="bg-primary rounded-full p-0.5">
                                <Star className="h-2.5 w-2.5 text-primary-foreground fill-primary-foreground" />
                            </div>
                            Featured / Highlighted Certificate
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};