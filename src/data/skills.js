// Centralized, reusable skill dataset.
// Consumed by: Skills UI, Chatbot knowledge, project relationships, "Currently Learning".
//
// STATUS is honest and does NOT use fabricated percentages:
//   PRIMARY               - core day-to-day tools, used across many projects
//   HANDS-ON              - used directly in real projects
//   WORKING KNOWLEDGE     - comfortable, used in some work
//   CURRENTLY LEARNING    - actively studying, not yet professional-level
//   EXPLORING             - experimenting / early familiarity
//   AI-ASSISTED DEVELOPMENT - AI dev tools used to assist coding
//
// Descriptions and project links only reference things already in the portfolio.

export const SKILL_STATUS = {
    PRIMARY: {
        id: "PRIMARY",
        label: "Primary",
        color: "text-primary",
        ring: "ring-primary/40",
        dot: "bg-primary",
        badge: "bg-primary/15 text-primary border-primary/30",
        weight: 6,
    },
    "HANDS-ON": {
        id: "HANDS-ON",
        label: "Hands-On",
        color: "text-blue-400",
        ring: "ring-blue-400/40",
        dot: "bg-blue-400",
        badge: "bg-blue-500/15 text-blue-300 border-blue-400/30",
        weight: 5,
    },
    "WORKING KNOWLEDGE": {
        id: "WORKING KNOWLEDGE",
        label: "Working Knowledge",
        color: "text-emerald-400",
        ring: "ring-emerald-400/40",
        dot: "bg-emerald-400",
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
        weight: 4,
    },
    "CURRENTLY LEARNING": {
        id: "CURRENTLY LEARNING",
        label: "Currently Learning",
        color: "text-amber-400",
        ring: "ring-amber-400/40",
        dot: "bg-amber-400",
        badge: "bg-amber-500/15 text-amber-300 border-amber-400/30",
        weight: 2,
    },
    EXPLORING: {
        id: "EXPLORING",
        label: "Exploring",
        color: "text-orange-400",
        ring: "ring-orange-400/40",
        dot: "bg-orange-400",
        badge: "bg-orange-500/15 text-orange-300 border-orange-400/30",
        weight: 1,
    },
    "AI-ASSISTED DEVELOPMENT": {
        id: "AI-ASSISTED DEVELOPMENT",
        label: "AI-Assisted Dev",
        color: "text-fuchsia-400",
        ring: "ring-fuchsia-400/40",
        dot: "bg-fuchsia-400",
        badge: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/30",
        weight: 3,
    },
};

export const skillCategories = [
    "Frontend",
    "Backend",
    "Database",
    "Cloud & AWS",
    "DevOps & Tools",
    "IT Support & Systems",
    "Networking",
    "Productivity & Data",
    "Automation & AI",
    "Mobile",
];

