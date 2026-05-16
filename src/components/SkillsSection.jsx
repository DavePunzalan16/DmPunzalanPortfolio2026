import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
    // Frontend
    { name: "HTML/CSS", level: 98, category: "Frontend" }, 
    { name: "JavaScript", level: 95, category: "Frontend" }, 
    { name: "React", level: 90, category: "Frontend" },
    { name: "Typescript", level: 85, category: "Frontend" },
    { name: "Vue.js", level: 75, category: "Frontend" },
    { name: "Tailwind CSS", level: 90, category: "Frontend" }, 
    { name: "Next.js", level: 80, category: "Frontend" },
    // Backend
    { name: "Node.js", level: 85, category: "Backend" }, 
    { name: "PHP", level: 80, category: "Backend" }, 
    { name: "MySQL", level: 85, category: "Backend" }, 
    { name: "MongoDB", level: 70, category: "Backend" }, 
    { name: "Laravel", level: 65, category: "Backend" },

    // Programming Languages
    { name: "JavaScript", level: 95, category: "Programming Languages" },
    { name: "TypeScript", level: 85, category: "Programming Languages" },
    { name: "PHP", level: 80, category: "Programming Languages" },
    { name: "Python", level: 90, category: "Programming Languages" },
    { name: "Java", level: 65, category: "Programming Languages" },
    { name: "C++", level: 85, category: "Programming Languages" },
    { name: "Lua", level: 75, category: "Programming Languages" },

    // Tools
    { name: "Git", level: 90, category: "Tools" }, 
    { name: "GitHub", level: 85, category: "Tools" },
    { name: "Figma", level: 90, category: "Tools" },
    { name: "Vercel", level: 80, category: "Tools" },
    { name: "Netlify", level: 75, category: "Tools" },
    { name: "VS Code", level: 70, category: "Tools" },
    { name: "Docker", level: 65, category: "Tools" }, 
    { name: "AWS", level: 60, category: "Tools" }
];

const categories = ["all", "Frontend", "Backend", "Programming Languages", "Tools"];

export const SkillsSection = () => {
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredSkills = skills.filter(
        (skill) => activeCategory === "all" || skill.category === activeCategory
    );

    return ( 
        <section id="skills" className="py-24 px-4 relative bg-secondary/30">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    My <span className="text-primary">Skills</span>
                </h2>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category, key) => (
                        <button 
                            key={key}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                                activeCategory === category 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-secondary/70 text-foreground hover:bg-secondary"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredSkills.map((skill, index) => (
                        <div
                            key={index}
                            className="bg-card p-6 rounded-lg shadow-xs card-hover"
                        >
                            <div className="flex justify-between mb-4">
                                <h3 className="font-semibold text-lg">{skill.name}</h3>
                                <span className="text-sm text-muted-foreground">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${skill.level}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};