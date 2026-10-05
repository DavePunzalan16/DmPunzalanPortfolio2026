// ============================================================================
// DaveBot response engine.
// Uses intent scoring against a centralized knowledge base (chatbotKnowledge.js)
// and the shared skills dataset (skills.js). No hardcoded facts live here — this
// file only maps user intent -> a formatter that reads from the knowledge base.
//
// STRICT RULE: if no intent scores high enough, return the explicit
// "no information" fallback. Never fabricate.
// ============================================================================

import {
    profile, education, community, communityMoments, experience, itSupport, networking,
    aws, certifications, contact, projects, suggestedQuestions,
} from "@/data/chatbotKnowledge";
import { skillsByCategory, currentlyLearning, SKILL_STATUS } from "@/data/skills";

export { suggestedQuestions };

const listSkills = (arr) => arr.map((s) => s.name).join(", ");

// ── Intent formatters ───────────────────────────────────────────────────────

const answerCommunity = () => {
    const orgs = community.map((c) => `• **${c.organization}** — ${c.role} (${c.period})`).join("\n");
    const moments = communityMoments.map((m) => `• **${m.event}** (${m.role}) — ${m.notes}`).join("\n");
    return `🌐 Dave is active in several tech communities:\n\n${orgs}\n\n**Community moments / events:**\n${moments}\n\nHis involvement spans technical support, operations, leadership, security / code-of-conduct work, and organization roles.`;
};

const answerProfile = () =>
    `👨‍💻 **${profile.name}** — ${profile.positioning}\n\n${profile.status}\n\n${profile.focus}`;

const answerEducation = () =>
    `🎓 **Education:** ${education.degree}\n${education.university} · ${education.period}`;

const answerExperience = () => {
    const rows = experience.map((e) => `• **${e.role}** — ${e.org} (${e.period})\n  ${e.notes}`).join("\n\n");
    return `💼 **Experience:**\n\n${rows}`;
};

const answerSkills = () => {
    const cats = Object.entries(skillsByCategory)
        .filter(([, arr]) => arr.length)
        .map(([cat, arr]) => `**${cat}:** ${listSkills(arr)}`)
        .join("\n\n");
    return `💻 **Dave's tech stack** (grouped by area):\n\n${cats}`;
};

const answerFrontend = () =>
    `🎨 **Frontend:** ${listSkills(skillsByCategory["Frontend"])}. React and Tailwind are his primary tools.`;

const answerBackend = () =>
    `🛠️ **Backend:** ${listSkills(skillsByCategory["Backend"])}. Databases: ${listSkills(skillsByCategory["Database"])}.`;

const answerMobile = () => {
    const mobile = skillsByCategory["Mobile"] ?? [];
    if (!mobile.length) return `📱 Dave is starting to explore mobile development.`;
    const items = mobile.map((s) => `${s.name} (${SKILL_STATUS[s.status]?.label ?? s.status})`).join(", ");
    return `📱 **Mobile development:** ${items}. These are technologies he is currently learning.`;
};

const answerLocation = () =>
    `📍 Dave is based in **${profile.location}**. He's open to on-site, hybrid, and remote opportunities.`;

const answerAws = () => {
    const awsOrgs = community.filter((c) => /aws/i.test(c.organization))
        .map((c) => `• ${c.organization} — ${c.role}`).join("\n");
    return `☁️ **AWS & cloud:** ${aws.join(", ")}.\n\nHe built the **AWS Inventory Management Platform** (EC2, RDS, S3, VPC, Cognito, API Gateway, Amplify) and is active in AWS communities:\n${awsOrgs}`;
};

const answerItSupport = () =>
    `🧰 **IT support & systems:** ${itSupport.join(", ")}.\n\n**Networking:** ${networking.join(", ")}.`;

const answerNetworking = () =>
    `🌐 **Networking fundamentals:** ${networking.join(", ")}.`;

const answerCertifications = () =>
    `🏅 Dave has **${certifications.count} certificates**. Highlights:\n\n${certifications.highlights.map((h) => `• ${h}`).join("\n")}`;

const answerContact = () =>
    `📬 **Contact Dave:**\n• Email: ${contact.email}\n• Phone: ${contact.phone}\n• LinkedIn: ${contact.linkedin}\n• GitHub: ${contact.github}\n• Location: ${contact.location}`;

const answerLearning = () => {
    const items = currentlyLearning
        .map((s) => `• ${s.name} — ${SKILL_STATUS[s.status].label}`)
        .join("\n");
    return `📚 **Currently learning / exploring:**\n\n${items}\n\nHe also uses AI-assisted dev tools (Kiro, Cursor) to speed up development.`;
};

const answerOpenToWork = () =>
    `✅ Yes — ${profile.status} He's open to full-time roles, freelance projects, and collaborations. Reach him at ${contact.email}.`;

const answerAllProjects = () => {
    const list = projects.map((p) => `• **${p.name}** — ${p.description}`).join("\n");
    return `🚀 **Dave's projects:**\n\n${list}\n\nAsk about any one for its tech stack and the problem it solves.`;
};

const answerProject = (project) => {
    const live = project.live ? `\n🔗 Live: ${project.live}` : "";
    return `**${project.name}**\n${project.description}\n\n**Problem solved:** ${project.problem}\n**Tech:** ${project.tech.join(", ")}${live}`;
};

const fallback = () =>
    `I don't have that information in Dave's portfolio right now. You can ask me about his **profile, skills, projects, AWS/cloud experience, IT support background, communities, certifications, what he's currently learning, or how to contact him**.`;

const greeting = () =>
    `👋 Hi! I'm **DaveBot**. Ask me about Dave's skills, projects, AWS experience, community involvement, or how to reach him.`;