export const skills = [
    // ─── Frontend ──────────────────────────────────────────────
    { name: "React.js", category: "Frontend", status: "PRIMARY", description: "Component-based UIs and full-stack web apps.", projects: ["ACSS NFC Attendance System", "Vital Warriors", "M.A.G.E."] },
    { name: "Next.js", category: "Frontend", status: "HANDS-ON", description: "React framework used for production-grade apps.", projects: ["M.A.G.E.", "AWS Inventory Management Platform", "Stock Market Analytics Platform"] },
    { name: "TypeScript", category: "Frontend", status: "HANDS-ON", description: "Typed React apps for safer, larger codebases.", projects: ["ACSS NFC Attendance System", "Vital Warriors", "M.A.G.E.", "Stock Market Analytics Platform"] },
    { name: "JavaScript", category: "Frontend", status: "PRIMARY", description: "Core language for interactive web, games, and DOM logic.", projects: ["ACSS Space Invader Game", "YFA Matching Pet Game", "Portfolio 2025"] },
    { name: "Tailwind CSS", category: "Frontend", status: "PRIMARY", description: "Utility-first styling for responsive, modern interfaces.", projects: ["M.A.G.E.", "This portfolio"] },
    { name: "HTML5", category: "Frontend", status: "PRIMARY", description: "Semantic markup foundation for every web project.", projects: ["Portfolio 2025", "ACSS Official Website"] },
    { name: "CSS3", category: "Frontend", status: "PRIMARY", description: "Layouts, animations, and responsive design.", projects: ["Portfolio 2025", "ACSS Official Website"] },
    { name: "Redux Toolkit", category: "Frontend", status: "HANDS-ON", description: "Predictable state management for larger React apps.", projects: ["AWS Inventory Management Platform"] },

    // ─── Backend ───────────────────────────────────────────────
    { name: "Node.js", category: "Backend", status: "HANDS-ON", description: "Server-side JavaScript and REST API development.", projects: ["AWS Inventory Management Platform"] },
    { name: "Express.js", category: "Backend", status: "HANDS-ON", description: "Web server and API routing on Node.js.", projects: ["AWS Inventory Management Platform"] },
    { name: "Flask", category: "Backend", status: "HANDS-ON", description: "Python web apps with routing, auth, and integrations.", projects: ["PHOTON"] },
    { name: "Python", category: "Backend", status: "HANDS-ON", description: "Backend, automation, algorithms, and data structures.", projects: ["PHOTON"] },
    { name: "PHP", category: "Backend", status: "WORKING KNOWLEDGE", description: "Server-side scripting for web applications.", projects: [] },
    { name: "REST APIs", category: "Backend", status: "HANDS-ON", description: "Designing and consuming APIs across projects.", projects: ["Stock Market Analytics Platform", "PHOTON"] },
    { name: "WebSockets", category: "Backend", status: "HANDS-ON", description: "Real-time bidirectional communication.", projects: ["PHOTON"] },
    { name: "Prisma", category: "Backend", status: "WORKING KNOWLEDGE", description: "Type-safe ORM for PostgreSQL.", projects: ["AWS Inventory Management Platform"] },

    // ─── Database ──────────────────────────────────────────────
    { name: "PostgreSQL", category: "Database", status: "HANDS-ON", description: "Relational database for full-stack applications.", projects: ["AWS Inventory Management Platform", "M.A.G.E."] },
    { name: "Supabase", category: "Database", status: "HANDS-ON", description: "Postgres backend-as-a-service with auth.", projects: ["M.A.G.E.", "Vital Warriors"] },
    { name: "MySQL", category: "Database", status: "WORKING KNOWLEDGE", description: "Relational data modeling and queries.", projects: [] },
    { name: "SQL", category: "Database", status: "HANDS-ON", description: "Querying and managing relational data.", projects: ["AWS Inventory Management Platform"] },

    // ─── Cloud & AWS ───────────────────────────────────────────
    { name: "AWS EC2", category: "Cloud & AWS", status: "HANDS-ON", description: "Compute instances for hosting applications.", projects: ["AWS Inventory Management Platform"] },
    { name: "AWS RDS", category: "Cloud & AWS", status: "HANDS-ON", description: "Managed relational database service.", projects: ["AWS Inventory Management Platform"] },
    { name: "AWS S3", category: "Cloud & AWS", status: "HANDS-ON", description: "Object storage for assets and files.", projects: ["AWS Inventory Management Platform"] },
    { name: "AWS VPC", category: "Cloud & AWS", status: "WORKING KNOWLEDGE", description: "Network isolation and cloud networking.", projects: ["AWS Inventory Management Platform"] },
    { name: "AWS Cognito", category: "Cloud & AWS", status: "WORKING KNOWLEDGE", description: "Authentication and user identity.", projects: ["AWS Inventory Management Platform"] },
    { name: "API Gateway", category: "Cloud & AWS", status: "WORKING KNOWLEDGE", description: "Managed API endpoints on AWS.", projects: ["AWS Inventory Management Platform"] },
    { name: "AWS Amplify", category: "Cloud & AWS", status: "WORKING KNOWLEDGE", description: "Front-end hosting and deployment on AWS.", projects: ["AWS Inventory Management Platform"] },

    // ─── DevOps & Tools ────────────────────────────────────────
    { name: "Git", category: "DevOps & Tools", status: "PRIMARY", description: "Version control for all projects.", projects: [] },
    { name: "GitHub", category: "DevOps & Tools", status: "PRIMARY", description: "Repositories, GitHub Actions, and collaboration.", projects: ["ACSS Space Invader Game", "YFA Matching Pet Game"] },
    { name: "GitHub Actions", category: "DevOps & Tools", status: "WORKING KNOWLEDGE", description: "CI/CD automation for builds and deploys.", projects: ["AWS Inventory Management Platform", "ACSS Space Invader Game"] },
    { name: "Vercel", category: "DevOps & Tools", status: "HANDS-ON", description: "Deploying React and full-stack apps.", projects: ["M.A.G.E.", "ACSS Official Website"] },
    { name: "Netlify", category: "DevOps & Tools", status: "HANDS-ON", description: "Hosting and CI for front-end projects.", projects: ["ACSS NFC Attendance System", "Vital Warriors"] },
    { name: "VS Code", category: "DevOps & Tools", status: "PRIMARY", description: "Primary development environment.", projects: [] },
    { name: "Figma", category: "DevOps & Tools", status: "WORKING KNOWLEDGE", description: "UI/UX design and prototyping.", projects: [] },

    // ─── IT Support & Systems ──────────────────────────────────
    { name: "Technical Troubleshooting", category: "IT Support & Systems", status: "HANDS-ON", description: "Diagnosing and resolving technical issues.", projects: [] },
    { name: "Hardware Troubleshooting", category: "IT Support & Systems", status: "WORKING KNOWLEDGE", description: "Basic hardware diagnostics and fixes.", projects: [] },
    { name: "Software Troubleshooting", category: "IT Support & Systems", status: "HANDS-ON", description: "Resolving software and application problems.", projects: [] },
    { name: "User Support", category: "IT Support & Systems", status: "HANDS-ON", description: "Helping users with technical needs.", projects: [] },
    { name: "Web App Support", category: "IT Support & Systems", status: "HANDS-ON", description: "Supporting and maintaining web applications.", projects: [] },
    { name: "OS Fundamentals", category: "IT Support & Systems", status: "WORKING KNOWLEDGE", description: "Operating system concepts and administration.", projects: [] },

    // ─── Networking ────────────────────────────────────────────
    { name: "Networking Fundamentals", category: "Networking", status: "WORKING KNOWLEDGE", description: "Core networking concepts.", projects: [] },
    { name: "TCP/IP", category: "Networking", status: "WORKING KNOWLEDGE", description: "Foundational network protocols.", projects: [] },
    { name: "DNS", category: "Networking", status: "WORKING KNOWLEDGE", description: "Domain name resolution.", projects: [] },
    { name: "Wi-Fi / Connectivity", category: "Networking", status: "WORKING KNOWLEDGE", description: "Wireless and connectivity troubleshooting.", projects: [] },
    { name: "Authentication & Access", category: "Networking", status: "WORKING KNOWLEDGE", description: "User access, authentication, and RBAC.", projects: ["AWS Inventory Management Platform", "M.A.G.E."] },

    // ─── Productivity & Data ───────────────────────────────────
    { name: "Microsoft Office", category: "Productivity & Data", status: "HANDS-ON", description: "Documents, spreadsheets, and presentations.", projects: [] },
    { name: "Excel", category: "Productivity & Data", status: "HANDS-ON", description: "Spreadsheets, formulas, and data handling.", projects: [] },
    { name: "Documentation", category: "Productivity & Data", status: "HANDS-ON", description: "Technical and organizational documentation.", projects: [] },
    { name: "Data Handling", category: "Productivity & Data", status: "WORKING KNOWLEDGE", description: "Organizing and processing data.", projects: [] },

    // ─── Automation & AI ───────────────────────────────────────
    { name: "n8n", category: "Automation & AI", status: "EXPLORING", description: "Workflow automation — early experimentation.", projects: [] },
    { name: "Kiro", category: "Automation & AI", status: "AI-ASSISTED DEVELOPMENT", description: "AI-assisted development tooling.", projects: [] },
    { name: "Cursor", category: "Automation & AI", status: "AI-ASSISTED DEVELOPMENT", description: "AI-assisted code editor.", projects: [] },
    { name: "OCR", category: "Automation & AI", status: "HANDS-ON", description: "Optical character recognition integration.", projects: ["PHOTON"] },
    { name: "Inngest", category: "Automation & AI", status: "WORKING KNOWLEDGE", description: "Event-driven background jobs and workflows.", projects: ["Stock Market Analytics Platform"] },

    // ─── Languages (extras) ────────────────────────────────────
    { name: "C++", category: "Backend", status: "WORKING KNOWLEDGE", description: "Programming fundamentals and problem solving.", projects: [] },
    { name: "Java", category: "Backend", status: "WORKING KNOWLEDGE", description: "OOP and the DMP Full Stack Academy LMS.", projects: ["DMP Full Stack Academy"] },

    // ─── Mobile ────────────────────────────────────────────────
    { name: "React Native", category: "Mobile", status: "CURRENTLY LEARNING", description: "Cross-platform mobile development — actively learning.", projects: [] },
];

// Convenience groupings reused by UI and chatbot.
export const currentlyLearning = skills.filter(
    (s) => s.status === "CURRENTLY LEARNING" || s.status === "EXPLORING"
);

export const skillsByCategory = skillCategories.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
}, {});
