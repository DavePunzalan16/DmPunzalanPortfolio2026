// ============================================================================
// CHATBOT KNOWLEDGE BASE — single source of truth for DaveBot.
// Everything here is derived from the existing portfolio/resume data.
// The chatbot MUST NOT invent anything beyond this file. When it can't match
// an intent confidently, it returns the explicit "no information" fallback.
// ============================================================================

export const profile = {
    name: "Dave Matthew S. Punzalan",
    positioning: "Full Stack Developer with a strong front-end focus (React / Next.js) and practical AWS cloud project experience.",
    status: "Fresh graduate — BS Computer Science (2026), open to work.",
    focus: "Builds full-stack web applications, has IT troubleshooting / technical support foundations, and is active in tech communities.",
    location: "Caloocan City, Metro Manila, Philippines",
    openToWork: true,
};

export const education = {
    degree: "BS Computer Science (Major in Web Development)",
    university: "University of the East — Caloocan",
    period: "2022–2026",
};

// Community & organization involvement (source of truth for the community intent).
export const community = [
    { organization: "AWS User Group Philippines", role: "Tech Support Co-Lead", period: "2025–2026" },
    { organization: "AWS Community Day Philippines", role: "Volunteer / Technical and Operations Support", period: "2025–2026" },
    { organization: "AWS Learning Club – UE Caloocan", role: "Executive Secretary / Logistics & Tech Team Lead", period: "2025–2026" },
    { organization: "Python Asia 2026", role: "Team Lead – Code of Conduct & Security", period: "2026" },
    { organization: "DevCon University of the East Chapter", role: "Secretary", period: "2025–2026" },
    { organization: "n8n Community Philippines", role: "Community Participant", period: "2025–2026" },
    { organization: "Google Developer Student Clubs", role: "Associate Game Developer Lead", period: "2024–2026" },
    { organization: "Association of Computer Studies Students (ACSS)", role: "Vice President for External Affairs / Business Manager", period: "2023–2026" },
];

export const experience = [
    { role: "Web Development Intern", org: "JG Superstore", period: "May–Jul 2025", notes: "Developed and maintained e-commerce web features; debugged front-end issues and optimized performance." },
    { role: "Organization Web Developer", org: "ACSS", period: "2023–2026", notes: "Built the official ACSS website, NFC Attendance System, Space Invader Game, and YFA Pet Game." },
    { role: "Co-Owner & Digital Operations Lead", org: "The Choco Plug", period: "2025–2026", notes: "Managed digital operations, social media, and online orders." },
];

export const itSupport = [
    "Technical troubleshooting", "Basic hardware troubleshooting", "Software troubleshooting",
    "User support", "Web application support", "Operating systems fundamentals",
    "Microsoft Office & Excel", "Documentation", "Data handling",
];

export const networking = ["Networking fundamentals", "TCP/IP", "DNS", "Wi-Fi / connectivity", "Authentication, user access & RBAC"];

export const aws = [
    "EC2", "RDS", "S3", "VPC", "Cognito", "API Gateway", "Amplify",
    "CI/CD", "Cloud deployment", "Cloud architecture",
];

export const certifications = {
    count: "75+",
    highlights: [
        "Front-End Engineering with React — CodeSignal",
        "React Basics — Meta",
        "Intro to Front-End Development — Meta",
        "Microsoft Cybersecurity Analyst — Microsoft",
        "Power BI Data Analyst — Data Sense Analytics",
        "Algorithms & Data Structures in Python — CodeSignal",
        "Azure Fundamentals — STYAVA.DEV",
    ],
};

export const contact = {
    email: "dave16punzalan@gmail.com",
    phone: "+63 905 841 2887",
    linkedin: "linkedin.com/in/davematthewpunzalan/",
    github: "github.com/DavePunzalan16",
    location: "Caloocan City, Philippines",
};

