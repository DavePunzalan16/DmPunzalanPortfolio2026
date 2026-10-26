import { useState, useEffect, useRef, useCallback } from "react";
import { Gamepad2, Volume2, VolumeX } from "lucide-react";

// Game registry — add a 5th game later with one entry.
// Each game exposes a default export: a factory (mountEl, api) => cleanupFn.
const GAMES = [
    {
        id: "breakout",
        name: "Breakout",
        icon: "🧱",
        description: "Angle-based Arkanoid with power-ups and 5 levels.",
        controls: "Mouse / A·D / ← →  move · Space launch · P pause",
        load: () => import("@/components/arcade/BreakoutGame.jsx"),
    },
    {
        id: "bomb2048",
        name: "2048 Bomb",
        icon: "💣",
        description: "2048 with a rare exploding bomb tile + daily seed.",
        controls: "Arrow keys / WASD / swipe",
        load: null, // coming soon
    },
    {
        id: "plinko",
        name: "Plinko",
        icon: "🔵",
        description: "Physics ball drop with multipliers and combos.",
        controls: "Click / Space to drop",
        load: null,
    },
    {
        id: "dungeon",
        name: "Dungeon",
        icon: "⚔️",
        description: "Turn-based mini roguelike with seeded floors.",
        controls: "WASD / arrows · bump to attack",
        load: null,
    },
];

export const ArcadeSection = () => {
    const [activeId, setActiveId] = useState(GAMES[0].id);
    const [started, setStarted] = useState(false);
    const [muted, setMuted] = useState(true);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [loadError, setLoadError] = useState(false);
    const [restartKey, setRestartKey] = useState(0);

    const mountRef = useRef(null);
    const cleanupRef = useRef(null);
    const sectionRef = useRef(null);
    const mutedRef = useRef(true);

    const active = GAMES.find((g) => g.id === activeId);

    // Fully stop + clean up the current game.
    const teardown = useCallback(() => {
        if (cleanupRef.current) {
            try { cleanupRef.current(); } catch { /* ignore */ }
            cleanupRef.current = null;
        }
        if (mountRef.current) mountRef.current.innerHTML = "";
    }, []);

    // Mount the active game (lazy import) once the user clicks "play".
    useEffect(() => {
        if (!started || !active?.load || !mountRef.current) return;
        let disposed = false;
        setLoadError(false);
        active.load()
            .then((mod) => {
                if (disposed || !mountRef.current) return;
                const factory = mod.default;
                cleanupRef.current = factory(mountRef.current, {
                    onScore: setScore,
                    onBest: setBest,
                    isMuted: () => mutedRef.current,
                });
            })
            .catch(() => { if (!disposed) setLoadError(true); });

        return () => {
            disposed = true;
            teardown();
        };
    }, [started, activeId, active, restartKey, teardown]);

    // Switching tabs stops the previous game and resets the overlay.
    const selectTab = (id) => {
        if (id === activeId) return;
        teardown();
        setStarted(false);
        setScore(0);
        setBest(0);
        setActiveId(id);
    };

    // Pause (teardown) when scrolled off-screen or tab hidden.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && started) {
                    teardown();
                    setStarted(false);
                }
            },
            { threshold: 0.1 }
        );
        obs.observe(el);
        const onHide = () => {
            if (document.hidden && started) { teardown(); setStarted(false); }
        };
        document.addEventListener("visibilitychange", onHide);
        return () => {
            obs.disconnect();
            document.removeEventListener("visibilitychange", onHide);
        };
    }, [started, teardown]);

    // Arrow-key / tablist navigation.
    const onTabKeyDown = (e) => {
        const idx = GAMES.findIndex((g) => g.id === activeId);
        if (e.key === "ArrowRight") { e.preventDefault(); selectTab(GAMES[(idx + 1) % GAMES.length].id); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); selectTab(GAMES[(idx - 1 + GAMES.length) % GAMES.length].id); }
    };

    const toggleMute = () => { setMuted((m) => { mutedRef.current = !m; return !m; }); };
    const restart = () => { teardown(); setScore(0); setRestartKey((k) => k + 1); setStarted(true); };

    return (
        <section id="arcade" ref={sectionRef} className="py-16 sm:py-20 md:py-24 px-4 relative">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
                        <Gamepad2 className="h-4 w-4" />
                        For Fun
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Take a Break: <span className="text-primary">Mini Arcade</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Built from scratch with Canvas and JS. Pick a game and beat my score.
                    </p>
                </div>

                <div className="arcade-shell">
                    {/* Tab bar */}
                    <div className="arcade-tabbar" role="tablist" aria-label="Mini arcade games" onKeyDown={onTabKeyDown}>
                        {GAMES.map((g) => (
                            <button
                                key={g.id}
                                role="tab"
                                aria-selected={g.id === activeId}
                                tabIndex={g.id === activeId ? 0 : -1}
                                className="arcade-tab"
                                onClick={() => selectTab(g.id)}
                            >
                                <span aria-hidden="true">{g.icon}</span> {g.name}
                            </button>
                        ))}
                    </div>

                    {/* HUD */}
                    <div className="flex items-center justify-between px-3 pt-2">
                        <div className="arcade-hud">
                            <span>Score: <strong>{score}</strong></span>
                            <span>Best: <strong>{best}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            {active?.load && started && (
                                <button type="button" className="arcade-btn arcade-btn--ghost" onClick={restart}>Restart</button>
                            )}
                            <button
                                type="button"
                                className="arcade-btn arcade-btn--ghost"
                                onClick={toggleMute}
                                aria-label={muted ? "Unmute sound" : "Mute sound"}
                            >
                                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Stage */}
                    <div className="arcade-stage">
                        <div className="arcade-canvas-wrap" style={{ maxWidth: 560, aspectRatio: "4 / 3" }}>
                            <div ref={mountRef} className="w-full h-full" />

                            {/* Click-to-play / coming-soon overlay */}
                            {(!started || !active?.load || loadError) && (
                                <div className="arcade-overlay" role="group" aria-label={`${active?.name} game`}>
                                    <div className="text-3xl" aria-hidden="true">{active?.icon}</div>
                                    <h3 className="text-lg font-bold">{active?.name}</h3>
                                    <p className="text-sm opacity-80 max-w-xs">{active?.description}</p>
                                    <p className="text-xs opacity-60">{active?.controls}</p>
                                    {loadError ? (
                                        <p className="text-sm text-red-300">Couldn't load this game. Try again.</p>
                                    ) : active?.load ? (
                                        <button type="button" className="arcade-btn" onClick={() => setStarted(true)}>
                                            ▶ Click to play
                                        </button>
                                    ) : (
                                        <span className="arcade-btn arcade-btn--ghost cursor-default">Coming soon</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="arcade-note">Scores are saved on this device only.</p>
                </div>
            </div>
        </section>
    );
};

export default ArcadeSection;
