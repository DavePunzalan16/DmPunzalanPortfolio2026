import { useEffect, useRef } from "react";

/**
 * Thin scroll progress bar fixed at the very top, above the navbar.
 * - Fills left→right as the page scrolls (0% top → 100% bottom).
 * - Passive scroll listener + requestAnimationFrame, animated via transform: scaleX
 *   (transform-origin: left) for performance — no layout thrash, no library.
 * - aria-hidden + pointer-events-none so it never blocks interaction.
 */
export const ScrollProgress = () => {
    const barRef = useRef(null);
    const tickingRef = useRef(false);

    useEffect(() => {
        const update = () => {
            const el = barRef.current;
            if (el) {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const height =
                    document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const progress = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0;
                el.style.transform = `scaleX(${progress})`;
            }
            tickingRef.current = false;
        };

        const onScroll = () => {
            if (!tickingRef.current) {
                tickingRef.current = true;
                requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
        >
            <div
                ref={barRef}
                className="h-full w-full origin-left"
                style={{
                    transform: "scaleX(0)",
                    background:
                        "linear-gradient(to right, hsl(var(--primary)), #60a5fa)",
                    boxShadow: "0 0 10px hsl(var(--primary) / 0.6), 0 0 4px #60a5fa",
                }}
            />
        </div>
    );
};
