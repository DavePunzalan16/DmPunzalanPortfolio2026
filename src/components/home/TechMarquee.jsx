// Tech-stack marquee (Task C). Slow seamless infinite horizontal strip between
// the hero and the preview grid. Pure-CSS loop (no JS timers/rAF): the list is
// rendered TWICE back-to-back and the track translates by -50%. The duplicate
// half is aria-hidden. Pauses on hover/focus; respects reduced motion.
import { skills } from "@/data/skills";
import "@/components/home/tech-marquee.css";

export const TechMarquee = () => {
    const items = Array.isArray(skills) ? skills.map((s) => s.name) : [];

    if (items.length === 0) {
        console.warn("[TechMarquee] skills data source is empty/missing (src/data/skills.js)");
        return null;
    }

    const renderGroup = (hidden) => (
        <div className="mq-group" aria-hidden={hidden ? "true" : undefined}>
            {items.map((name, i) => (
                <span key={`${name}-${i}`} className="mq-pill">{name}</span>
            ))}
        </div>
    );

    return (
        <div className="mq-outer">
            <span className="mq-label">Tech I use</span>
            <div className="mq-wrap" aria-label="Tech stack" role="group">
                <div className="mq-track">
                    {renderGroup(false)}
                    {renderGroup(true)}
                </div>
            </div>
        </div>
    );
};

export default TechMarquee;