// Key projects with problem/tech/features (used for project + relational intents).
export const projects = [
    {
        name: "AWS Inventory Management Platform",
        aliases: ["inventory", "aws inventory", "inventory management"],
        description: "A full-stack inventory management platform deployed on AWS.",
        problem: "Managing inventory data with a scalable, cloud-hosted stack.",
        tech: ["Next.js", "Redux Toolkit", "Node.js", "Express", "Prisma", "PostgreSQL", "EC2", "RDS", "S3", "VPC", "Cognito", "API Gateway", "Amplify", "GitHub Actions"],
    },
    {
        name: "PHOTON",
        aliases: ["photon"],
        description: "A real-time application using computer-vision/OCR and live communication.",
        problem: "Processing and communicating data in real time with OCR.",
        tech: ["React.js", "Flask", "WebSocket", "OCR", "API integration"],
    },
    {
        name: "M.A.G.E.",
        aliases: ["mage", "m.a.g.e", "guild", "manga anime game"],
        description: "A full-stack social platform for the UE Caloocan Manga, Anime & Game Enthusiasts Guild — feed, events, gallery, officer management, and a mini-game hub.",
        problem: "A community platform combining social features with a game hub.",
        tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Authentication", "Admin CMS", "Event management", "Social features", "Mini-game hub"],
        live: "https://officialmagewebsite.vercel.app/",
    },
    {
        name: "Stock Market Analytics Platform",
        aliases: ["stock", "stock market", "dmp stock", "analytics"],
        description: "A real-time stock market analytics dashboard.",
        problem: "Delivering live financial data with background processing.",
        tech: ["Next.js", "React", "TypeScript", "Inngest", "Authentication", "Financial APIs"],
    },
    {
        name: "ACSS NFC Attendance System",
        aliases: ["nfc", "attendance"],
        description: "A React-based web app that uses NFC cards to streamline event attendance for ACSS.",
        problem: "Fast, reliable event check-ins.",
        tech: ["React.js", "Tailwind CSS", "TypeScript", "Netlify"],
        live: "https://legendary-sable-b03450.netlify.app/",
    },
    {
        name: "Vital Warriors",
        aliases: ["vital warriors", "vitalwarriors", "health"],
        description: "A hardware + software web app that detects health vitals using open camera APIs.",
        problem: "Scanning faces to estimate health metrics.",
        tech: ["React.js", "Supabase", "TypeScript", "Netlify"],
    },
    {
        name: "ACSS Space Invader Game",
        aliases: ["space invader", "space invaders"],
        description: "An 8-bit style web game built for ACSS Org Week.",
        problem: "An engaging interactive game for a community event.",
        tech: ["HTML5", "CSS3", "Vanilla JS", "GitHub Actions"],
        live: "https://acss-space-invader-game.vercel.app/",
    },
    {
        name: "AI-Powered SEO Website Ranker",
        aliases: ["seo", "website ranker", "firecrawl", "gemini"],
        description: "An AI tool that audits and ranks websites.",
        problem: "Uncovering SEO issues and optimization opportunities.",
        tech: ["Firecrawl", "Gemini AI", "JavaScript"],
    },
    {
        name: "DMP Full Stack Academy",
        aliases: ["academy", "lms", "full stack academy"],
        description: "A Java-powered learning management system with courses, challenges, and gamification.",
        problem: "A structured learning platform for front-end learners.",
        tech: ["Java", "LMS", "React.js"],
    },
    {
        name: "Portfolio 2025",
        aliases: ["portfolio 2025", "old portfolio"],
        description: "A personal portfolio website.",
        problem: "Showcasing skills and projects.",
        tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    },
];

// Suggested question chips for the UI.
export const suggestedQuestions = [
    "Who is Dave?",
    "What's his tech stack?",
    "What communities is he involved in?",
    "What's his AWS experience?",
    "What is Dave currently learning?",
    "Does Dave have IT support experience?",
    "How can I contact Dave?",
];
