// Centralized data for the "Beyond the Code" personal section.
// Keeps hobbies out of JSX so the section stays maintainable.
// Icon names map to lucide-react icons (already used across the project).

export const interestGroups = [
    {
        id: "creative",
        category: "Creative & Entertainment",
        icon: "Palette",
        description:
            "I enjoy creative activities and storytelling, whether that means drawing, cooking, singing, reading, watching films and series, or occasionally creating content.",
        interests: [
            { label: "Cooking", icon: "ChefHat" },
            { label: "Drawing", icon: "Pencil" },
            { label: "Singing", icon: "Mic2" },
            { label: "Books", icon: "BookOpen" },
            { label: "Comics", icon: "BookText" },
            { label: "Manga", icon: "BookMarked" },
            { label: "Movies", icon: "Clapperboard" },
            { label: "Anime", icon: "Tv2" },
            { label: "Series", icon: "MonitorPlay" },
            { label: "Art & Crafts", icon: "Scissors" },
            { label: "Occasional Content Creation", icon: "Video" },
        ],
    },
    {
        id: "sports",
        category: "Sports & Active Life",
        icon: "Activity",
        description:
            "I enjoy trying different sports and activities, from casual games with friends to cycling, running, gym sessions, and exploring new experiences.",
        interests: [
            { label: "Cycling", icon: "Bike" },
            { label: "Bowling", icon: "CircleDot" },
            { label: "Basketball", icon: "CircleDot" },
            { label: "Volleyball", icon: "Volleyball" },
            { label: "Soccer", icon: "Goal" },
            { label: "Badminton", icon: "Zap" },
            { label: "Baseball", icon: "CircleDashed" },
            { label: "Gym", icon: "Dumbbell" },
            { label: "Running", icon: "Footprints" },
            { label: "Motor Riding", icon: "Bike" },
        ],
    },
    {
        id: "puzzles",
        category: "Puzzles, Games & Challenges",
        icon: "Puzzle",
        description:
            "I enjoy challenges that require patience, strategy, problem-solving, experimentation, and persistence.",
        interests: [
            { label: "Puzzle Games", icon: "Puzzle" },
            { label: "Board Games", icon: "Dices" },
            { label: "Chess", icon: "Crown" },
            { label: "Rubik's Cube", icon: "Box" },
        ],
    },
];

// Highlighted "Always Exploring" card.
export const alwaysExploring = {
    title: "Always Exploring",
    icon: "Compass",
    description:
        "I love trying new things and exploring new experiences. Whether it's a new hobby, sport, activity, game, technology, or creative project, I enjoy learning by doing and stepping outside my comfort zone.",
};

// Standout personal detail — the cube collection.
export const cubeHighlight = {
    count: "60+",
    title: "Cubes Collected",
    icon: "Box",
    image: "assets/rubik.jpg",
    imageAlt: "Rubik's Cube solving",
    description:
        "A personal collection built from my interest in puzzles, problem-solving, and exploring different cube designs.",
};

// Small closing statement.
export const personalNote =
    "One thing you'll probably notice about me: I like exploring. I enjoy learning new things, trying unfamiliar activities, and seeing where curiosity takes me.";
