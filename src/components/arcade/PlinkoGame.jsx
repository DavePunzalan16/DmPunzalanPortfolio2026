// Plinko — hand-written 2D physics, canvas. Factory: mount(el, api) => cleanup().
import {
    setupCanvas, createLoop, loadBest, saveBest, prefersReducedMotion, cssColor,
} from "@/components/arcade/arcadeUtils.js";

const W = 460, H = 560;
const GAME_ID = "plinko";
const ROWS = 15;
const PEG_R = 4;
const BALL_R = 6;
const GRAV = 900;           // px/s^2
const REST = 0.62;          // restitution
const MAX_IN_PLAY = 3;
const BALLS_PER_ROUND = 10;

// Slot multipliers (mirrored, center is best).
const SLOT_MULT = [10, 5, 3, 2, 1, 0.5, 1, 0.5, 1, 2, 3, 5, 10];
const slotColor = (m) =>
    m >= 10 ? "#ef4444" : m >= 5 ? "#f59e0b" : m >= 3 ? "#8b5cf6" : m >= 2 ? "#60a5fa" : m >= 1 ? "#34d399" : "#475569";

export default function mountPlinko(el, api) {
    const reduced = prefersReducedMotion();
    el.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:0.4rem;width:100%;height:100%;color:#fff;overflow:auto;padding:0.25rem;";
    el.appendChild(wrap);

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:auto;height:auto;max-width:100%;max-height:92%;touch-action:none;aspect-ratio:460/560;";
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", "Plinko. Move to choose a drop position, click or press space to drop a ball.");
    wrap.appendChild(canvas);
    const ctx = setupCanvas(canvas, W, H);

    const note = document.createElement("div");
    note.style.cssText = "font-size:0.65rem;opacity:0.6;";
    note.textContent = "Just for fun. No real money.";
    wrap.appendChild(note);

    const primary = cssColor("--primary", "#8b5cf6");

    // Build peg layout (triangular).
    const pegs = [];
    const topY = 70;
    const rowGap = (H - topY - 90) / ROWS;
    for (let r = 0; r < ROWS; r++) {
        const count = r + 3;
        const spacing = W / (count + 1);
        for (let i = 0; i < count; i++) {
            pegs.push({ x: spacing * (i + 1), y: topY + r * rowGap });
        }
    }

    const slotCount = SLOT_MULT.length;
    const slotW = W / slotCount;
    const slotTop = H - 40;

    const state = {
        balls: [],
        dropX: W / 2,
        ballsLeft: BALLS_PER_ROUND,
        score: 0,
        best: loadBest(GAME_ID),
        combo: 0,
        particles: [],
        flashes: [],      // slot flash popups
        roundOver: false,
    };
    api.onBest?.(state.best);
    api.onScore?.(state.score);

    const dropBall = () => {
        if (state.roundOver) return;
        const inPlay = state.balls.length;
        if (inPlay >= MAX_IN_PLAY) return;
        if (state.ballsLeft <= 0) return;
        state.ballsLeft--;
        state.balls.push({
            x: state.dropX + (Math.random() - 0.5) * 4,
            y: 30,
            vx: 0, vy: 0,
            trail: [],
        });
    };

    const addParticles = (x, y, color, n = 6) => {
        if (reduced) n = 3;
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = 40 + Math.random() * 80;
            state.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.4, color });
        }
    };

    const landBall = (b, slotIndex) => {
        const mult = SLOT_MULT[slotIndex];
        const base = 10;
        let gain = Math.round(base * mult);
        if (mult >= 3) { state.combo++; gain = Math.round(gain * (1 + state.combo * 0.25)); }
        else state.combo = 0;
        state.score += gain;
        if (state.score > state.best) { state.best = state.score; saveBest(GAME_ID, state.best); api.onBest?.(state.best); }
        api.onScore?.(state.score);
        const sx = slotW * (slotIndex + 0.5);
        state.flashes.push({ x: sx, y: slotTop, text: `+${gain}${mult >= 3 && state.combo > 1 ? ` x${state.combo}` : ""}`, life: 1, color: slotColor(mult) });
        addParticles(sx, slotTop, slotColor(mult), 10);
        if (state.ballsLeft <= 0 && state.balls.length === 0) state.roundOver = true;
    };

    const stepBall = (b, dt) => {
        // sub-step for stability at speed
        const steps = 3;
        const sdt = dt / steps;
        for (let s = 0; s < steps; s++) {
            b.vy += GRAV * sdt;
            b.x += b.vx * sdt;
            b.y += b.vy * sdt;
            // walls
            if (b.x < BALL_R) { b.x = BALL_R; b.vx = Math.abs(b.vx) * REST; }
            if (b.x > W - BALL_R) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx) * REST; }
            // pegs
            for (const p of pegs) {
                const dx = b.x - p.x, dy = b.y - p.y;
                const dist = Math.hypot(dx, dy);
                const min = PEG_R + BALL_R;
                if (dist < min && dist > 0) {
                    const nx = dx / dist, ny = dy / dist;
                    // push out
                    const overlap = min - dist;
                    b.x += nx * overlap;
                    b.y += ny * overlap;
                    // reflect velocity along normal
                    const vn = b.vx * nx + b.vy * ny;
                    b.vx = (b.vx - 2 * vn * nx) * REST;
                    b.vy = (b.vy - 2 * vn * ny) * REST;
                    // jitter
                    b.vx += (Math.random() - 0.5) * 60;
                    addParticles(p.x, p.y, primary, 2);
                }
            }
        }
        // damping
        b.vx *= 0.999;
        // anti-stuck: if nearly stationary above the slots, nudge
        if (Math.abs(b.vx) < 5 && Math.abs(b.vy) < 5 && b.y < slotTop - 10) {
            b.vx += (Math.random() - 0.5) * 120;
            b.vy += 60;
        }
        // trail
        if (!reduced) { b.trail.push({ x: b.x, y: b.y }); if (b.trail.length > 8) b.trail.shift(); }
    };

    const update = (dt) => {
        for (let i = state.balls.length - 1; i >= 0; i--) {
            const b = state.balls[i];
            stepBall(b, dt);
            if (b.y >= slotTop - BALL_R) {
                const idx = Math.max(0, Math.min(slotCount - 1, Math.floor(b.x / slotW)));
                landBall(b, idx);
                state.balls.splice(i, 1);
            }
        }
        state.particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt; p.life -= dt; });
        state.particles = state.particles.filter((p) => p.life > 0);
        state.flashes.forEach((f) => { f.y -= 20 * dt; f.life -= dt; });
        state.flashes = state.flashes.filter((f) => f.life > 0);
    };

    const render = () => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#0b0a12";
        ctx.fillRect(0, 0, W, H);

        // guide line + drop marker
        if (!state.roundOver && state.ballsLeft > 0) {
            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.setLineDash([4, 6]);
            ctx.beginPath(); ctx.moveTo(state.dropX, 20); ctx.lineTo(state.dropX, slotTop); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = primary;
            ctx.beginPath(); ctx.arc(state.dropX, 22, BALL_R, 0, Math.PI * 2); ctx.fill();
        }

        // pegs
        ctx.fillStyle = "#cbd5e1";
        for (const p of pegs) { ctx.beginPath(); ctx.arc(p.x, p.y, PEG_R, 0, Math.PI * 2); ctx.fill(); }

        // slots
        for (let i = 0; i < slotCount; i++) {
            const m = SLOT_MULT[i];
            ctx.fillStyle = slotColor(m);
            ctx.globalAlpha = 0.85;
            ctx.fillRect(i * slotW + 1, slotTop, slotW - 2, H - slotTop);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#0b0a12";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${m}x`, i * slotW + slotW / 2, H - 14);
        }

        // particles
        state.particles.forEach((p) => {
            ctx.globalAlpha = Math.max(0, p.life * 2.5);
            ctx.fillStyle = p.color; ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
            ctx.globalAlpha = 1;
        });

        // balls + trails
        state.balls.forEach((b) => {
            if (!reduced) {
                b.trail.forEach((t, i) => {
                    ctx.globalAlpha = (i / b.trail.length) * 0.4;
                    ctx.fillStyle = "#fff";
                    ctx.beginPath(); ctx.arc(t.x, t.y, BALL_R * 0.7, 0, Math.PI * 2); ctx.fill();
                });
                ctx.globalAlpha = 1;
            }
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2); ctx.fill();
        });

        // flashes
        state.flashes.forEach((f) => {
            ctx.globalAlpha = Math.max(0, f.life);
            ctx.fillStyle = f.color; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(f.text, f.x, f.y - 20);
            ctx.globalAlpha = 1;
        });

        // HUD
        ctx.fillStyle = "#fff"; ctx.font = "13px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`Balls left: ${state.ballsLeft}`, 10, 24);
        ctx.textAlign = "right";
        ctx.fillText(`Combo: ${state.combo}`, W - 10, 24);

        if (state.roundOver) {
            ctx.fillStyle = "rgba(10,8,18,0.85)"; ctx.fillRect(0, H / 2 - 60, W, 120);
            ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = "bold 22px sans-serif";
            ctx.fillText("Round complete!", W / 2, H / 2 - 10);
            ctx.font = "14px sans-serif";
            ctx.fillText(`Score: ${state.score}  ·  Best: ${state.best}`, W / 2, H / 2 + 16);
            ctx.fillText("Press N for a new round", W / 2, H / 2 + 38);
        }
    };

    // ── Input ──
    const moveTo = (clientX) => {
        const rect = canvas.getBoundingClientRect();
        state.dropX = Math.max(BALL_R, Math.min(W - BALL_R, (clientX - rect.left) / rect.width * W));
    };
    const onMouseMove = (e) => moveTo(e.clientX);
    const onTouchMove = (e) => { if (e.touches[0]) moveTo(e.touches[0].clientX); };
    const onDown = () => { canvas.focus(); dropBall(); };
    const newRound = () => {
        state.balls = []; state.ballsLeft = BALLS_PER_ROUND; state.score = 0; state.combo = 0;
        state.roundOver = false; state.particles = []; state.flashes = [];
        api.onScore?.(0);
    };
    const onKey = (e) => {
        const k = e.key.toLowerCase();
        if (k === " ") { e.preventDefault(); dropBall(); }
        else if (k === "n") { e.preventDefault(); newRound(); }
        else if (k === "arrowleft") { e.preventDefault(); state.dropX = Math.max(BALL_R, state.dropX - 15); }
        else if (k === "arrowright") { e.preventDefault(); state.dropX = Math.min(W - BALL_R, state.dropX + 15); }
    };

    const onTouchStart = (e) => { if (e.touches[0]) moveTo(e.touches[0].clientX); onDown(); };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("keydown", onKey);

    canvas.focus();
    const stop = createLoop(update, render);

    return () => {
        stop();
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("mousedown", onDown);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("keydown", onKey);
    };
}
