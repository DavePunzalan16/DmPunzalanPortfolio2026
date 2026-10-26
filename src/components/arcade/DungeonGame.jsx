// Mini Roguelike "Dungeon" — turn-based, canvas. Factory: mount(el, api) => cleanup().
import {
    setupCanvas, loadBest, saveBest, cssColor, mulberry32,
} from "@/components/arcade/arcadeUtils.js";
import { playSound } from "@/lib/sound";

const GAME_ID = "dungeon";
const MAP_W = 40, MAP_H = 28;         // full map
const VIEW_W = 15, VIEW_H = 10;       // visible tiles
const TILE = 30;                      // logical px per tile
const CW = VIEW_W * TILE, CH = VIEW_H * TILE + 70; // canvas (room for HUD/log)
const VIS_RADIUS = 6;
const FLOORS = 5;

const WALL = 0, FLOOR = 1, STAIRS = 2;

export default function mountDungeon(el, api) {
    el.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:0.4rem;width:100%;height:100%;color:#fff;overflow:auto;padding:0.25rem;";
    el.appendChild(wrap);

    const canvas = document.createElement("canvas");
    canvas.style.cssText = `width:auto;height:auto;max-width:100%;max-height:78%;touch-action:none;aspect-ratio:${CW}/${CH};`;
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", "Dungeon roguelike. Move with arrow keys or WASD. Bump enemies to attack.");
    wrap.appendChild(canvas);
    const ctx = setupCanvas(canvas, CW, CH);

    // On-screen D-pad + seed controls (touch-friendly).
    const pad = document.createElement("div");
    pad.style.cssText = "display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;justify-content:center;font-size:0.7rem;";
    pad.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,2rem);grid-template-rows:repeat(2,2rem);gap:2px;">
            <span></span><button type="button" data-dir="U" class="arcade-btn arcade-btn--ghost" style="padding:0;">▲</button><span></span>
            <button type="button" data-dir="L" class="arcade-btn arcade-btn--ghost" style="padding:0;">◀</button>
            <button type="button" data-dir="D" class="arcade-btn arcade-btn--ghost" style="padding:0;">▼</button>
            <button type="button" data-dir="R" class="arcade-btn arcade-btn--ghost" style="padding:0;">▶</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.3rem;">
            <span data-seed style="opacity:0.7;"></span>
            <div style="display:flex;gap:0.3rem;">
                <button type="button" data-act="copy" class="arcade-btn arcade-btn--ghost">Copy seed</button>
                <input data-seedin placeholder="seed #" style="width:5rem;background:#1f2937;border:1px solid #334155;border-radius:.4rem;color:#fff;padding:.2rem .4rem;font-size:.7rem;" />
                <button type="button" data-act="play" class="arcade-btn arcade-btn--ghost">Play seed</button>
            </div>
        </div>
    `;
    wrap.appendChild(pad);

    const primary = cssColor("--primary", "#8b5cf6");

    let rng, seed;
    const G = {
        map: [], seen: [], visible: [],
        player: { x: 0, y: 0, hp: 20, maxHp: 20, atk: 4, gold: 0 },
        enemies: [], pickups: [], stairs: { x: 0, y: 0 },
        floor: 1, log: [], over: false, won: false, kills: 0,
    };

    const addLog = (msg) => { G.log.push(msg); if (G.log.length > 3) G.log.shift(); };

    // ── Map generation (BSP) ──
    const makeMap = () => {
        const map = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(WALL));
        const rooms = [];

        // BSP split
        const split = (x, y, w, h, depth) => {
            if (depth <= 0 || (w < 12 && h < 10) || rng() < 0.2 && depth < 3) {
                // make a room inside this leaf
                const rw = Math.max(4, Math.floor(w * (0.5 + rng() * 0.4)));
                const rh = Math.max(3, Math.floor(h * (0.5 + rng() * 0.4)));
                const rx = x + Math.floor(rng() * Math.max(1, w - rw));
                const ry = y + Math.floor(rng() * Math.max(1, h - rh));
                const room = { x: rx, y: ry, w: rw, h: rh, cx: rx + (rw >> 1), cy: ry + (rh >> 1) };
                for (let yy = ry; yy < ry + rh; yy++)
                    for (let xx = rx; xx < rx + rw; xx++)
                        if (xx > 0 && yy > 0 && xx < MAP_W - 1 && yy < MAP_H - 1) map[yy][xx] = FLOOR;
                rooms.push(room);
                return;
            }
            if (w > h) {
                const cut = Math.floor(w * (0.4 + rng() * 0.2));
                split(x, y, cut, h, depth - 1);
                split(x + cut, y, w - cut, h, depth - 1);
            } else {
                const cut = Math.floor(h * (0.4 + rng() * 0.2));
                split(x, y, w, cut, depth - 1);
                split(x, y + cut, w, h - cut, depth - 1);
            }
        };
        split(1, 1, MAP_W - 2, MAP_H - 2, 4);

        // connect room centers with L-corridors in order
        const carveH = (x1, x2, y) => { for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) map[y][x] = FLOOR; };
        const carveV = (y1, y2, x) => { for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) map[y][x] = FLOOR; };
        for (let i = 1; i < rooms.length; i++) {
            const a = rooms[i - 1], b = rooms[i];
            if (rng() < 0.5) { carveH(a.cx, b.cx, a.cy); carveV(a.cy, b.cy, b.cx); }
            else { carveV(a.cy, b.cy, a.cx); carveH(a.cx, b.cx, b.cy); }
        }
        return { map, rooms };
    };

    // Flood fill from a start; returns count reachable + a reachable set.
    const floodReach = (map, sx, sy) => {
        const seen = new Set();
        const stack = [[sx, sy]];
        seen.add(sy * MAP_W + sx);
        while (stack.length) {
            const [x, y] = stack.pop();
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const nx = x + dx, ny = y + dy;
                if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H) continue;
                if (map[ny][nx] === WALL) continue;
                const key = ny * MAP_W + nx;
                if (!seen.has(key)) { seen.add(key); stack.push([nx, ny]); }
            }
        }
        return seen;
    };

    const genFloor = () => {
        let attempt = 0, built;
        do {
            built = makeMap();
            attempt++;
            if (!built.rooms.length) continue;
            const start = built.rooms[0];
            const stairsRoom = built.rooms[built.rooms.length - 1];
            G.player.x = start.cx; G.player.y = start.cy;
            G.stairs = { x: stairsRoom.cx, y: stairsRoom.cy };
            built.map[G.stairs.y][G.stairs.x] = STAIRS;
            // verify stairs reachable from start
            const reach = floodReach(built.map, G.player.x, G.player.y);
            if (reach.has(G.stairs.y * MAP_W + G.stairs.x)) break;
        } while (attempt < 20);

        G.map = built.map;
        G.rooms = built.rooms;
        G.seen = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(false));
        G.visible = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(false));
        G.enemies = [];
        G.pickups = [];

        const isBoss = G.floor === FLOORS;
        const rooms = built.rooms.slice(1); // skip start room
        // enemies
        const enemyCount = 3 + G.floor;
        for (let i = 0; i < enemyCount && rooms.length; i++) {
            const room = rooms[Math.floor(rng() * rooms.length)];
            const ex = room.x + Math.floor(rng() * room.w);
            const ey = room.y + Math.floor(rng() * room.h);
            if (G.map[ey]?.[ex] !== FLOOR) continue;
            const t = ["chaser", "wanderer", "archer"][Math.floor(rng() * 3)];
            G.enemies.push(makeEnemy(t, ex, ey));
        }
        if (isBoss) {
            G.enemies.push({ type: "boss", x: G.stairs.x, y: Math.max(1, G.stairs.y - 1), hp: 40, maxHp: 40, atk: 8, glyph: "👹", cd: 0 });
        }
        // pickups
        const pk = 2 + Math.floor(rng() * 3);
        for (let i = 0; i < pk && rooms.length; i++) {
            const room = rooms[Math.floor(rng() * rooms.length)];
            const px = room.x + Math.floor(rng() * room.w);
            const py = room.y + Math.floor(rng() * room.h);
            if (G.map[py]?.[px] !== FLOOR) continue;
            const kind = ["potion", "gold", "weapon"][Math.floor(rng() * 3)];
            G.pickups.push({ x: px, y: py, kind });
        }
        computeFOV();
        addLog(`Floor ${G.floor}${isBoss ? " — a boss lurks!" : ""}`);
    };

    const makeEnemy = (type, x, y) => {
        const base = { chaser: { hp: 8, atk: 3, glyph: "👻" }, wanderer: { hp: 6, atk: 5, glyph: "🦇" }, archer: { hp: 6, atk: 3, glyph: "🏹" } }[type];
        return { type, x, y, hp: base.hp + G.floor, maxHp: base.hp + G.floor, atk: base.atk, glyph: base.glyph };
    };

    // Bresenham line-of-sight (no walls between).
    const hasLOS = (x0, y0, x1, y1) => {
        let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx - dy, x = x0, y = y0;
        while (true) {
            if (!(x === x0 && y === y0) && !(x === x1 && y === y1)) {
                if (G.map[y]?.[x] === WALL) return false;
            }
            if (x === x1 && y === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x += sx; }
            if (e2 < dx) { err += dx; y += sy; }
        }
        return true;
    };

    const computeFOV = () => {
        for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) G.visible[y][x] = false;
        for (let dy = -VIS_RADIUS; dy <= VIS_RADIUS; dy++) {
            for (let dx = -VIS_RADIUS; dx <= VIS_RADIUS; dx++) {
                const x = G.player.x + dx, y = G.player.y + dy;
                if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
                if (dx * dx + dy * dy > VIS_RADIUS * VIS_RADIUS) continue;
                if (hasLOS(G.player.x, G.player.y, x, y)) { G.visible[y][x] = true; G.seen[y][x] = true; }
            }
        }
    };

    const isWalkable = (x, y) => x >= 0 && y >= 0 && x < MAP_W && y < MAP_H && G.map[y][x] !== WALL;
    const enemyAt = (x, y) => G.enemies.find((e) => e.x === x && e.y === y);

    const attack = (attacker, target, name) => {
        target.hp -= attacker.atk;
        if (target === G.player) {
            addLog(`${name} hits you for ${attacker.atk}.`);
            if (G.player.hp <= 0) { G.player.hp = 0; G.over = true; finishRun(); }
        } else {
            if (target.hp <= 0) {
                G.enemies = G.enemies.filter((e) => e !== target);
                G.kills++;
                if (target.type === "boss") { G.won = true; finishRun(); }
                addLog(`You defeat the ${target.type}.`);
            } else addLog(`You hit the ${target.type} for ${attacker.atk}.`);
        }
    };

    const finishRun = () => {
        const sc = G.player.gold + G.floor * 100 + (G.won ? 500 : 0);
        if (sc > loadBest(GAME_ID)) saveBest(GAME_ID, sc);
        api.onScore?.(sc);
        api.onBest?.(loadBest(GAME_ID));
    };

    const tryMove = (dx, dy) => {
        if (G.over || G.won) return;
        const nx = G.player.x + dx, ny = G.player.y + dy;
        const foe = enemyAt(nx, ny);
        if (foe) { attack(G.player, foe, "player"); playSound("hit"); enemyTurn(); render(); return; }
        if (!isWalkable(nx, ny)) return;
        G.player.x = nx; G.player.y = ny;
        playSound("step");

        // pickups
        const pi = G.pickups.findIndex((p) => p.x === nx && p.y === ny);
        if (pi >= 0) {
            const p = G.pickups[pi];
            if (p.kind === "potion") { G.player.hp = Math.min(G.player.maxHp, G.player.hp + 8); addLog("You drink a potion (+8 HP)."); }
            else if (p.kind === "gold") { const g = 10 + Math.floor(rng() * 20); G.player.gold += g; addLog(`You grab ${g} gold.`); }
            else { G.player.atk += 2; addLog("Weapon upgrade! (+2 ATK)"); }
            G.pickups.splice(pi, 1);
            playSound("pickup");
            api.onScore?.(G.player.gold + G.floor * 100);
        }

        // stairs
        if (G.map[ny][nx] === STAIRS) {
            if (G.floor >= FLOORS) { /* boss floor; win via boss */ }
            else { G.floor++; playSound("stairs"); genFloor(); render(); return; }
        }

        computeFOV();
        enemyTurn();
        render();
    };

    // Greedy step toward target (prefers the axis with larger delta, walkable).
    const stepToward = (e, tx, ty) => {
        const dx = Math.sign(tx - e.x), dy = Math.sign(ty - e.y);
        const options = Math.abs(tx - e.x) > Math.abs(ty - e.y)
            ? [[dx, 0], [0, dy]] : [[0, dy], [dx, 0]];
        for (const [mx, my] of options) {
            const nx = e.x + mx, ny = e.y + my;
            if (nx === G.player.x && ny === G.player.y) { attack(e, G.player, e.type); return; }
            if (isWalkable(nx, ny) && !enemyAt(nx, ny)) { e.x = nx; e.y = ny; return; }
        }
    };

    const enemyTurn = () => {
        for (const e of G.enemies) {
            if (G.over || G.won) break;
            const adj = Math.abs(e.x - G.player.x) + Math.abs(e.y - G.player.y) === 1;
            const los = hasLOS(e.x, e.y, G.player.x, G.player.y);
            const dist = Math.hypot(e.x - G.player.x, e.y - G.player.y);

            if (e.type === "wanderer") {
                if (adj) attack(e, G.player, "wanderer");
                else { const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]; const [mx, my] = dirs[Math.floor(rng() * 4)]; if (isWalkable(e.x + mx, e.y + my) && !enemyAt(e.x + mx, e.y + my) && !(e.x + mx === G.player.x && e.y + my === G.player.y)) { e.x += mx; e.y += my; } }
            } else if (e.type === "archer") {
                if (los && dist <= 5) { // shoot
                    if (adj) { // too close, back off
                        stepToward(e, e.x * 2 - G.player.x, e.y * 2 - G.player.y);
                    } else { G.player.hp -= e.atk; addLog(`Archer shoots you for ${e.atk}.`); if (G.player.hp <= 0) { G.player.hp = 0; G.over = true; finishRun(); } }
                } else if (los) stepToward(e, G.player.x, G.player.y);
            } else if (e.type === "boss") {
                e.cd = (e.cd || 0) - 1;
                if (adj) attack(e, G.player, "boss");
                else if (los && e.cd <= 0) { // charge: move twice
                    stepToward(e, G.player.x, G.player.y); stepToward(e, G.player.x, G.player.y); e.cd = 3;
                } else if (los) stepToward(e, G.player.x, G.player.y);
            } else { // chaser
                if (adj) attack(e, G.player, "chaser");
                else if (los) stepToward(e, G.player.x, G.player.y);
                else { if (rng() < 0.6) { const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]; const [mx, my] = dirs[Math.floor(rng() * 4)]; if (isWalkable(e.x + mx, e.y + my) && !enemyAt(e.x + mx, e.y + my)) { e.x += mx; e.y += my; } } }
            }
        }
    };

    // ── Render ──
    const render = () => {
        ctx.clearRect(0, 0, CW, CH);
        ctx.fillStyle = "#07060d";
        ctx.fillRect(0, 0, CW, CH);

        // camera centered on player
        let camX = G.player.x - (VIEW_W >> 1);
        let camY = G.player.y - (VIEW_H >> 1);
        camX = Math.max(0, Math.min(MAP_W - VIEW_W, camX));
        camY = Math.max(0, Math.min(MAP_H - VIEW_H, camY));

        for (let vy = 0; vy < VIEW_H; vy++) {
            for (let vx = 0; vx < VIEW_W; vx++) {
                const mx = camX + vx, my = camY + vy;
                if (mx >= MAP_W || my >= MAP_H) continue;
                const px = vx * TILE, py = vy * TILE;
                const seen = G.seen[my][mx], vis = G.visible[my][mx];
                if (!seen) continue; // unexplored = black
                const tile = G.map[my][mx];
                // floor/wall
                if (tile === WALL) ctx.fillStyle = vis ? "#2a2740" : "#15131f";
                else if (tile === STAIRS) ctx.fillStyle = vis ? "#fbbf24" : "#6b5a1f";
                else ctx.fillStyle = vis ? "#1c1a2e" : "#121020";
                ctx.fillRect(px, py, TILE, TILE);
                if (tile === STAIRS) { ctx.fillStyle = "#07060d"; ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.fillText("▼", px + TILE / 2, py + TILE / 2 + 6); }

                if (!vis) continue; // only draw entities in bright tiles
                // pickups
                const pk = G.pickups.find((p) => p.x === mx && p.y === my);
                if (pk) { ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.fillText({ potion: "🧪", gold: "💰", weapon: "⚔️" }[pk.kind], px + TILE / 2, py + TILE / 2 + 6); }
                // enemies
                const en = enemyAt(mx, my);
                if (en) { ctx.font = "18px sans-serif"; ctx.textAlign = "center"; ctx.fillText(en.glyph, px + TILE / 2, py + TILE / 2 + 6); }
            }
        }
        // player
        const ppx = (G.player.x - camX) * TILE, ppy = (G.player.y - camY) * TILE;
        ctx.fillStyle = primary;
        ctx.beginPath(); ctx.arc(ppx + TILE / 2, ppy + TILE / 2, TILE * 0.32, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "14px sans-serif"; ctx.textAlign = "center"; ctx.fillText("@", ppx + TILE / 2, ppy + TILE / 2 + 5);

        // HUD strip
        const hy = VIEW_H * TILE;
        ctx.fillStyle = "#0b0a12"; ctx.fillRect(0, hy, CW, 70);
        ctx.textAlign = "left"; ctx.font = "12px sans-serif";
        // HP bar
        ctx.fillStyle = "#334155"; ctx.fillRect(8, hy + 8, 120, 10);
        ctx.fillStyle = "#ef4444"; ctx.fillRect(8, hy + 8, 120 * Math.max(0, G.player.hp / G.player.maxHp), 10);
        ctx.fillStyle = "#fff";
        ctx.fillText(`HP ${G.player.hp}/${G.player.maxHp}`, 134, hy + 17);
        ctx.fillText(`ATK ${G.player.atk}`, 230, hy + 17);
        ctx.fillText(`Gold ${G.player.gold}`, 300, hy + 17);
        ctx.fillText(`Floor ${G.floor}/${FLOORS}`, 380, hy + 17);
        // log
        ctx.fillStyle = "#94a3b8"; ctx.font = "11px sans-serif";
        G.log.forEach((m, i) => ctx.fillText(m, 8, hy + 34 + i * 12));

        if (G.over || G.won) {
            ctx.fillStyle = "rgba(7,6,13,0.88)"; ctx.fillRect(0, 0, CW, VIEW_H * TILE);
            ctx.fillStyle = "#fff"; ctx.textAlign = "center";
            ctx.font = "bold 24px sans-serif";
            ctx.fillText(G.won ? "🏆 You cleared the dungeon!" : "💀 You died", CW / 2, CH / 2 - 40);
            ctx.font = "14px sans-serif";
            ctx.fillText(`Floor ${G.floor} · Gold ${G.player.gold} · Kills ${G.kills}`, CW / 2, CH / 2 - 14);
            ctx.fillText(`Score: ${G.player.gold + G.floor * 100 + (G.won ? 500 : 0)}`, CW / 2, CH / 2 + 8);
            ctx.fillText("Press R to start a new run", CW / 2, CH / 2 + 32);
        }
    };

    // ── Controls ──
    const startRun = (seedNum) => {
        seed = seedNum != null ? seedNum : (Math.floor(Math.random() * 1e9));
        rng = mulberry32(seed >>> 0);
        G.map = []; G.player = { x: 0, y: 0, hp: 20, maxHp: 20, atk: 4, gold: 0 };
        G.floor = 1; G.log = []; G.over = false; G.won = false; G.kills = 0;
        genFloor();
        pad.querySelector("[data-seed]").textContent = `Seed: ${seed}`;
        api.onScore?.(0);
        api.onBest?.(loadBest(GAME_ID));
        render();
    };

    const onKey = (e) => {
        const k = e.key.toLowerCase();
        const moves = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
        if (moves[k]) { e.preventDefault(); tryMove(moves[k][0], moves[k][1]); }
        else if (k === "r") { e.preventDefault(); startRun(); }
    };
    canvas.addEventListener("keydown", onKey);
    const onCanvasClick = () => canvas.focus();
    canvas.addEventListener("mousedown", onCanvasClick);

    const onPad = (e) => {
        const dir = e.target?.dataset?.dir;
        const act = e.target?.dataset?.act;
        if (dir) { canvas.focus(); const m = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }[dir]; tryMove(m[0], m[1]); }
        else if (act === "copy") { try { navigator.clipboard?.writeText(String(seed)); addLog("Seed copied."); render(); } catch { /* ignore */ } }
        else if (act === "play") { const v = parseInt(pad.querySelector("[data-seedin]").value, 10); if (Number.isFinite(v)) startRun(v); }
    };
    pad.addEventListener("click", onPad);

    canvas.focus();
    startRun();

    return () => {
        canvas.removeEventListener("keydown", onKey);
        canvas.removeEventListener("mousedown", onCanvasClick);
        pad.removeEventListener("click", onPad);
        el.innerHTML = "";
    };
}
