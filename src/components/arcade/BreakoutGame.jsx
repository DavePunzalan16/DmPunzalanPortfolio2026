// Breakout / Arkanoid — self-contained canvas game.
// Exported as a factory: mount(el, api) => cleanup().
// api: { onScore(n), onBest(n), isMuted() }
import {
    setupCanvas, createLoop, loadBest, saveBest, prefersReducedMotion, cssColor,
} from "@/components/arcade/arcadeUtils.js";

const W = 560, H = 420;             // fixed logical resolution
const PADDLE_W = 90, PADDLE_H = 12;
const BALL_R = 6;
const GAME_ID = "breakout";

const LEVELS = 5;

// Build a brick layout for a level (returns array of {x,y,w,h,hp,maxHp}).
const buildLevel = (level) => {
    const cols = 10, rows = 6;
    const bw = (W - 40) / cols, bh = 18, top = 50, left = 20;
    const bricks = [];
    const add = (c, r, hp) => bricks.push({
        x: left + c * bw + 2, y: top + r * bh + 2, w: bw - 4, h: bh - 4, hp, maxHp: hp,
    });
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let place, hp;
            if (level === 1) { place = r < 4; hp = 1 + (r % 2); }
            else if (level === 2) { place = c >= r && c < cols - r; hp = 1 + Math.floor(r / 2); } // pyramid
            else if (level === 3) { place = (r + c) % 2 === 0; hp = 2; } // checkerboard
            else if (level === 4) { place = c % 2 === 0 && r < 5; hp = 1 + (r % 3); } // columns w/ gaps
            else { place = true; hp = 3; } // fortress
            if (place) add(c, r, hp);
        }
    }
    return bricks;
};

const brickColor = (hp, maxHp) => {
    const ratio = hp / maxHp;
    if (hp >= 3) return "#a855f7";
    if (hp === 2) return "#60a5fa";
    return ratio < 1 ? "#f59e0b" : "#34d399";
};

