// Preview card shell (Task B). ONE <a href="#section"> that reuses the existing
// hash router (src/lib/pagedViews.js global click listener). Adds a 3D tilt +
// glare on hover-capable, fine-pointer devices only; touch/no-hover/reduced-
// motion get just a pressed state. Entrance stagger is driven by the parent
// grid toggling `.is-in` + the per-card `--pv-i` index.
import { useCallback, useRef } from "react";
import { ArrowRight } from "lucide-react";

const MAX_TILT = 6; // degrees per axis

// Only tilt when the device is hover-capable + fine-pointer AND motion allowed.
const canTilt = () => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return (
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
};

export const PreviewCard = ({ href, icon: Icon, title, caption, index = 0, wide = false, children }) => {
    const ref = useRef(null);
    const tiltOn = useRef(false);

    const handlePointerMove = useCallback((e) => {
        const el = ref.current;
        if (!el || !canTilt()) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height; // 0..1
        const ry = (px - 0.5) * 2 * MAX_TILT; // left/right
        const rx = -(py - 0.5) * 2 * MAX_TILT; // up/down
        el.style.setProperty("--pv-rx", `${rx.toFixed(2)}deg`);
        el.style.setProperty("--pv-ry", `${ry.toFixed(2)}deg`);
        el.style.setProperty("--pv-gx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--pv-gy", `${(py * 100).toFixed(1)}%`);
        if (!tiltOn.current) { el.classList.add("is-tilting"); tiltOn.current = true; }
    }, []);

    const handlePointerLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--pv-rx", "0deg");
        el.style.setProperty("--pv-ry", "0deg");
        el.classList.remove("is-tilting");
        tiltOn.current = false;
    }, []);

    return (
        <a
            ref={ref}
            href={href}
            aria-label={`Open ${title} section`}
            className={`pv-card${wide ? " pv-card--wide" : ""}`}
            style={{ "--pv-i": index }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <span className="pv-card__glare" aria-hidden="true" />
            <span className="pv-card__head">
                <span className="pv-card__icon" aria-hidden="true">
                    {Icon ? <Icon size={18} /> : null}
                </span>
                {title}
            </span>
            <span className="pv-card__preview">{children}</span>
            {caption ? <span className="pv-card__caption">{caption}</span> : null}
            <span className="pv-card__open" aria-hidden="true">
                Open <ArrowRight size={14} />
            </span>
        </a>
    );
};

export default PreviewCard;
