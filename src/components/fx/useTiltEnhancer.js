import { useEffect } from "react";

/**
 * Isolated 3D tilt + glare enhancer.
 * Opt-in: any element with [data-fx-tilt] inside the given container ref gets
 * a mouse-based tilt + glare. CSS lives in index.css (.fx-tilt / .fx-tilt__glare).
 *
 * - Disabled on touch devices and under prefers-reduced-motion (no listeners).
 * - Does NOT alter existing hover styles or links (tilt is applied via CSS vars
 *   on a wrapping transform; pointer events pass through to children).
 * - Fully cleans up its listeners on unmount.
 */
export const useTiltEnhancer = (containerRef, depKey) => {
    useEffect(() => {
        const root = containerRef.current;
        if (!root) return;
        const noHover = window.matchMedia("(hover: none)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (noHover || reduced) return;

        const cards = Array.from(root.querySelectorAll("[data-fx-tilt]"));
        const cleanups = [];
        const MAX = 6; // degrees

        cards.forEach((card) => {
            card.classList.add("fx-tilt");
            const glare = document.createElement("span");
            glare.className = "fx-tilt__glare";
            card.appendChild(glare);

            const onMove = (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                card.style.setProperty("--fx-ry", `${(px - 0.5) * 2 * MAX}deg`);
                card.style.setProperty("--fx-rx", `${-(py - 0.5) * 2 * MAX}deg`);
                card.style.setProperty("--fx-gx", `${px * 100}%`);
                card.style.setProperty("--fx-gy", `${py * 100}%`);
            };
            const onEnter = () => card.classList.add("is-tilting");
            const onLeave = () => {
                card.classList.remove("is-tilting");
                card.style.setProperty("--fx-rx", "0deg");
                card.style.setProperty("--fx-ry", "0deg");
            };

            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
                card.removeEventListener("mousemove", onMove);
                card.removeEventListener("mouseenter", onEnter);
                card.removeEventListener("mouseleave", onLeave);
                card.classList.remove("fx-tilt", "is-tilting");
                glare.remove();
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, [containerRef, depKey]);
};
