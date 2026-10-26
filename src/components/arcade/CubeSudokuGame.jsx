// Cube Sudoku — 6x6 (2x3 boxes) or 9x9, Rubik-cube color tiles. DOM/CSS.
// Factory: mount(el, api) => cleanup().
import { loadBest, saveBest, mulberry32, strToSeed, todaySeedString } from "@/components/arcade/arcadeUtils.js";
import { playSound } from "@/lib/sound";

const GAME_ID = "cubesudoku";
// Rubik cube colors per digit (1..9). Colorblind-safe because the number is printed.
const CUBE_COLORS = ["", "#f8fafc", "#fde047", "#ef4444", "#fb923c", "#3b82f6", "#22c55e", "#a855f7", "#ec4899", "#14b8a6"];

// Box dimensions per grid size.
const CFG = {
    6: { N: 6, bw: 3, bh: 2, givens: { easy: 20, medium: 16, hard: 12 } },
    9: { N: 9, bw: 3, bh: 3, givens: { easy: 38, medium: 32, hard: 26 } },
};

export default function mountCubeSudoku(el, api) {
    el.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:0.5rem;width:100%;height:100%;overflow:auto;padding:0.4rem;color:#fff;";
    el.appendChild(wrap);

    const bar = document.createElement("div");
    bar.style.cssText = "display:flex;gap:0.35rem;flex-wrap:wrap;align-items:center;justify-content:center;font-size:0.68rem;";
    bar.innerHTML = `
        <select data-size class="arcade-btn arcade-btn--ghost" style="padding:.25rem .4rem;">
            <option value="6" selected>6×6 Cube</option>
            <option value="9">Classic 9×9</option>
        </select>
        <select data-diff class="arcade-btn arcade-btn--ghost" style="padding:.25rem .4rem;">
            <option value="easy" selected>Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        </select>
        <button type="button" data-act="daily" class="arcade-btn arcade-btn--ghost">Daily</button>
        <button type="button" data-act="new" class="arcade-btn arcade-btn--ghost">New</button>
        <button type="button" data-act="notes" class="arcade-btn arcade-btn--ghost">Notes: off</button>
        <button type="button" data-act="hint" class="arcade-btn arcade-btn--ghost">Hint (3)</button>
        <button type="button" data-act="undo" class="arcade-btn arcade-btn--ghost">Undo</button>
    `;
    wrap.appendChild(bar);

    const status = document.createElement("div");
    status.style.cssText = "font-size:0.72rem;opacity:.85;min-height:1.1em;text-align:center;";
    wrap.appendChild(status);

    const boardEl = document.createElement("div");
    boardEl.style.cssText = "display:grid;gap:2px;background:hsl(var(--border));padding:3px;border-radius:.5rem;width:100%;max-width:360px;touch-action:manipulation;";
    wrap.appendChild(boardEl);

    const palette = document.createElement("div");
    palette.style.cssText = "display:flex;gap:4px;flex-wrap:wrap;justify-content:center;";
    wrap.appendChild(palette);

    const banner = document.createElement("div");
    banner.style.cssText = "min-height:1.2em;text-align:center;font-size:0.8rem;";
    wrap.appendChild(banner);

    // ── State ──
    let size = 6, diff = "easy";
    let N = 6, BW = 3, BH = 2;
    let solution = [], puzzle = [], given = [], notes = [];
    let selected = -1, notesMode = false, mistakes = 0, hints = 3;
    let history = [];
    let startTime = 0, timerId = null, timer = 0;
    let rng = Math.random;
    let dailyMode = false;
    let solved = false;

    const idx = (r, c) => r * N + c;

    // ── Generator ──
    const boxStart = (r, c) => [Math.floor(r / BH) * BH, Math.floor(c / BW) * BW];
    const valid = (grid, r, c, v) => {
        for (let i = 0; i < N; i++) {
            if (grid[idx(r, i)] === v) return false;
            if (grid[idx(i, c)] === v) return false;
        }
        const [br, bc] = boxStart(r, c);
        for (let dr = 0; dr < BH; dr++) for (let dc = 0; dc < BW; dc++) if (grid[idx(br + dr, bc + dc)] === v) return false;
        return true;
    };
    const fillSolve = (grid, counting) => {
        const pos = grid.indexOf(0);
        if (pos === -1) return 1;
        const r = Math.floor(pos / N), c = pos % N;
        let nums = [];
        for (let v = 1; v <= N; v++) nums.push(v);
        if (!counting) { // shuffle for generation
            for (let i = nums.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [nums[i], nums[j]] = [nums[j], nums[i]]; }
        }
        let count = 0;
        for (const v of nums) {
            if (valid(grid, r, c, v)) {
                grid[idx(r, c)] = v;
                count += fillSolve(grid, counting);
                if (!counting && count) return count; // generation: first success
                if (counting && count > 1) { grid[idx(r, c)] = 0; return count; } // early out
            }
        }
        grid[idx(r, c)] = 0;
        return count;
    };
    const countSolutions = (grid) => fillSolve(grid.slice(), true);

    const generate = () => {
        solution = new Array(N * N).fill(0);
        fillSolve(solution, false);
        // remove cells while keeping a unique solution
        const order = [];
        for (let i = 0; i < N * N; i++) order.push(i);
        for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
        puzzle = solution.slice();
        const targetGivens = CFG[size].givens[diff];
        let filled = N * N;
        for (const cell of order) {
            if (filled <= targetGivens) break;
            const backup = puzzle[cell];
            puzzle[cell] = 0;
            if (countSolutions(puzzle) !== 1) { puzzle[cell] = backup; }
            else filled--;
        }
        given = puzzle.map((v) => v !== 0);
        notes = Array.from({ length: N * N }, () => new Set());
    };

    const stopTimer = () => { if (timerId) clearInterval(timerId); timerId = null; };
    const startTimer = () => { stopTimer(); startTime = Date.now(); timerId = setInterval(() => { timer = Math.floor((Date.now() - startTime) / 1000); updateStatus(); }, 500); };

    const newGame = () => {
        const c = CFG[size]; N = c.N; BW = c.bw; BH = c.bh;
        rng = dailyMode ? mulberry32(strToSeed(`${todaySeedString()}:${size}:${diff}`)) : Math.random;
        selected = -1; mistakes = 0; hints = 3; history = []; solved = false; timer = 0;
        generate();
        bar.querySelector("[data-act='hint']").textContent = `Hint (${hints})`;
        banner.textContent = "";
        status.textContent = dailyMode ? `Daily: ${todaySeedString()}` : "";
        boardEl.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
        renderPalette();
        render();
        startTimer();
    };

    const hasConflict = (cell) => {
        const v = puzzle[cell]; if (!v) return false;
        const r = Math.floor(cell / N), c = cell % N;
        for (let i = 0; i < N; i++) {
            if (i !== c && puzzle[idx(r, i)] === v) return true;
            if (i !== r && puzzle[idx(i, c)] === v) return true;
        }
        const [br, bc] = boxStart(r, c);
        for (let dr = 0; dr < BH; dr++) for (let dc = 0; dc < BW; dc++) { const cc = idx(br + dr, bc + dc); if (cc !== cell && puzzle[cc] === v) return true; }
        return false;
    };

    const checkWin = () => {
        if (puzzle.some((v) => v === 0)) return;
        for (let i = 0; i < N * N; i++) if (puzzle[i] !== solution[i]) return;
        solved = true; stopTimer(); playSound("complete");
        const score = Math.max(0, 1000 - timer * 2 - mistakes * 50) + (size === 9 ? 300 : 0);
        if (score > loadBest(GAME_ID)) saveBest(GAME_ID, score);
        api.onScore?.(score); api.onBest?.(loadBest(GAME_ID));
        banner.textContent = `🎉 Solved in ${timer}s with ${mistakes} mistakes! Score ${score}`;
        boardEl.classList.add("cube-sudoku-ripple");
    };

    const place = (v) => {
        if (solved || selected < 0 || given[selected]) return;
        history.push({ cell: selected, prev: puzzle[selected], prevNotes: new Set(notes[selected]) });
        if (notesMode && v !== 0) {
            if (notes[selected].has(v)) notes[selected].delete(v); else notes[selected].add(v);
            playSound("place"); render(); return;
        }
        if (v === 0) { puzzle[selected] = 0; playSound("erase"); render(); return; }
        puzzle[selected] = v;
        notes[selected].clear();
        if (v !== solution[selected]) { mistakes++; playSound("error"); if (mistakes >= 3) { banner.textContent = "❌ 3 mistakes — puzzle failed. Press New."; stopTimer(); solved = true; playSound("fail"); } }
        else playSound("place");
        updateStatus(); render(); checkWin();
    };

    const hint = () => {
        if (solved || hints <= 0) return;
        const empties = [];
        for (let i = 0; i < N * N; i++) if (!puzzle[i]) empties.push(i);
        if (!empties.length) return;
        const cell = empties[Math.floor(Math.random() * empties.length)];
        history.push({ cell, prev: puzzle[cell], prevNotes: new Set(notes[cell]) });
        puzzle[cell] = solution[cell];
        hints--;
        bar.querySelector("[data-act='hint']").textContent = `Hint (${hints})`;
        playSound("place");
        render(); checkWin();
    };

    const undo = () => {
        const last = history.pop();
        if (!last) return;
        puzzle[last.cell] = last.prev;
        notes[last.cell] = last.prevNotes;
        render();
    };

    const updateStatus = () => {
        status.textContent = `${dailyMode ? `Daily ${todaySeedString()} · ` : ""}${timer}s · Mistakes ${mistakes}/3 · Best ${loadBest(GAME_ID) || "—"}`;
    };

    const renderPalette = () => {
        palette.innerHTML = "";
        for (let v = 1; v <= N; v++) {
            const b = document.createElement("button");
            b.type = "button";
            b.setAttribute("aria-label", `Place ${v}`);
            b.style.cssText = `width:30px;height:30px;border-radius:.4rem;border:1px solid hsl(var(--border));font-weight:700;cursor:pointer;color:${v === 1 ? "#111" : "#fff"};background:${CUBE_COLORS[v]};`;
            b.textContent = v;
            b.addEventListener("click", () => place(v));
            palette.appendChild(b);
        }
        const er = document.createElement("button");
        er.type = "button"; er.textContent = "⌫"; er.setAttribute("aria-label", "Erase");
        er.style.cssText = "width:30px;height:30px;border-radius:.4rem;border:1px solid hsl(var(--border));cursor:pointer;background:hsl(var(--card));color:#fff;";
        er.addEventListener("click", () => place(0));
        palette.appendChild(er);
    };

    const render = () => {
        boardEl.innerHTML = "";
        for (let i = 0; i < N * N; i++) {
            const r = Math.floor(i / N), c = i % N;
            const v = puzzle[i];
            const cell = document.createElement("button");
            cell.type = "button";
            cell.setAttribute("aria-label", v ? `Row ${r + 1} column ${c + 1}, ${v}` : `Row ${r + 1} column ${c + 1}, empty`);
            const conflict = hasConflict(i);
            const thickR = (r % BH === BH - 1) && r !== N - 1;
            const thickC = (c % BW === BW - 1) && c !== N - 1;
            cell.style.cssText = `aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:clamp(12px,3.5vw,18px);cursor:pointer;border:none;border-radius:.3rem;position:relative;` +
                `color:${v === 1 ? "#111" : "#fff"};` +
                `background:${v ? CUBE_COLORS[v] : "hsl(var(--card))"};` +
                `outline:${selected === i ? "2px solid hsl(var(--primary))" : conflict ? "2px solid #ef4444" : "none"};` +
                `margin-bottom:${thickR ? "2px" : "0"};margin-right:${thickC ? "2px" : "0"};` +
                `opacity:${given[i] ? "1" : "0.95"};`;
            if (v) cell.textContent = v;
            else if (notes[i].size) {
                cell.style.fontSize = "7px"; cell.style.color = "hsl(var(--muted-foreground))";
                cell.textContent = [...notes[i]].sort().join("");
            }
            if (given[i]) cell.style.fontWeight = "900";
            cell.addEventListener("click", () => { selected = i; playSound("click"); render(); });
            boardEl.appendChild(cell);
        }
        updateStatus();
    };

    // ── Input ──
    const onKey = (e) => {
        if (selected < 0) return;
        const k = e.key;
        if (/^[1-9]$/.test(k)) { const v = parseInt(k, 10); if (v <= N) { e.preventDefault(); place(v); } }
        else if (k === "Backspace" || k === "Delete" || k === "0") { e.preventDefault(); place(0); }
        else if (k.startsWith("Arrow")) {
            e.preventDefault();
            let r = Math.floor(selected / N), c = selected % N;
            if (k === "ArrowUp") r = (r - 1 + N) % N;
            else if (k === "ArrowDown") r = (r + 1) % N;
            else if (k === "ArrowLeft") c = (c - 1 + N) % N;
            else if (k === "ArrowRight") c = (c + 1) % N;
            selected = idx(r, c); render();
        }
    };
    boardEl.tabIndex = 0;
    boardEl.addEventListener("keydown", onKey);

    const onBar = (e) => {
        const act = e.target?.dataset?.act;
        if (act === "new") { dailyMode = false; newGame(); }
        else if (act === "daily") { dailyMode = true; newGame(); }
        else if (act === "notes") { notesMode = !notesMode; e.target.textContent = `Notes: ${notesMode ? "on" : "off"}`; playSound("click"); }
        else if (act === "hint") hint();
        else if (act === "undo") undo();
    };
    bar.addEventListener("click", onBar);
    const sizeSel = bar.querySelector("[data-size]");
    const diffSel = bar.querySelector("[data-diff]");
    const onSize = (e) => { size = parseInt(e.target.value, 10); newGame(); };
    const onDiffCh = (e) => { diff = e.target.value; newGame(); };
    sizeSel.addEventListener("change", onSize);
    diffSel.addEventListener("change", onDiffCh);

    newGame();

    return () => {
        stopTimer();
        boardEl.removeEventListener("keydown", onKey);
        bar.removeEventListener("click", onBar);
        sizeSel.removeEventListener("change", onSize);
        diffSel.removeEventListener("change", onDiffCh);
        el.innerHTML = "";
    };
}
