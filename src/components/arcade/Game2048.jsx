// 2048 with a Bomb twist + Daily Challenge — DOM/CSS implementation.
// Factory: mount(el, api) => cleanup(). api: { onScore, onBest, isMuted }.
import {
    loadBest, saveBest, prefersReducedMotion, mulberry32, strToSeed, todaySeedString,
} from "@/components/arcade/arcadeUtils.js";
import { playSound } from "@/lib/sound";

const SIZE = 4;
const GAME_ID = "bomb2048";

const tileColor = (v) => {
    const map = {
        2: "#3b3550", 4: "#4b4168", 8: "#6d4bd0", 16: "#7c5cff",
        32: "#8b5cf6", 64: "#a855f7", 128: "#c084fc", 256: "#d8b4fe",
        512: "#f0abfc", 1024: "#f5d0fe", 2048: "#fde68a",
    };
    return map[v] || "#fef3c7";
};
const tileText = (v) => (v <= 4 ? "#cbd5e1" : v >= 1024 ? "#1a1025" : "#fff");

export default function mount2048(el, api) {
    const reduced = prefersReducedMotion();

    // ── UI scaffold ──
    el.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:0.6rem;padding:0.5rem;width:100%;height:100%;overflow:auto;color:#fff;";
    el.appendChild(wrap);

    const controls = document.createElement("div");
    controls.style.cssText = "display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;justify-content:center;font-size:0.75rem;";
    controls.innerHTML = `
        <button type="button" data-act="undo" class="arcade-btn arcade-btn--ghost">↶ Undo</button>
        <button type="button" data-act="new" class="arcade-btn arcade-btn--ghost">New</button>
        <label style="display:inline-flex;align-items:center;gap:.3rem;cursor:pointer;">
            <input type="checkbox" data-act="daily" /> Daily Seed
        </label>
    `;
    wrap.appendChild(controls);

    const seedLabel = document.createElement("div");
    seedLabel.style.cssText = "font-size:0.7rem;opacity:0.7;min-height:1em;";
    wrap.appendChild(seedLabel);

    const board = document.createElement("div");
    board.className = "arcade-2048-board";
    board.tabIndex = 0;
    board.setAttribute("role", "application");
    board.setAttribute("aria-label", "2048 bomb game board. Use arrow keys or swipe to move tiles.");
    wrap.appendChild(board);

    const banner = document.createElement("div");
    banner.style.cssText = "font-size:0.8rem;min-height:1.2em;text-align:center;";
    wrap.appendChild(banner);

    // ── State ──
    let rng = Math.random;
    let daily = false;
    let grid = [];            // 2D array of {v, bomb} | null
    let score = 0;
    let best = loadBest(GAME_ID);
    let prev = null;          // snapshot for one-level undo
    let won = false;
    let keepGoing = false;
    let gap, cellSize;        // layout

    api.onBest?.(best);

    const measure = () => {
        const inner = board.clientWidth * 0.96;
        gap = board.clientWidth * 0.02;
        cellSize = (inner - gap * (SIZE - 1)) / SIZE;
    };

    const emptyCells = () => {
        const out = [];
        for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!grid[r][c]) out.push([r, c]);
        return out;
    };

    const filledCount = () => SIZE * SIZE - emptyCells().length;

    const spawn = () => {
        const cells = emptyCells();
        if (!cells.length) return;
        const [r, c] = cells[Math.floor(rng() * cells.length)];
        // Bomb: ~1/12 chance, only when at least 6 cells already filled.
        const isBomb = filledCount() >= 6 && rng() < 1 / 12;
        grid[r][c] = { v: rng() < 0.9 ? 2 : 4, bomb: isBomb };
    };

    const reset = () => {
        grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
        score = 0; won = false; keepGoing = false; prev = null;
        if (daily) {
            const s = todaySeedString();
            rng = mulberry32(strToSeed(s));
            seedLabel.textContent = `Today's seed: ${s}`;
        } else {
            rng = Math.random;
            seedLabel.textContent = "Normal mode (random seed)";
        }
        spawn(); spawn();
        api.onScore?.(score);
        banner.textContent = "";
        render();
    };

    const snapshot = () => ({
        grid: grid.map((row) => row.map((c) => (c ? { ...c } : null))),
        score,
    });

    const cloneGridToState = (snap) => {
        grid = snap.grid.map((row) => row.map((c) => (c ? { ...c } : null)));
        score = snap.score;
    };

    // Explosion: clear a square radius around (r,c). radius 1 = 3x3 (8 neighbors),
    // radius 2 = 5x5. Award points for cleared tiles.
    const explode = (r, c, radius) => {
        for (let dr = -radius; dr <= radius; dr++) {
            for (let dc = -radius; dc <= radius; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nc < 0 || nr >= SIZE || nc >= SIZE) continue;
                if (grid[nr][nc]) { score += grid[nr][nc].v; grid[nr][nc] = null; }
            }
        }
    };

    // Slide+merge one line (array of cells, left-ward). Returns {line, moved, merges[]}.
    const slideLine = (line) => {
        const filtered = line.filter(Boolean);
        const out = [];
        for (let i = 0; i < filtered.length; i++) {
            const a = filtered[i];
            const b = filtered[i + 1];
            if (b && (a.v === b.v || a.bomb || b.bomb)) {
                if (a.bomb || b.bomb) {
                    const bothBombs = a.bomb && b.bomb;
                    out.push({ v: a.v + b.v, bomb: false, _explode: bothBombs ? 2 : 1 });
                } else {
                    out.push({ v: a.v * 2, bomb: false });
                    score += a.v * 2;
                    if (a.v * 2 === 2048 && !won) won = true;
                }
                i++; // consume b
            } else {
                out.push({ ...a });
            }
        }
        while (out.length < SIZE) out.push(null);
        return out;
    };

    const getLine = (idx, dir) => {
        // dir: 'L','R','U','D' — returns array in the direction of travel (toward start)
        const line = [];
        for (let i = 0; i < SIZE; i++) {
            if (dir === "L") line.push(grid[idx][i]);
            else if (dir === "R") line.push(grid[idx][SIZE - 1 - i]);
            else if (dir === "U") line.push(grid[i][idx]);
            else line.push(grid[SIZE - 1 - i][idx]);
        }
        return line;
    };
    const setLine = (idx, dir, line) => {
        for (let i = 0; i < SIZE; i++) {
            const cell = line[i];
            if (dir === "L") grid[idx][i] = cell;
            else if (dir === "R") grid[idx][SIZE - 1 - i] = cell;
            else if (dir === "U") grid[i][idx] = cell;
            else grid[SIZE - 1 - i][idx] = cell;
        }
    };

    const serialize = () => grid.map((row) => row.map((c) => (c ? `${c.v}${c.bomb ? "b" : ""}` : "-")).join(",")).join("|");

    const move = (dir) => {
        if (won && !keepGoing) return;
        const before = serialize();
        const snap = snapshot();
        const explosions = [];

        for (let idx = 0; idx < SIZE; idx++) {
            const line = getLine(idx, dir);
            const result = slideLine(line);
            // record explosions produced in this line
            result.forEach((cell, i) => {
                if (cell && cell._explode) {
                    // translate (idx,i) back to grid coords
                    let r, c;
                    if (dir === "L") { r = idx; c = i; }
                    else if (dir === "R") { r = idx; c = SIZE - 1 - i; }
                    else if (dir === "U") { r = i; c = idx; }
                    else { r = SIZE - 1 - i; c = idx; }
                    explosions.push({ r, c, radius: cell._explode });
                    delete cell._explode;
                }
            });
            setLine(idx, dir, result);
        }

        // apply explosions after placement
        explosions.forEach((e) => explode(e.r, e.c, e.radius));

        const after = serialize();
        if (after === before && explosions.length === 0) return; // no move

        if (explosions.length) playSound("bomb");
        else if (score > snap.score) playSound("merge");
        else playSound("slide");

        prev = snap;
        spawn();
        if (score > best) { best = score; saveBest(GAME_ID, best); api.onBest?.(best); }
        api.onScore?.(score);

        if (won && !keepGoing) banner.innerHTML = `🎉 You reached 2048! <button type="button" data-act="keep" class="arcade-btn arcade-btn--ghost">Keep going</button>`;
        else if (isGameOver()) banner.textContent = "Game over — no moves left. Press New.";
        else banner.textContent = explosions.length ? "💥 Boom!" : "";

        render();
    };

    const isGameOver = () => {
        if (emptyCells().length) return false;
        for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
            const v = grid[r][c];
            if (!v) continue;
            if (c < SIZE - 1 && grid[r][c + 1] && (grid[r][c + 1].v === v.v || v.bomb || grid[r][c + 1].bomb)) return false;
            if (r < SIZE - 1 && grid[r + 1][c] && (grid[r + 1][c].v === v.v || v.bomb || grid[r + 1][c].bomb)) return false;
        }
        return true;
    };

    const render = () => {
        measure();
        board.innerHTML = "";
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const cell = grid[r][c];
                if (!cell) continue;
                const d = document.createElement("div");
                d.className = "arcade-2048-cell";
                const pad = board.clientWidth * 0.02;
                d.style.width = `${cellSize}px`;
                d.style.height = `${cellSize}px`;
                d.style.transform = `translate(${pad + c * (cellSize + gap)}px, ${pad + r * (cellSize + gap)}px)`;
                d.style.background = cell.bomb ? "#1f2937" : tileColor(cell.v);
                d.style.color = tileText(cell.v);
                d.style.fontSize = `${Math.max(12, cellSize * (cell.v >= 1000 ? 0.28 : 0.4))}px`;
                if (cell.bomb) {
                    d.textContent = "💣";
                    if (!reduced) d.style.animation = "cert-shimmer 1.2s ease-in-out infinite";
                    d.style.boxShadow = "0 0 12px rgba(239,68,68,0.6)";
                } else {
                    d.textContent = cell.v;
                }
                board.appendChild(d);
            }
        }
    };

    // ── Input ──
    const onKey = (e) => {
        const k = e.key.toLowerCase();
        const map = { arrowleft: "L", a: "L", arrowright: "R", d: "R", arrowup: "U", w: "U", arrowdown: "D", s: "D" };
        if (map[k]) { e.preventDefault(); move(map[k]); }
    };
    board.addEventListener("keydown", onKey);

    let tsx = null, tsy = null;
    const onTouchStart = (e) => { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
        if (tsx == null) return;
        const dx = e.changedTouches[0].clientX - tsx;
        const dy = e.changedTouches[0].clientY - tsy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
            if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "R" : "L");
            else move(dy > 0 ? "D" : "U");
        }
        tsx = tsy = null;
    };
    board.addEventListener("touchstart", onTouchStart, { passive: true });
    board.addEventListener("touchend", onTouchEnd, { passive: true });

    const onControlClick = (e) => {
        const act = e.target?.dataset?.act;
        if (act === "undo") { if (prev) { cloneGridToState(prev); prev = null; api.onScore?.(score); banner.textContent = ""; render(); } }
        else if (act === "new") reset();
        else if (act === "daily") { daily = e.target.checked; reset(); }
    };
    controls.addEventListener("click", onControlClick);
    controls.addEventListener("change", onControlClick);
    const onBannerClick = (e) => { if (e.target?.dataset?.act === "keep") { keepGoing = true; banner.textContent = ""; } };
    banner.addEventListener("click", onBannerClick);

    const onResize = () => render();
    window.addEventListener("resize", onResize);

    board.focus();
    reset();

    return () => {
        board.removeEventListener("keydown", onKey);
        board.removeEventListener("touchstart", onTouchStart);
        board.removeEventListener("touchend", onTouchEnd);
        controls.removeEventListener("click", onControlClick);
        controls.removeEventListener("change", onControlClick);
        banner.removeEventListener("click", onBannerClick);
        window.removeEventListener("resize", onResize);
        el.innerHTML = "";
    };
}
