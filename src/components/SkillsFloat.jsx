import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SKILL_STATUS } from "@/data/skills";

/**
 * Responsive 2D "floating tech ecosystem".
 * - Nodes are laid out on a scattered grid, each with a gentle idle float.
 * - Drag a node to reposition it (mouse + touch via pointer events).
 * - Hover / focus highlights; click selects (bubbles up via onSelect).
 * - Pure DOM + CSS transforms + one rAF loop (no 3D library).
 * - Respects prefers-reduced-motion (no idle float, still draggable).
 *
 * State model: `positions` (fractional x/y per node) lives in React state so the
 * render stays pure. The rAF loop only advances a `phase` clock in state, which
 * derives each node's vertical drift during render.
 */
export const SkillsFloat = ({ skills, selected, onSelect, reducedMotion }) => {
    const areaRef = useRef(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [hovered, setHovered] = useState(null);
    const [clock, setClock] = useState(0);
    const frameRef = useRef(null);
    const dragRef = useRef(null); // { index, offsetX, offsetY }

    // Base layout: scattered grid + per-node float params. Derived from skills.
    const layout = useMemo(() => {
        const n = skills.length;
        const cols = Math.ceil(Math.sqrt(n * 1.4));
        const rows = Math.ceil(n / cols);
        return skills.map((s, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const jx = (Math.sin(i * 12.9898) * 0.5) * 0.06;
            const jy = (Math.sin(i * 78.233) * 0.5) * 0.06;
            return {
                x: (col + 0.5) / cols + jx,
                y: (row + 0.5) / rows + jy,
                phase: (i * 137.5) % (Math.PI * 2),
                amp: 4 + ((i * 7) % 6),
                speed: 0.6 + ((i % 5) * 0.15),
            };
        });
    }, [skills]);

    // Draggable positions live in state (initialized once from layout).
    // The parent remounts this component via `key` when the skill set changes,
    // so the lazy initializer always reflects the current layout.
    const [positions, setPositions] = useState(() =>
        layout.map((l) => ({ x: l.x, y: l.y }))
    );

    // Measure the area.
    useEffect(() => {
        const el = areaRef.current;
        if (!el) return;
        const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Idle float loop — only advances a clock (state), keeping render pure.
    useEffect(() => {
        if (reducedMotion) return;
        const start = performance.now();
        const animate = (now) => {
            setClock((now - start) / 1000);
            frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [reducedMotion]);

    const onPointerDown = useCallback((e, index) => {
        const area = areaRef.current;
        if (!area) return;
        const rect = area.getBoundingClientRect();
        setPositions((prev) => {
            const p = prev[index];
            dragRef.current = {
                index,
                offsetX: e.clientX - rect.left - p.x * rect.width,
                offsetY: e.clientY - rect.top - p.y * rect.height,
            };
            return prev;
        });
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e) => {
        const drag = dragRef.current;
        const area = areaRef.current;
        if (!drag || !area) return;
        const rect = area.getBoundingClientRect();
        let nx = (e.clientX - rect.left - drag.offsetX) / rect.width;
        let ny = (e.clientY - rect.top - drag.offsetY) / rect.height;
        nx = Math.min(0.97, Math.max(0.03, nx));
        ny = Math.min(0.95, Math.max(0.05, ny));
        setPositions((prev) => {
            const next = prev.slice();
            next[drag.index] = { x: nx, y: ny };
            return next;
        });
    }, []);

    const onPointerUp = useCallback((e) => {
        if (dragRef.current) {
            e.currentTarget.releasePointerCapture?.(e.pointerId);
            dragRef.current = null;
        }
    }, []);

    return (
        <div
            ref={areaRef}
            role="group"
            aria-label="Floating skills. Drag a technology to move it, click for details."
            className="relative w-full h-[420px] sm:h-[460px] rounded-2xl border border-border/50 bg-card/30 overflow-hidden touch-none"
        >
            {size.w > 0 && skills.map((skill, i) => {
                const base = layout[i];
                const pos = positions[i] ?? { x: base.x, y: base.y };
                if (!base) return null;
                const status = SKILL_STATUS[skill.status] ?? SKILL_STATUS.EXPLORING;
                const isActive = selected?.name === skill.name || hovered === i;
                const drift = reducedMotion ? 0 : Math.sin(clock * base.speed + base.phase) * base.amp;
                const left = pos.x * size.w;
                const top = pos.y * size.h + drift;

                return (
                    <button
                        key={skill.name}
                        type="button"
                        onPointerDown={(e) => onPointerDown(e, i)}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onClick={() => onSelect(skill)}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered((h) => (h === i ? null : h))}
                        aria-label={`${skill.name} — ${status.label}. ${skill.category}.`}
                        className={cn(
                            "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border cursor-grab active:cursor-grabbing",
                            "px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-[box-shadow,transform,border-color] duration-200",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            isActive
                                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_16px_hsl(var(--primary)/0.55)] z-20 scale-110"
                                : "bg-card/90 backdrop-blur-sm text-foreground border-border/60 hover:border-primary/50 z-10"
                        )}
                        style={{ left, top }}
                    >
                        <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle", status.dot)} />
                        {skill.name}
                    </button>
                );
            })}
        </div>
    );
};