// ── Intent registry (scored by keyword hits) ────────────────────────────────
// Order matters only for ties; scoring picks the best match.

// priority: higher = more specific topic; used to break ties when hit counts are equal.
const intents = [
    { id: "greeting", priority: 1, keywords: ["hello", "hi", "hey", "kumusta", "kamusta", "good morning", "good afternoon", "good evening"], answer: greeting },
    // Community is a first-class intent — must beat generic/profile matching.
    { id: "community", priority: 9, keywords: ["community", "communities", "organization", "organizations", "orgs", "involved", "involvement", "devcon", "user group", "aws community", "pythonasia", "python asia", "n8n", "gdsc", "acss", "volunteer", "volunteering", "volunteered", "technopixel", "cyberph", "cyber ph", "hermes", "pyworks", "huawei", "hackathon"], answer: answerCommunity },
    { id: "aws", priority: 8, keywords: ["aws", "cloud", "ec2", "rds", "s3", "vpc", "cognito", "amplify", "api gateway"], answer: answerAws },
    { id: "itSupport", priority: 8, keywords: ["it support", "troubleshoot", "troubleshooting", "technical support", "help desk", "helpdesk", "hardware", "user support"], answer: answerItSupport },
    { id: "networking", priority: 8, keywords: ["networking", "tcp", "ip", "dns", "wifi", "wi-fi", "connectivity", "rbac"], answer: answerNetworking },
    { id: "frontend", priority: 7, keywords: ["frontend", "front-end", "front end", "react", "tailwind", "next.js", "nextjs"], answer: answerFrontend },
    { id: "backend", priority: 7, keywords: ["backend", "back-end", "back end", "server", "flask", "express", "postgres"], answer: answerBackend },
    { id: "learning", priority: 8, keywords: ["learning", "studying", "exploring", "react native", "kiro", "cursor"], answer: answerLearning },
    { id: "certifications", priority: 7, keywords: ["certificate", "certificates", "certification", "certifications", "cert", "achievement", "achievements"], answer: answerCertifications },
    { id: "education", priority: 6, keywords: ["education", "school", "college", "university", "degree", "bscs", "graduate", "university of the east"], answer: answerEducation },
    { id: "experience", priority: 5, keywords: ["experience", "work history", "work experience", "job", "internship", "intern", "employment", "jg superstore", "choco plug", "tltxtra", "harte hanks", "nba", "tsr", "freelance", "full-stack developer"], answer: answerExperience },
    { id: "mobile", priority: 8, keywords: ["mobile", "flutter", "dart", "react native", "mobile app", "mobile development", "mobile skills"], answer: answerMobile },
    { id: "location", priority: 8, keywords: ["location", "located", "based", "where is dave", "address", "quezon city", "baesa", "where do you live", "where are you"], answer: answerLocation },
    { id: "contact", priority: 7, keywords: ["contact", "email", "phone", "reach", "linkedin", "github", "get in touch"], answer: answerContact },
    { id: "openToWork", priority: 6, keywords: ["available", "open to work", "hire", "hiring", "freelance", "collaborate", "collaboration"], answer: answerOpenToWork },
    { id: "skills", priority: 4, keywords: ["skill", "skills", "tech stack", "technologies", "stack", "expertise", "programming languages"], answer: answerSkills },
    { id: "allProjects", priority: 4, keywords: ["projects", "proyekto", "built", "what did dave build", "apps", "applications"], answer: answerAllProjects },
    { id: "profile", priority: 3, keywords: ["who is dave", "who are you", "tell me about dave", "kind of developer", "positioning", "sino si dave", "dave punzalan"], answer: answerProfile },
];

// Match on word boundaries so "aws" doesn't hide behind "experience", and score
// by number of distinct keyword hits (not raw length). A per-intent priority
// breaks ties toward the more specific topic.
const matchesWord = (text, kw) => {
    if (kw.includes(" ")) return text.includes(kw);
    const re = new RegExp(`(^|[^a-z0-9])${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i");
    return re.test(text);
};

const scoreKeywords = (text, keywords) => {
    let hits = 0;
    for (const kw of keywords) {
        if (matchesWord(text, kw)) hits += 1;
    }
    return hits;
};

export const getResponse = (input) => {
    const text = (input || "").toLowerCase().trim();
    if (!text) return fallback();

    // 1) Specific project match wins if a project alias/name is mentioned.
    let bestProject = null;
    let bestProjectScore = 0;
    for (const p of projects) {
        const names = [p.name.toLowerCase(), ...(p.aliases || [])];
        const s = scoreKeywords(text, names);
        if (s > bestProjectScore) { bestProjectScore = s; bestProject = p; }
    }

    // 2) Intent scoring. Combine keyword hits with the intent's specificity
    //    priority so a specific topic (e.g. "aws") beats a generic word
    //    (e.g. "experience") when both appear.
    // Score = keyword hits (dominant) with the intent priority as a decimal
    // tiebreak, so a more specific topic wins when both matched equally often.
    let bestIntent = null;
    let bestIntentHits = 0;
    let bestIntentScore = 0;
    for (const intent of intents) {
        const hits = scoreKeywords(text, intent.keywords);
        if (hits === 0) continue;
        const s = hits + (intent.priority || 0) / 100;
        if (s > bestIntentScore) { bestIntentScore = s; bestIntentHits = hits; bestIntent = intent; }
    }

    // A concrete project reference beats a generic intent only when it matched
    // at least as strongly (same hit-based scale).
    if (bestProject && bestProjectScore >= bestIntentHits) {
        return answerProject(bestProject);
    }

    if (bestIntent) {
        return bestIntent.answer();
    }

    return fallback();
};
