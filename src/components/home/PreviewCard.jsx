// Preview card shell (Task B, polished). ONE <a href="#section"> that reuses
// the existing hash router (src/lib/pagedViews.js global click listener).
// Consistent anatomy: header (numbered eyebrow + icon chip + title) → preview
// (flex:1, left-aligned) → footer (muted caption + circular arrow button).
// The cursor-glow border/spotlight is CSS-driven via --mx/--my set by ONE
// delegated pointermove listener on the grid (see PreviewGrid). No per-card JS,
// no re-renders, no tilt. Touch/reduced-motion get a pressed state only.
import { ArrowRight } from "lucide-react";

export const PreviewCard = ({ href, icon: Icon, title, caption, index = 0, wide = false, certSpin = false, children }) => {
    const eyebrow = String(index + 1).padStart(2, "0");
    return (
        <a
            href={href}
            aria-label={`Open ${title} section`}
            className={`pv-card${wide ? " pv-card--wide" : ""}${certSpin ? " pv-card--spin" : ""}`}
            style={{ "--pv-i": index }}
        >
            <span className="pv-card__head">
                <span className="pv-card__eyebrow" aria-hidden="true">{eyebrow}</span>
                <span className="pv-card__icon" aria-hidden="true">
                    {Icon ? <Icon size={18} /> : null}
                </span>
                <span className="pv-card__title">{title}</span>
            </span>

            <span className="pv-card__preview">{children}</span>

            <span className="pv-card__foot">
                <span className="pv-card__caption">{caption}</span>
                <span className="pv-go" aria-hidden="true">
                    <ArrowRight size={16} />
                </span>
            </span>
        </a>
    );
};

export default PreviewCard;
