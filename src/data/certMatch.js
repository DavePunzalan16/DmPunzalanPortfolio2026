// ============================================================================
// Certificate ↔ image matching.
//  - Reads the build-time manifest (certImages.json) = source of truth on disk.
//  - Matches each image STEM to a certificate entry via an explicit ALIAS TABLE
//    first, then a token-based fuzzy fallback.
//  - Never drops an image: unmatched files become auto-generated cards.
//  - Never double-assigns an image.
//  - Produces a REPORT (logged once in dev) for verification.
// ============================================================================
import manifest from "@/data/certImages.json";

export const ITCON_TITLE = "IT Convention";
export const ITCON_PREFIX = "ITCON"; // ITCON1..ITCON6 → one card

// Explicit stem → certificate title keywords (from the brief's alias table).
// Keys are matched case-insensitively against the file stem (prefix-tolerant,
// because Explorer truncates some long names).
export const ALIAS_TABLE = {
    "5GEN_5G": "5GEN: The 5G Innovation Impact",
    "AdvancedExcel": "Advanced Excel: Unlocking Powerful Features and Functions",
    "ASONG_GUMAT_S": "Trails and Tails: The Fur Real Legacy Seminar",
    "AzureFundamentalsTraining": "Azure Fundamentals Training",
    "BuildingAIAgentsandAppswithAzureAIFoundry": "Building AI Agents and Apps with Azure AI Foundry",
    "BuildingAToDoAppwithFlask": "Building a ToDo App with Flask",
    "C.LCSC_Codesignal": "C++ Loops and Conditional Statements",
    "C.O.A_RCYC": "Certificate of Appreciation — RCYC Service Recognition",
    "C.O.A_YFA": "Certificate of Appreciation — Youth for Animals Executive Secretary",
    "C.O.M_ZENITH": "Certificate of Membership — UE Zenith",
    "C++_Codesignal": "C++ Basics",
    "CareerAccelerator": "Career Accelerator: Master your Resume, Interviews & Future Success!",
    "COC_WORKSHOP_PAID": "Code of Conduct Enforcement Workshop",
    "CODEACADEMY_JS.COURSE": "Learn JavaScript Course",
    "Codecademy_HTML": "Learn HTML Course",
    "CPR_CARAVAN_rCYC": "CPR Caravan: Life-Saving Skills Training",
    "CREATIVESCERT": "Creatives Committee for ENvision 2024–2025",
    "DSAcert": "Data Analyst Specialist Open House Mentoring Program",
    "EnhancingFlaskwithAdditionalFeatures": "Enhancing Flask with Additional Features",
    "ENSCantibullying": "Breaking the Silence: An Anti-Bullying Awareness Seminar",
    "ExcelWebinarPaid": "Introduction to Excel Webinar",
    "F.O.T_HACKTOBERFEST": "Fork-or-Treat: First PRs, No Scares for Hacktoberfest!",
    "Front-EndEngineeringwithReact": "Front-End Engineering with React",
    "FundamentalsOfPythonProgramming": "Fundamentals of Python Programming",
    "GDSC2023_UE": "GDSC UE 2023–2024 Membership Certificate",
    "GDSCFIGUI": "Designing the Future: UI/UX Exploration with FIGMA",
    "GDSCUEWebFoundations": "Web Foundations: Building the HTML Basics",
    "GettingDeeperintoReact": "Getting Deeper into React",
    "GettingStartedwithFlaskandWebDevelopment": "Getting Started with Flask and Web Development",
    "GettingStartedwithOpenAIWhisperAPIinPython": "Getting Started with OpenAI Whisper API in Python",
    "GSW_JAVA": "Getting Started with Java",
    "H.P_YFA": "Hearts & Paws: A Webinar on Compassionate Pet Ownership",
    "HASHINGPYTHON": "Hashing, Dictionaries, and Sets in Python",
    "HTML5_GAMEDEV": "HTML5 Game Development — Lessons and Development Planning",
    "HTMLCSSCoursera": "HTML and CSS in Depth",
    "HTMLCSS": "Introduction to HTML and CSS",
    "IntegratingASQLDatabasetoFlask": "Integrating a SQL Database to Flask",
    "Intro_FrontEndDev": "Introduction to Front-End Development",
    "INTRO_JS_REACT_DEV": "Intro to JavaScript for React Developers",
    "IntroductiontoWebDevelopmentinReact": "Introduction to Web Development in React",
    "iThinkHackathon": "iThink Hackathon Volunteer",
    "J.E.O.S": "Japanese Emotions & Onomatopoeia",
    "L.E.F.G.S": "Labor Education for Graduating Students",
    "L.S.D.S.A_Codesignal": "Learning Simple Data Structures in Java",
    "LF_PYTHON_FFMPEG_Codesignal": "Transcribing Large Files in Python using FFmpeg",
    "LINK.LIST.QUEE_PYTHON": "Linked Lists, Stacks, and Queues in Python",
    "LITS_ScanQuest": "LITS ScanQuest Amazing Race",
    "MASTERING_ALGO_DSA_PYTHON": "Mastering Algorithms and Data Structures in Python",
    "MasteringBusinessCommunicationWinClients": "Mastering Business Communication: Win Clients & Influence Teams",
    "MasteringEntraID_paid": "Mastering Entra ID",
    "MasteringEntraD_paid": "Mastering Entra ID",
    "Meta_React_Coursera": "React Basics",
    "MicrosoftCybersecurityAnalyst": "Microsoft Cybersecurity Analyst",
    "MicrosoftPowerBIDataAnalystCertification_DSA": "Microsoft Power BI Data Analyst Certification",
    "MVCtodoapp_flask_Codesignal": "Implementing MVC ToDo App with Flask",
    "NYFT_ACSS": "ACSSessment: Navigating Your Future in Tech",
    "O.AWS_RECAP2026": "Organizer — AWS Student re:Invent re:Cap 2026",
    "PAWS_Shelter_Visit": "PAWS Shelter Visit, Tour, and Cleaning",
    "Prog_JS": "Programming with JavaScript",
    "PrototypeFigma": "Prototyping with Figma: A Step-by-Step Guide",
    "PYTHONASIA2026_COV": "PythonAsia 2026 Volunteer Certificate",
    "R.P.E_Codesignal": "Revisiting Python Essentials",
    "RoutinginReactApplications": "Routing in React Applications",
    "S.E.W": "SkillBuilder Execution Workshop",
    "SecuringFlaskToDoAppwithSessionAuthentica": "Securing Flask ToDo App with Session Authentication",
    "SharpEN_BOP": "SharpEN: Battle of the Pens",
    "SLC": "Student Leaders Orientation",
    "SORTING_ALGO_PYTHON": "Sorting and Searching Algorithms in Python",
    "StudyJamsREPO": "Study Jams Repo Con",
    "TECH_EVERYWHERE_GDSC_LOYOLA": "Tech Everywhere 2025",
    "TREES_PYTHON": "Understanding and Using Trees in Python",
    "ULLER_UE": "Understanding Labor Laws & Employee Rights",
    "UnderstandingandUsingAPIsinReact": "Understanding and Using APIs in React",
    "VersionControl": "Version Control (Git & GitHub)",
    "WRP_UE": "Workplace Readiness and Professionalism",
    "YVFC_RCYC": "Youth Volunteer Formation Course (YVFC)",
};

