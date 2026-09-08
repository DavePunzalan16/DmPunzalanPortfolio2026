import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, Orbit, Info, Hand, GraduationCap } from "lucide-react";
import { skills, skillCategories, SKILL_STATUS, currentlyLearning } from "@/data/skills";
import { SkillsFloat } from "@/components/SkillsFloat";
import { SkillCard } from "@/components/SkillCard";

const filters = ["All", ...skillCategories];

// Detect reduced-motion so we can default to the accessible grid.
const useAccessibilityPrefs = () => {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    return { reduced };
};

export const SkillsSection = () => {
    const { reduced } = useAccessibilityPrefs();
    const [activeCategory, setActiveCategory] = useState("All");
    const [selected, setSelected] = useState(null);
    // view: "float" | "grid". Default to grid on reduced-motion (still float-capable on mobile).
    const [view, setView] = useState("float");
    const [inView, setInView] = useState(false);
    const sectionRef = useRef(null);

    const effectiveView = reduced ? "grid" : view;

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const filteredSkills = useMemo(
        () => skills.filter((s) => activeCategory === "All" || s.category === activeCategory),
        [activeCategory]
    );

    const selStatus = selected ? SKILL_STATUS[selected.status] ?? SKILL_STATUS.EXPLORING : null;

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="py-16 sm:py-20 md:py-24 px-4 relative bg-secondary/30"
        >
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        My <span className="text-primary">Skills</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        A floating map of the technologies I work with — grouped by area and labelled
                        honestly by how I actually use them, from primary tools to what I'm exploring.
                    </p>
                </div>

                {/* Controls: filters + view toggle */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                        {filters.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors duration-300 border",
                                    activeCategory === cat
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-secondary/70 text-foreground hover:bg-secondary border-border/50"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {!reduced && (
                        <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/70 border border-border/50 self-center shrink-0">
                            <button
                                onClick={() => setView("float")}
                                aria-pressed={view === "float"}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-300",
                                    view === "float" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Orbit size={15} /> Float
                            </button>
                            <button
                                onClick={() => setView("grid")}
                                aria-pressed={view === "grid"}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-300",
                                    view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <LayoutGrid size={15} /> Grid
                            </button>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
                    {Object.values(SKILL_STATUS).map((s) => (
                        <span key={s.id} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className={cn("w-2 h-2 rounded-full", s.dot)} />
                            {s.label}
                        </span>
                    ))}
                </div>

                {/* Main content */}
                {effectiveView === "float" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-stretch">
                        <div className="flex flex-col">
                            {inView ? (
                                <SkillsFloat
                                    key={activeCategory}
                                    skills={filteredSkills}
                                    selected={selected}
                                    onSelect={setSelected}
                                    reducedMotion={reduced}
                                />
                            ) : (
                                <div className="h-[420px] sm:h-[460px] rounded-2xl border border-border/50 bg-card/30" />
                            )}
                            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
                                <Hand size={13} /> Drag to reposition • tap a skill for details
                            </p>
                        </div>

                        {/* Details panel */}
                        <div className="gradient-border rounded-2xl p-6 text-left flex flex-col justify-center min-h-[200px]">
                            {selected ? (
                                <>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-bold">{selected.name}</h3>
                                        <span className={cn("text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border", selStatus.badge)}>
                                            {selStatus.label}
                                        </span>
                                    </div>
                                    <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3 w-fit">
                                        {selected.category}
                                    </span>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                        {selected.description}
                                    </p>
                                    {selected.projects?.length > 0 && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Used in</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selected.projects.map((p) => (
                                                    <span key={p} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-foreground/80 border border-border/50">
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Info className="h-8 w-8 mx-auto mb-3 text-primary/60" />
                                    <p className="text-sm">Tap a floating technology to see how I use it and where.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSkills.map((skill) => (
                            <SkillCard
                                key={skill.name}
                                skill={skill}
                                active={selected?.name === skill.name}
                                onClick={() => setSelected(selected?.name === skill.name ? null : skill)}
                            />
                        ))}
                    </div>
                )}

                {/* Currently Learning strip */}
                {currentlyLearning.length > 0 && (
                    <div className="mt-8 gradient-border rounded-2xl p-5 sm:p-6">
                        <h3 className="flex items-center gap-2 text-base font-semibold mb-3">
                            <GraduationCap size={18} className="text-primary" />
                            Currently Learning & Exploring
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {currentlyLearning.map((s) => {
                                const st = SKILL_STATUS[s.status];
                                return (
                                    <span key={s.name} className={cn("text-xs font-medium px-3 py-1.5 rounded-full border", st.badge)}>
                                        {s.name} · {st.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
