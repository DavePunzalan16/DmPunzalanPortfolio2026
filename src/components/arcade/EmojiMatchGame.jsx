// Emoji Match (memory) — DOM/CSS flip cards. Factory: mount(el, api) => cleanup().
import { loadBest, saveBest, prefersReducedMotion } from "@/components/arcade/arcadeUtils.js";
import { playSound } from "@/lib/sound";

const GAME_ID = "emojimatch";
// Emojis themed to the profile (cube, cloud, paw, code, mountain, Japan, ...).
const EMOJIS = ["🧩", "☁️", "🐾", "💻", "⛰️", "🗾", "🎮", "⚡", "🤖", "🚀", "🎨", "🏆"];

const DIFF = {
    easy: { cols: 4, rows: 3, label: "Easy 4×3" },
    normal: { cols: 4, rows: 4, label: "Normal 4×4" },
    hard: { cols: 6, rows: 4, label: "Hard 6×4" },
};

const shuffle = (arr) => { // Fisher-Yates
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export default function mountEmojiMatch(el, api) {
    const reduced = prefersReducedMotion();
    el.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:0.5rem;width:100%;height:100%;overflow:auto;padding:0.4rem;color:#fff;";
    el.appendChild(wrap);

    const bar = document.createElement("div");
    bar.style.cssText = "display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;justify-content:center;font-size:0.72rem;";
    bar.innerHTML = `
        <select data-diff class="arcade-btn arcade-btn--ghost" style="padding:.3rem .5rem;">
            <option value="easy">Easy 4×3</option>
            <option value="normal" selected>Normal 4×4</option>
            <option value="hard">Hard 6×4</option>
        </select>
        <button type="button" data-act="new" class="arcade-btn arcade-btn--ghost">New</button>
        <span data-stats style="opacity:.85;"></span>
    `;
    wrap.appendChild(bar);

    const board = document.createElement("div");
    board.style.cssText = "display:grid;gap:6px;width:100%;max-width:420px;";
    wrap.appendChild(board);

    const banner = document.createElement("div");
    banner.style.cssText = "min-height:1.4em;text-align:center;font-size:0.8rem;";
    wrap.appendChild(banner);

    let diff = "normal";
    let cards = [];      // { id, emoji, flipped, matched }
    let first = null, lock = false;
    let moves = 0, matches = 0, combo = 0;
    let startTime = 0, timer = 0, timerId = null;
    let best = loadBest(GAME_ID);
    api.onBest?.(best);

    const fmtStats = () => {
        bar.querySelector("[data-stats]").textContent = `Moves ${moves} · ${timer}s · Best ${best || "—"}`;
    };

    const stopTimer = () => { if (timerId) { clearInterval(timerId); timerId = null; } };
    const startTimer = () => {
        stopTimer();
        startTime = Date.now();
        timerId = setInterval(() => { timer = Math.floor((Date.now() - startTime) / 1000); fmtStats(); }, 500);
    };

    const build = () => {
        stopTimer();
        const { cols, rows } = DIFF[diff];
        const pairCount = (cols * rows) / 2;
        const picks = shuffle(EMOJIS).slice(0, pairCount);
        cards = shuffle([...picks, ...picks].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })));
        first = null; lock = false; moves = 0; matches = 0; combo = 0; timer = 0;
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        banner.textContent = "";
        render();
        fmtStats();
        startTimer();
    };

    const onCardClick = (idx) => {
        if (lock) return;
        const c = cards[idx];
        if (c.flipped || c.matched) return;
        c.flipped = true;
        playSound("ematchflip");
        render();
        if (!first) { first = c; return; }
        // second card
        moves++;
        if (first.emoji === c.emoji) {
            first.matched = c.matched = true;
            matches++; combo++;
            playSound("ematch");
            first = null;
            render(); fmtStats();
            if (matches === cards.length / 2) win();
        } else {
            combo = 0;
            lock = true;
            playSound("emismatch");
            fmtStats();
            setTimeout(() => {
                first.flipped = false; c.flipped = false; first = null; lock = false; render();
            }, reduced ? 350 : 750);
        }
    };

    const stars = () => {
        const { cols, rows } = DIFF[diff];
        const perfect = (cols * rows) / 2;
        const ratio = moves / perfect;
        if (ratio <= 1.3) return 3;
        if (ratio <= 1.8) return 2;
        return 1;
    };

    const win = () => {
        stopTimer();
        playSound("win");
        const score = Math.max(0, 1000 - moves * 10 - timer * 2) + combo * 5;
        if (score > best) { best = score; saveBest(GAME_ID, best); api.onBest?.(best); }
        api.onScore?.(score);
        banner.innerHTML = `🎉 Solved in <strong>${moves}</strong> moves, <strong>${timer}s</strong> — ${"⭐".repeat(stars())} · Score ${score}`;
        if (!reduced) confetti();
    };

    const confetti = () => {
        const c = document.createElement("div");
        c.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;";
        wrap.style.position = "relative";
        wrap.appendChild(c);
        const colors = ["#8b5cf6", "#60a5fa", "#34d399", "#f59e0b", "#ef4444"];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement("div");
            p.style.cssText = `position:absolute;width:8px;height:8px;border-radius:2px;left:${Math.random() * 100}%;top:-10px;background:${colors[i % colors.length]};`;
            p.animate(
                [
                    { transform: "translateY(0) rotate(0deg)", opacity: 1 },
                    { transform: `translateY(${280 + Math.random() * 220}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
                ],
                { duration: 1300 + Math.random() * 700, easing: "cubic-bezier(.3,.7,.4,1)" }
            );
            c.appendChild(p);
        }
        setTimeout(() => c.remove(), 2200);
    };

    const render = () => {
        board.innerHTML = "";
        cards.forEach((c, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("aria-label", c.matched || c.flipped ? `Card ${c.emoji}` : "Hidden card");
            btn.style.cssText = `aspect-ratio:1;border-radius:.6rem;border:1px solid hsl(var(--border));font-size:clamp(18px,6vw,30px);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s, background .2s;${c.matched ? "background:hsl(var(--primary)/0.25);" : c.flipped ? "background:hsl(var(--secondary));" : "background:hsl(var(--card));"}`;
            btn.textContent = c.flipped || c.matched ? c.emoji : "";
            if (!c.flipped && !c.matched) btn.textContent = "❓";
            btn.addEventListener("click", () => onCardClick(idx));
            board.appendChild(btn);
        });
    };

    const onBar = (e) => { if (e.target?.dataset?.act === "new") build(); };
    const onDiff = (e) => { diff = e.target.value; build(); };
    bar.addEventListener("click", onBar);
    const diffSel = bar.querySelector("[data-diff]");
    diffSel.addEventListener("change", onDiff);

    build();

    return () => {
        stopTimer();
        bar.removeEventListener("click", onBar);
        diffSel.removeEventListener("change", onDiff);
        el.innerHTML = "";
    };
}
