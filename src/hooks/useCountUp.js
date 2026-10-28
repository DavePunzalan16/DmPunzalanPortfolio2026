// Dependency-free count-up hook (Task A).
// Animates a numeric target ONCE when the returned ref's element scrolls into
// view (IntersectionObserver), over ~1.2s with an ease-out curve, preserving a
// trailing suffix such as the "+" in "10+". Respects prefers-reduced-motion by
// showing the final value instantly (no requestAnimationFrame loop).
import { useEffect, useRef, useState } from "react";

const DURATION = 1200; // ms
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Parse "10+" -> { value: 10, suffix: "+", prefix: "" }. Falls back gracefully.
const parseTarget = (target) => {
    const str = String(target ?? "");
    const match = str.match(/-?\d+(\.\d+)?/);
    if (!match) return { value: 0, prefix: "", suffix: str, decimals: 0 };
    const num = parseFloat(match[0]);
    const idx = match.index ?? 0;
    const decimals = match[1] ? match[1].length - 1 : 0;
    return {
        value: num,
        prefix: str.slice(0, idx),
        suffix: str.slice(idx + match[0].length),
        decimals,
    };
};

const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const useCountUp = (target) => {
    const { value, prefix, suffix, decimals } = parseTarget(target);
    const finalStr = `${prefix}${value.toFixed(decimals)}${suffix}`;
    const ref = useRef(null);
    // Initialize to the final value under reduced motion (no animation/effect
    // setState needed); otherwise start at zero and animate.
    const [display, setDisplay] = useState(() =>
        prefersReduced() ? finalStr : `${prefix}${(0).toFixed(decimals)}${suffix}`
    );
    const hasRun = useRef(false);

    useEffect(() => {
        // Reduced motion: value is already final from the initializer; skip.
        if (prefersReduced()) {
            hasRun.current = true;
            return;
        }

        const el = ref.current;
        if (!el || hasRun.current) return;

        let rafId = null;
        let startTs = null;

        const run = () => {
            const step = (ts) => {
                if (startTs === null) startTs = ts;
                const progress = Math.min((ts - startTs) / DURATION, 1);
                const current = value * easeOut(progress);
                setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
                if (progress < 1) {
                    rafId = requestAnimationFrame(step);
                } else {
                    setDisplay(finalStr);
                }
            };
            rafId = requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasRun.current) {
                        hasRun.current = true;
                        run();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);

    return [ref, display];
};

export default useCountUp;
