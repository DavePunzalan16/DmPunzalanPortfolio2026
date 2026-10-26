// ============================================================================
// Certificate image mapping + config.
//
// NOTE ON MATCHING: the files in /public/Certs are NOT named
// "<Title> - <ACRONYM>.jpg" as the brief assumed — they are compact slugs /
// acronyms (e.g. "S.E.W.jpg", "MASTERING_ALGO_DSA_PYTHON.jpg",
// "Front-EndEngineeringwithReact.jpg"). Automated fuzzy title→file matching
// therefore cannot work reliably, so each certificate is mapped to its real
// file EXPLICITLY below. Entries with no image fall back to a placeholder card.
//
// The folder on disk is "Certs" (capital C) — referenced with that exact case
// because Vercel's Linux filesystem is case-sensitive.
// ============================================================================

export const CERTS_DIR = "assets/Certs";

// Map: exact certificate title -> filename in /public/Certs
export const certImageByTitle = {
    // ── Cloud & Cybersecurity ──
    "Organizer — AWS Student re:Invent re:Cap 2026": "O.AWS_RECAP2026.jpg",
    "Azure Fundamentals Training": "AzureFundamentalsTraining.jpg",
    "Building AI Agents and Apps with Azure AI Foundry": "BuildingAIAgentsandAppswithAzureAIFoundry.jpg",
    "Mastering Entra ID": "MasteringEntraID_paid.jpg",
    "Microsoft Cybersecurity Analyst": "MicrosoftCybersecurityAnalyst.jpg",

    // ── AI & Data Analytics ──
    "Microsoft Power BI Data Analyst Certification": "MicrosoftPowerBIDataAnalystCertification_DSA.jpg",
    "Data Analyst Specialist Open House Mentoring Program": "ASONG_GUMAT_S.jpg",
    "Fundamentals of Python Programming": "FundamentalsOfPythonProgramming.jpg",
    "Getting Started with OpenAI Whisper API in Python": "GettingStartedwithOpenAIWhisperAPIinPython_Codesignal.jpg",
    "Transcribing Large Files in Python using FFmpeg": "LF_PYTHON_FFMPEG_Codesignal.jpg",
    "Tech Everywhere 2025": "TECH_EVERYWHERE_GDSC_LOYOLA.jpg",

    // ── Front-End & Web Dev ──
    "Front-End Engineering with React": "Front-EndEngineeringwithReact.jpg",
    "Introduction to Web Development in React": "IntroductiontoWebDevelopmentinReact_Codesignal.jpg",
    "Getting Deeper into React": "GettingDeeperintoReact.jpg",
    "Understanding and Using APIs in React": "UnderstandingandUsingAPIsinReact.jpg",
    "Routing in React Applications": "RoutinginReactApplications.jpg",
    "React Basics": "Meta_React_Coursera.jpeg",
    "Introduction to Front-End Development": "Intro_FrontEndDev.jpeg",
    "HTML and CSS in Depth": "HTMLCSSCoursera.jpeg",
    "Learn HTML Course": "Codecademy_HTML.jpg",
    "Introduction to HTML and CSS": "HTMLCSS.jpg",
    "Web Foundations: Building the HTML Basics": "GDSCUEWebFoundations.png",
    "Designing the Future: UI/UX Exploration with FIGMA": "GDSCFIGUI.jpg",
    "Prototyping with Figma: A Step-by-Step Guide": "PrototypeFigma.jpg",

    // ── Backend & Flask ──
    "Getting Started with Flask and Web Development": "GettingStartedwithFlaskandWebDevelopment.jpg",
    "Building a ToDo App with Flask": "BuildingAToDoAppwithFlask.jpg",
    "Integrating a SQL Database to Flask": "IntegratingASQLDatabasetoFlask_Codesignal.jpg",
    "Securing Flask ToDo App with Session Authentication": "SecuringFlaskToDoAppwithSessionAuthentication_Codesignal.jpg",
    "Enhancing Flask with Additional Features": "EnhancingFlaskwithAdditionalFeatures.jpg",
    "Implementing MVC ToDo App with Flask": "MVCtodoapp_flask_Codesignal.jpg",

    // ── Programming & CS ──
    "Revisiting Python Essentials": "R.P.E_Codesignal.jpg",
    "Mastering Algorithms and Data Structures in Python": "MASTERING_ALGO_DSA_PYTHON.jpg",
    "Sorting and Searching Algorithms in Python": "SORTING_ALGO_PYTHON.jpg",
    "Linked Lists, Stacks, and Queues in Python": "LINK.LIST.QUEE_PYTHON.jpg",
    "Understanding and Using Trees in Python": "TREES_PYTHON.jpg",
    "Hashing, Dictionaries, and Sets in Python": "HASHINGPYTHON.jpg",
    "Getting Started with Java": "GSW_JAVA.jpg",
    "Learning Simple Data Structures in Java": "L.S.D.S.A_Codesignal.jpg",
    "Programming with JavaScript": "Prog_JS.jpeg",
    "Intro to JavaScript for React Developers": "INTRO_JS_REACT_DEV.jpg",
    "Learn JavaScript Course": "CODEACADEMY_JS.COURSE.jpg",
    "C++ Basics": "C++_Codesignal.jpg",
    "C++ Loops and Conditional Statements": "C.LCSC_Codesignal.jpg",
    "Version Control (Git & GitHub)": "VersionControl.jpeg",

    // ── Leadership & Volunteer ──
    "Certificate of Appreciation — Youth for Animals Executive Secretary": "C.O.A_YFA.jpg",
    "PAWS Shelter Visit, Tour, and Cleaning": "PAWS_Shelter_Visit,_Tour,_and_Cleaning_Certificate.jpg",
    "Hearts & Paws: A Webinar on Compassionate Pet Ownership": "H.P_YFA.jpg",
    "Certificate of Appreciation — RCYC Service Recognition": "C.O.A_RCYC.jpg",
    "Youth Volunteer Formation Course (YVFC)": "YVFC_RCYC.jpg",
    "CPR Caravan: Life-Saving Skills Training": "CPR_CARAVAN_rCYC.jpg",
    "PythonAsia 2026 Volunteer Certificate": "PYTHONASIA2026_COV.jpg",
    "Code of Conduct Enforcement Workshop": "COC_WORKSHOP_PAID.jpg",
    "Certificate of Membership — UE Zenith": "C.O.M_ZENITH.jpg",
    "Student Leaders Orientation": "SLC.jpg",
    "Creatives Committee for ENvision 2024–2025": "CREATIVESCERT.jpg",
    "iThink Hackathon Volunteer": "iThinkHackathon.jpg",
    "GDSC UE 2023–2024 Membership Certificate": "GDSC2023_UE.jpg",

    // ── Career & Workshops ──
    "Labor Education for Graduating Students": "L.E.F.G.S.jpg",
    "Workplace Readiness and Professionalism": "WRP_UE.jpg",
    "Understanding Labor Laws & Employee Rights": "ULLER_UE.jpg",
    "Career Accelerator: Master your Resume, Interviews & Future Success!": "CareerAccelerator.jpg",
    "Mastering Business Communication: Win Clients & Influence Teams": "MasteringBusinessCommunicationWinClientsinfluenceTeams.jpg",
    "Introduction to Excel Webinar": "ExcelWebinarPaid.jpg",
    "Advanced Excel: Unlocking Powerful Features and Functions": "AdvancedExcelUnlockingPowerfulFeaturesFunctions.jpg",
    "ACSSessment: Navigating Your Future in Tech": "NYFT_ACSS.jpg",
    "5GEN: The 5G Innovation Impact": "5GEN_5G.jpg",
    "Breaking the Silence: An Anti-Bullying Awareness Seminar": "ENSCantibullying.jpg",

    // ── Competitions & Events ──
    "Fork-or-Treat: First PRs, No Scares for Hacktoberfest!": "F.O.T_HACKTOBERFEST.jpg",
    "Study Jams Repo Con": "StudyJamsREPO.jpg",
    "SharpEN: Battle of the Pens": "SharpEN_BOP.jpg",
    "LITS ScanQuest Amazing Race": "LITS_ScanQuest.jpg",
    // "IT Convention" is a multi-image certificate — see ITCON_IMAGES below.
    "HTML5 Game Development — Lessons and Development Planning": "HTML5_GAMEDEV.jpg",
};

// Multi-image certificate: IT Convention (6 photos). Rendered as ONE card
// with a stacked-pages effect + gallery. The matching title in the data is
// "IT Convention".
export const ITCON_TITLE = "IT Convention";
export const ITCON_IMAGES = [
    "ITCON1.jpg",
    "ITCON2.jpg",
    "ITCON3.jpg",
    "ITCON4.jpg",
    "ITCON5.jpg",
    "ITCON6.jpg",
];

// Featured certificates pinned to the top (brief's list).
export const FEATURED_TITLES = [
    "Microsoft Cybersecurity Analyst",
    "Microsoft Power BI Data Analyst Certification",
    "React Basics",
    "Front-End Engineering with React",
    "Mastering Algorithms and Data Structures in Python",
    "SkillBuilder Execution Workshop", // AWS SkillBuilder Execution Workshop (S.E.W.jpg) — see note
];

// Helper: resolve + URL-encode an image path for a given filename.
export const certImageUrl = (filename) => {
    if (!filename) return null;
    // Encode each path segment so spaces, &, !, commas, etc. are safe.
    return `${CERTS_DIR}/${encodeURIComponent(filename)}`;
};