// Stems flagged LOW CONFIDENCE in the brief (surface in the report).
export const LOW_CONFIDENCE = new Set(["SLC", "L.S.D.S.A_Codesignal", "DSAcert", "C.LCSC_Codesignal"]);

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const tokens = (s) => norm(s).split(" ").filter(Boolean);

// token-overlap score between an image stem and a certificate title+issuer.
const fuzzyScore = (stem, cert) => {
    const a = new Set(tokens(stem));
    const b = new Set([...tokens(cert.title), ...tokens(cert.issuer)]);
    let hits = 0;
    for (const t of a) if (b.has(t)) hits++;
    return hits / Math.max(1, a.size);
};

// Build a human title from a stem for orphan auto-cards.
const stemToTitle = (stem) =>
    stem.replace(/[_.]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim();

/**
 * Match manifest files to certificate entries.
 * @param {Array} certificates  the existing certificate data array
 * @returns {{ cards, itcon, report }}
 *   cards: certificate entries decorated with { image } (manifest url) or null
 *   itcon: { title, images[] } grouped ITCON card data
 *   report: diagnostics object
 */
export const matchCertificates = (certificates) => {
    const files = manifest.files || [];
    const usedFiles = new Set();

    // 1) ITCON group → one card.
    const itconFiles = files
        .filter((f) => f.stem.toUpperCase().startsWith(ITCON_PREFIX))
        .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
    itconFiles.forEach((f) => usedFiles.add(f.file));
    const itcon = { title: ITCON_TITLE, images: itconFiles.map((f) => f.url) };

    const singles = files.filter((f) => !f.stem.toUpperCase().startsWith(ITCON_PREFIX));

    // 2) Resolve each single file → a target certificate title (alias → fuzzy).
    const titleToFile = new Map(); // title -> manifest file
    const lowConfidence = [];
    const unresolved = [];

    const certByTitle = new Map(certificates.map((c) => [c.title, c]));
    const titlesLower = certificates.map((c) => ({ cert: c, lower: norm(c.title) }));

    // helper: alias lookup tolerant of Explorer truncation (prefix match)
    const aliasFor = (stem) => {
        if (ALIAS_TABLE[stem]) return ALIAS_TABLE[stem];
        const sl = stem.toLowerCase();
        for (const key of Object.keys(ALIAS_TABLE)) {
            const kl = key.toLowerCase();
            if (sl.startsWith(kl) || kl.startsWith(sl)) return ALIAS_TABLE[key];
        }
        return null;
    };

    for (const f of singles) {
        let targetTitle = aliasFor(f.stem);

        if (targetTitle && !certByTitle.has(targetTitle)) {
            // alias points to a title that isn't an existing entry — keep it,
            // we'll create an auto-card for it below (so the image still shows).
        } else if (!targetTitle) {
            // fuzzy fallback against existing certificate titles/issuers
            let best = null, bestScore = 0;
            for (const { cert } of titlesLower) {
                if (titleToFile.has(cert.title)) continue; // already taken
                const s = fuzzyScore(f.stem, cert);
                if (s > bestScore) { bestScore = s; best = cert; }
            }
            if (best && bestScore >= 0.34) { targetTitle = best.title; lowConfidence.push({ file: f.file, title: best.title, score: +bestScore.toFixed(2) }); }
        }

        if (targetTitle && !titleToFile.has(targetTitle)) {
            titleToFile.set(targetTitle, f);
            usedFiles.add(f.file);
            if (LOW_CONFIDENCE.has(f.stem)) lowConfidence.push({ file: f.file, title: targetTitle, flagged: true });
        } else {
            unresolved.push(f);
        }
    }

    // 3) Decorate existing certificate entries with their image url.
    const cards = certificates.map((c) => ({
        ...c,
        image: titleToFile.get(c.title)?.url || null,
    }));

    // 4) Orphan images → auto-cards (never drop an image).
    const existingTitles = new Set(certificates.map((c) => c.title));
    const autoCards = [];
    // 4a) alias titles that have no matching entry but DID claim a file
    for (const [title, f] of titleToFile.entries()) {
        if (!existingTitles.has(title)) {
            autoCards.push({
                title, issuer: "Unknown", date: "", category: "Seminars & Events",
                tag: "Needs details", image: f.url, autoCard: true,
            });
        }
    }
    // 4b) files that matched nothing at all
    for (const f of unresolved) {
        usedFiles.add(f.file);
        autoCards.push({
            title: stemToTitle(f.stem), issuer: "Unknown", date: "", category: "Seminars & Events",
            tag: "Needs details", image: f.url, autoCard: true,
        });
    }

    // 5) Report.
    const unmatchedEntries = cards.filter((c) => !c.image).map((c) => c.title);
    const report = {
        totalFilesOnDisk: files.length,
        itconFiles: itconFiles.length,
        singleFiles: singles.length,
        cardsRendered: cards.length + autoCards.length + 1, // +1 = ITCON card
        usedFiles: usedFiles.size,
        unmatchedFiles: singles.filter((f) => !usedFiles.has(f.file)).map((f) => f.file),
        unmatchedEntries,
        autoCards: autoCards.map((c) => c.title),
        lowConfidence,
    };

    return { cards: [...cards, ...autoCards], itcon, report };
};