export default function mountBreakout(el, api) {
    const reduced = prefersReducedMotion();
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", "Breakout game. Move the paddle, launch the ball, break the bricks.");
    el.appendChild(canvas);
    const ctx = setupCanvas(canvas, W, H);

    const primary = cssColor("--primary", "#8b5cf6");

    const state = {
        paddleX: W / 2 - PADDLE_W / 2,
        paddleW: PADDLE_W,
        balls: [],
        bricks: buildLevel(1),
        level: 1,
        score: 0,
        best: loadBest(GAME_ID),
        lives: 3,
        running: true,
        paused: false,
        launched: false,
        powerups: [],        // falling pickups
        effects: {},         // active timed effects: name -> remaining seconds
        particles: [],
        lasers: [],
        laserCooldown: 0,
        banner: "Level 1",
        bannerT: 1.5,
        won: false,
        over: false,
        baseSpeed: 230,
    };
    api.onBest?.(state.best);

    const resetBall = () => {
        state.balls = [{
            x: state.paddleX + state.paddleW / 2,
            y: H - 40,
            vx: 0, vy: 0,
            stuck: true,
        }];
        state.launched = false;
    };
    resetBall();

    const launch = () => {
        if (state.launched || state.over || state.won) return;
        state.launched = true;
        const sp = state.baseSpeed + (state.level - 1) * 20;
        state.balls.forEach((b) => {
            b.stuck = false;
            b.vx = sp * 0.4 * (Math.random() < 0.5 ? -1 : 1);
            b.vy = -sp;
        });
    };

    // ── Input ──
    const movePaddleTo = (clientX) => {
        const rect = canvas.getBoundingClientRect();
        const rel = (clientX - rect.left) / rect.width * W;
        state.paddleX = Math.max(0, Math.min(W - state.paddleW, rel - state.paddleW / 2));
        if (!state.launched) state.balls[0].x = state.paddleX + state.paddleW / 2;
    };
    const onMouseMove = (e) => movePaddleTo(e.clientX);
    const onTouchMove = (e) => { if (e.touches[0]) movePaddleTo(e.touches[0].clientX); };
    const onPointerDown = () => { canvas.focus(); if (!state.launched) launch(); else fireLaser(); };
    const keys = {};
    const onKeyDown = (e) => {
        const k = e.key.toLowerCase();
        if (["arrowleft", "arrowright", " ", "a", "d", "p"].includes(k)) {
            // only prevent default while focused (canvas has focus here)
            e.preventDefault();
        }
        keys[k] = true;
        if (k === " ") { if (!state.launched) launch(); else fireLaser(); }
        if (k === "p" || e.key === "Escape") state.paused = !state.paused;
    };
    const onKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("keyup", onKeyUp);

    const fireLaser = () => {
        if (!state.effects.laser || state.laserCooldown > 0) return;
        state.laserCooldown = 0.4;
        state.lasers.push({ x: state.paddleX + 8, y: H - 30 });
        state.lasers.push({ x: state.paddleX + state.paddleW - 8, y: H - 30 });
    };

    const addParticles = (x, y, color) => {
        if (reduced) return;
        const n = 8;
        for (let i = 0; i < n; i++) {
            const a = (Math.PI * 2 * i) / n;
            state.particles.push({ x, y, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80, life: 0.5, color });
        }
    };

    const spawnPowerup = (x, y) => {
        const types = ["wide", "multi", "slow", "laser"];
        const type = types[Math.floor(Math.random() * types.length)];
        state.powerups.push({ x, y, vy: 90, type });
    };

    const activate = (type) => {
        if (type === "wide") { state.effects.wide = 12; state.paddleW = 140; }
        else if (type === "slow") { state.effects.slow = 10; }
        else if (type === "laser") { state.effects.laser = 12; }
        else if (type === "multi") {
            const extra = [];
            state.balls.forEach((b) => {
                for (let i = 0; i < 2; i++) {
                    const sp = Math.hypot(b.vx, b.vy) || state.baseSpeed;
                    const ang = Math.atan2(b.vy, b.vx) + (i ? 0.4 : -0.4);
                    extra.push({ x: b.x, y: b.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, stuck: false });
                }
            });
            state.balls.push(...extra);
        }
    };

    const nextLevel = () => {
        if (state.level >= LEVELS) { state.won = true; state.running = false; saveBest(GAME_ID, state.score); api.onBest?.(loadBest(GAME_ID)); return; }
        state.level++;
        state.bricks = buildLevel(state.level);
        state.banner = `Level ${state.level}`;
        state.bannerT = 1.5;
        state.paddleW = state.effects.wide ? 140 : PADDLE_W;
        resetBall();
    };

    const loseLife = () => {
        state.lives--;
        if (state.lives <= 0) {
            state.over = true;
            state.running = false;
            saveBest(GAME_ID, state.score);
            api.onBest?.(loadBest(GAME_ID));
        } else {
            resetBall();
        }
    };

    // Move one ball with sub-stepping to avoid tunneling.
    const moveBall = (b, dt) => {
        const speed = Math.hypot(b.vx, b.vy);
        const steps = Math.max(1, Math.ceil((speed * dt) / 4));
        const sdt = dt / steps;
        for (let s = 0; s < steps; s++) {
            b.x += b.vx * sdt;
            b.y += b.vy * sdt;
            // walls
            if (b.x < BALL_R) { b.x = BALL_R; b.vx = Math.abs(b.vx); }
            if (b.x > W - BALL_R) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); }
            if (b.y < BALL_R) { b.y = BALL_R; b.vy = Math.abs(b.vy); }
            // paddle
            const py = H - 24;
            if (b.vy > 0 && b.y + BALL_R >= py && b.y < py + PADDLE_H &&
                b.x >= state.paddleX && b.x <= state.paddleX + state.paddleW) {
                const hit = (b.x - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2); // -1..1
                const ang = hit * (Math.PI / 3); // max 60deg
                const sp = Math.min(Math.hypot(b.vx, b.vy) * 1.02, 520);
                b.vx = sp * Math.sin(ang);
                b.vy = -Math.abs(sp * Math.cos(ang));
                // clamp min vertical speed to avoid horizontal loops
                if (Math.abs(b.vy) < 120) b.vy = -120;
                b.y = py - BALL_R;
            }
            // bricks — resolve by least penetration
            for (let i = 0; i < state.bricks.length; i++) {
                const br = state.bricks[i];
                if (b.x + BALL_R < br.x || b.x - BALL_R > br.x + br.w ||
                    b.y + BALL_R < br.y || b.y - BALL_R > br.y + br.h) continue;
                const overlapL = b.x + BALL_R - br.x;
                const overlapR = br.x + br.w - (b.x - BALL_R);
                const overlapT = b.y + BALL_R - br.y;
                const overlapB = br.y + br.h - (b.y - BALL_R);
                const minX = Math.min(overlapL, overlapR);
                const minY = Math.min(overlapT, overlapB);
                if (minX < minY) b.vx = overlapL < overlapR ? -Math.abs(b.vx) : Math.abs(b.vx);
                else b.vy = overlapT < overlapB ? -Math.abs(b.vy) : Math.abs(b.vy);
                damageBrick(i, br);
                break;
            }
        }
    };

    const damageBrick = (i, br) => {
        br.hp--;
        if (br.hp <= 0) {
            state.score += br.maxHp * 10;
            api.onScore?.(state.score);
            addParticles(br.x + br.w / 2, br.y + br.h / 2, brickColor(br.maxHp, br.maxHp));
            if (Math.random() < 0.15) spawnPowerup(br.x + br.w / 2, br.y + br.h / 2);
            state.bricks.splice(i, 1);
            if (state.bricks.length === 0) nextLevel();
        }
    };

    const update = (dt) => {
        if (!state.running || state.paused) return;
        // keyboard paddle
        if (keys["arrowleft"] || keys["a"]) state.paddleX = Math.max(0, state.paddleX - 380 * dt);
        if (keys["arrowright"] || keys["d"]) state.paddleX = Math.min(W - state.paddleW, state.paddleX + 380 * dt);
        if (!state.launched) state.balls[0].x = state.paddleX + state.paddleW / 2;

        if (state.bannerT > 0) state.bannerT -= dt;
        if (state.laserCooldown > 0) state.laserCooldown -= dt;

        const slowFactor = state.effects.slow ? 0.6 : 1;
        if (state.launched) {
            state.balls.forEach((b) => moveBall(b, dt * slowFactor));
            // drop lost balls
            state.balls = state.balls.filter((b) => b.y < H + 20);
            if (state.balls.length === 0) loseLife();
        }

        // power-ups fall
        state.powerups.forEach((p) => { p.y += p.vy * dt; });
        state.powerups = state.powerups.filter((p) => {
            const py = H - 24;
            if (p.y >= py - 6 && p.x >= state.paddleX && p.x <= state.paddleX + state.paddleW) {
                activate(p.type);
                return false;
            }
            return p.y < H + 20;
        });

        // lasers
        state.lasers.forEach((l) => { l.y -= 420 * dt; });
        state.lasers = state.lasers.filter((l) => {
            for (let i = 0; i < state.bricks.length; i++) {
                const br = state.bricks[i];
                if (l.x >= br.x && l.x <= br.x + br.w && l.y <= br.y + br.h && l.y >= br.y) {
                    damageBrick(i, br);
                    return false;
                }
            }
            return l.y > 0;
        });

        // timed effects
        for (const k of Object.keys(state.effects)) {
            state.effects[k] -= dt;
            if (state.effects[k] <= 0) {
                delete state.effects[k];
                if (k === "wide") state.paddleW = PADDLE_W;
            }
        }

        // particles
        state.particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
        state.particles = state.particles.filter((p) => p.life > 0);
    };

    const render = () => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#0b0a12";
        ctx.fillRect(0, 0, W, H);

        // bricks
        state.bricks.forEach((br) => {
            ctx.fillStyle = brickColor(br.hp, br.maxHp);
            ctx.fillRect(br.x, br.y, br.w, br.h);
        });
        // paddle (glow)
        ctx.save();
        ctx.shadowColor = primary;
        ctx.shadowBlur = reduced ? 0 : 12;
        ctx.fillStyle = primary;
        ctx.fillRect(state.paddleX, H - 24, state.paddleW, PADDLE_H);
        ctx.restore();
        // balls
        ctx.fillStyle = "#fff";
        state.balls.forEach((b) => { ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2); ctx.fill(); });
        // power-ups
        state.powerups.forEach((p) => {
            ctx.fillStyle = { wide: "#34d399", multi: "#f59e0b", slow: "#60a5fa", laser: "#ef4444" }[p.type];
            ctx.fillRect(p.x - 8, p.y - 6, 16, 12);
        });
        // lasers
        ctx.fillStyle = "#ef4444";
        state.lasers.forEach((l) => ctx.fillRect(l.x - 1.5, l.y, 3, 10));
        // particles
        state.particles.forEach((p) => {
            ctx.globalAlpha = Math.max(0, p.life * 2);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            ctx.globalAlpha = 1;
        });

        // HUD
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${"❤".repeat(Math.max(0, state.lives))}`, 10, 20);
        ctx.textAlign = "right";
        ctx.fillText(`Score ${state.score}  ·  Lvl ${state.level}`, W - 10, 20);
        // active effects
        const fx = Object.keys(state.effects);
        if (fx.length) { ctx.textAlign = "center"; ctx.fillText(fx.join("  "), W / 2, 20); }

        if (state.bannerT > 0 && !state.over && !state.won) {
            ctx.textAlign = "center"; ctx.font = "bold 28px sans-serif";
            ctx.fillText(state.banner, W / 2, H / 2);
        }
        if (!state.launched && !state.over && !state.won && state.bannerT <= 0) {
            ctx.textAlign = "center"; ctx.font = "14px sans-serif";
            ctx.fillText("Press Space / click to launch", W / 2, H / 2 + 40);
        }
        if (state.paused) { ctx.textAlign = "center"; ctx.font = "bold 24px sans-serif"; ctx.fillText("Paused", W / 2, H / 2); }
        if (state.over || state.won) {
            ctx.textAlign = "center";
            ctx.font = "bold 26px sans-serif";
            ctx.fillText(state.won ? "You win! 🎉" : "Game Over", W / 2, H / 2 - 10);
            ctx.font = "14px sans-serif";
            ctx.fillText(`Final score: ${state.score}`, W / 2, H / 2 + 16);
            ctx.fillText("Click Restart above to play again", W / 2, H / 2 + 38);
        }
    };

    canvas.focus();
    const stop = createLoop(update, render);

    return () => {
        stop();
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("mousedown", onPointerDown);
        canvas.removeEventListener("touchstart", onPointerDown);
        canvas.removeEventListener("keydown", onKeyDown);
        canvas.removeEventListener("keyup", onKeyUp);
    };
}
