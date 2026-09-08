import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
    Palette, ChefHat, Pencil, Mic2, BookOpen, BookText, BookMarked,
    Clapperboard, Tv2, MonitorPlay, Scissors, Video,
    Activity, Bike, CircleDot, Volleyball, Goal, Zap,
    CircleDashed, Dumbbell, Footprints,
    Puzzle, Dices, Crown, Box, Compass, Heart, ChevronDown, Circle,
} from "lucide-react";
import {
    interestGroups,
    alwaysExploring,
    cubeHighlight,
    personalNote,
} from "@/data/interests";

// Only the icons referenced by the interests data (keeps the bundle small).
const ICONS = {
    Palette, ChefHat, Pencil, Mic2, BookOpen, BookText, BookMarked,
    Clapperboard, Tv2, MonitorPlay, Scissors, Video,
    Activity, Bike, CircleDot, Volleyball, Goal, Zap,
    CircleDashed, Dumbbell, Footprints,
    Puzzle, Dices, Crown, Box, Compass,
};

// Resolve a lucide icon by name, falling back to a neutral dot.
const Icon = ({ name, ...props }) => {
    const Cmp = ICONS[name] ?? Circle;
    return <Cmp {...props} />;
};

const usePrefersReducedMotion = () => {
    // Lazy-init from the media query so reduced-motion users never see the
    // reveal animation, even on the first render.
    const [reduced, setReduced] = useState(
        () => typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(mq.matches);
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);
    return reduced;
};

// Reveal-on-scroll wrapper (respects reduced motion).
const Reveal = ({ children, delay = 0, reduced, className }) => {
    const ref = useRef(null);
    // When reduced motion is on, start visible (no reveal animation needed).
    const [shown, setShown] = useState(() => reduced);

    useEffect(() => {
        if (reduced) return; // already shown, nothing to observe
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [reduced]);

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-700 ease-out",
                shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                className
            )}
            style={{ transitionDelay: reduced ? "0ms" : `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const InterestTag = ({ label, icon }) => (
    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-full border border-border bg-secondary/60 text-foreground/80 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 transition-all duration-200">
        <Icon name={icon} size={14} aria-hidden="true" className="text-primary/80" />
        {label}
    </span>
);

const InterestCard = ({ group, reduced, delay }) => {
    const [open, setOpen] = useState(false);
    // Show first few tags collapsed; reveal the rest on expand.
    const PREVIEW = 6;
    const hasMore = group.interests.length > PREVIEW;
    const visible = open ? group.interests : group.interests.slice(0, PREVIEW);

    return (
        <Reveal reduced={reduced} delay={delay}>
            <div className="gradient-border rounded-2xl p-5 sm:p-6 h-full card-hover">
                <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                        <Icon name={group.icon} size={20} aria-hidden="true" className="text-primary" />
                    </div>
                    <div className="min-w-0 text-left">
                        <h3 className="text-base sm:text-lg font-semibold leading-snug">{group.category}</h3>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed text-left mb-4">
                    {group.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {visible.map((it) => (
                        <InterestTag key={it.label} label={it.label} icon={it.icon} />
                    ))}
                </div>

                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                        {open ? "Show less" : `Show ${group.interests.length - PREVIEW} more`}
                        <ChevronDown
                            size={14}
                            aria-hidden="true"
                            className={cn("transition-transform duration-300", open && "rotate-180")}
                        />
                    </button>
                )}
            </div>
        </Reveal>
    );
};

export const BeyondTheCode = () => {
    const reduced = usePrefersReducedMotion();

    return (
        <section id="beyond-the-code" className="py-16 sm:py-20 md:py-24 px-4 relative">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <Reveal reduced={reduced}>
                    <div className="text-center mb-10 md:mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                            <Heart className="h-4 w-4" aria-hidden="true" />
                            The Human Side
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Beyond the <span className="text-primary">Code</span>
                        </h2>
                        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                            Technology is a big part of my life, but I also enjoy exploring creative
                            hobbies, sports, challenges, and new experiences.
                        </p>
                    </div>
                </Reveal>

                {/* Interest cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-6">
                    {interestGroups.map((group, i) => (
                        <InterestCard
                            key={group.id}
                            group={group}
                            reduced={reduced}
                            delay={i * 120}
                        />
                    ))}
                </div>

                {/* Highlight row: Always Exploring + Cube collection */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                    {/* Always Exploring — spans wider on desktop */}
                    <Reveal reduced={reduced} delay={120} className="lg:col-span-2">
                        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 h-full border border-primary/30 bg-primary/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/25 shrink-0">
                                    <Icon name={alwaysExploring.icon} size={22} aria-hidden="true" className="text-primary" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-left">{alwaysExploring.title}</h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-left">
                                {alwaysExploring.description}
                            </p>
                        </div>
                    </Reveal>

                    {/* Cube collection highlight */}
                    <Reveal reduced={reduced} delay={200}>
                        <div className="rounded-2xl p-6 sm:p-8 h-full border border-border bg-card text-center flex flex-col items-center justify-center card-hover">
                            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-3">
                                <Icon name={cubeHighlight.icon} size={26} aria-hidden="true" className="text-primary" />
                            </div>
                            <div className="text-4xl sm:text-5xl font-bold text-primary leading-none mb-1">
                                {cubeHighlight.count}
                            </div>
                            <div className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-3">
                                {cubeHighlight.title}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {cubeHighlight.description}
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Personal note */}
                <Reveal reduced={reduced} delay={120}>
                    <p className="text-center text-sm sm:text-base text-muted-foreground italic max-w-3xl mx-auto mt-10">
                        “{personalNote}”
                    </p>
                </Reveal>
            </div>
        </section>
    );
};
