// Shared arcade helpers — storage, seeded PRNG, reduced-motion, canvas DPR.

export const bestKey = (gameId) => `portfolio-arcade:${gameId}:best`;

export const loadBest = (gameId) => {
    try {
        const v = localStorage.getItem(bestKey(gameId));
        return v ? Number(v) || 0 : 0;
    } catch {
        return 0;
    }
};

export const saveBest = (gameId, value) => {
    try {
        const cur = loadBest(gameId);
        if (value > cur) localStorage.setItem(bestKey(gameId), String(value));
    } catch {
        /* storage unavailable — ignore, game still works */
    }
};

// Deterministic PRNG (mulberry32) for daily-seed / share-run modes.
export const mulberry32 = (seed) => {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

// Hash an arbitrary string (e.g. a date) into a 32-bit seed.
export const strToSeed = (str) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

export const todaySeedString = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
};

export const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Size a canvas to its container with devicePixelRatio for crisp rendering.
// logicalW/logicalH is the fixed game resolution; CSS scales it to the box.
export const setupCanvas = (canvas, logicalW, logicalH) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(logicalW * dpr);
    canvas.height = Math.round(logicalH * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
};

// Fixed-timestep loop (60Hz) with delta accumulator, capped at 5 steps/frame.
// Returns a stop() function. update(dtSeconds) + render() are called back.
export const createLoop = (update, render) => {
    const STEP = 1 / 60;
    let acc = 0;
    let last = performance.now();
    let raf = 0;
    let running = true;

    const frame = (now) => {
        if (!running) return;
        let dt = (now - last) / 1000;
        last = now;
        if (dt > 0.25) dt = 0.25; // clamp big tab-switch gaps
        acc += dt;
        let steps = 0;
        while (acc >= STEP && steps < 5) {
            update(STEP);
            acc -= STEP;
            steps++;
        }
        render();
        raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
        running = false;
        cancelAnimationFrame(raf);
    };
};

// Read a CSS variable (hsl triplet) and return a usable color string.
export const cssColor = (varName, fallback) => {
    try {
        const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        return v ? `hsl(${v})` : fallback;
    } catch {
        return fallback;
    }
};
