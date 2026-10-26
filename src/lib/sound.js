// ============================================================================
// Tiny WebAudio sound engine — no audio files, no deps.
//  - AudioContext created lazily, only AFTER the first user gesture.
//  - Low master volume (~0.15). ON by default once unlocked.
//  - Mute persisted in localStorage (try/catch). Throttled (~20 sounds/sec).
//  - playSound(name) with a library of UI + per-game effects.
// ============================================================================

const MUTE_KEY = "portfolio-arcade:muted";
const MASTER = 0.15;

let ctx = null;
let master = null;
let muted = loadMuted();
let unlocked = false;
const listeners = new Set();

function loadMuted() {
    try {
        const v = localStorage.getItem(MUTE_KEY);
        return v === "1";
    } catch {
        return false;
    }
}
function persistMuted() {
    try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch { /* ignore */ }
}

// Throttle: cap how many sounds start per 50ms window.
let windowStart = 0;
let windowCount = 0;
function throttled() {
    const now = performance.now();
    if (now - windowStart > 50) { windowStart = now; windowCount = 0; }
    windowCount += 1;
    return windowCount > 1; // ~20/sec
}

function ensureCtx() {
    if (ctx) return ctx;
    try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = MASTER;
        master.connect(ctx.destination);
    } catch {
        ctx = null;
    }
    return ctx;
}

// Call once on the first user gesture to unlock audio.
export function unlockAudio() {
    unlocked = true;
    const c = ensureCtx();
    if (c && c.state === "suspended") c.resume().catch(() => {});
}

export function isMuted() { return muted; }
export function setMuted(v) { muted = !!v; persistMuted(); listeners.forEach((fn) => fn(muted)); }
export function toggleMuted() { setMuted(!muted); return muted; }
export function onMuteChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// ── Low-level voices ──
function tone({ freq = 440, type = "sine", dur = 0.12, vol = 0.6, glide = 0, delay = 0 }) {
    const c = ensureCtx();
    if (!c || !master) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq + glide), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.15, vol = 0.5, delay = 0 }) {
    const c = ensureCtx();
    if (!c || !master) return;
    const t0 = c.currentTime + delay;
    const frames = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, frames, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(g); g.connect(master);
    src.start(t0);
}

function arpeggio(freqs, step = 0.08, type = "triangle") {
    freqs.forEach((f, i) => tone({ freq: f, type, dur: 0.14, vol: 0.5, delay: i * step }));
}

// ── Named effects ──
const SOUNDS = {
    // UI
    click: () => tone({ freq: 520, type: "square", dur: 0.05, vol: 0.4 }),
    tab: () => tone({ freq: 660, type: "triangle", dur: 0.08, vol: 0.4 }),
    flip: () => { noise({ dur: 0.12, vol: 0.25 }); tone({ freq: 300, glide: 300, dur: 0.12, vol: 0.2 }); },
    view: () => tone({ freq: 440, glide: 220, type: "sine", dur: 0.14, vol: 0.4 }),
    win: () => arpeggio([523, 659, 784, 1047]),
    fail: () => tone({ freq: 400, glide: -260, type: "sawtooth", dur: 0.5, vol: 0.5 }),

    // Breakout
    bounce: () => tone({ freq: 480, type: "square", dur: 0.05, vol: 0.4 }),
    brick: () => tone({ freq: 700, type: "triangle", dur: 0.06, vol: 0.45 }),
    powerup: () => arpeggio([600, 800, 1000], 0.05),
    laser: () => tone({ freq: 900, glide: -400, type: "sawtooth", dur: 0.12, vol: 0.3 }),
    lifelost: () => tone({ freq: 300, glide: -150, type: "sine", dur: 0.3, vol: 0.5 }),

    // 2048
    slide: () => tone({ freq: 360, type: "sine", dur: 0.06, vol: 0.3 }),
    merge: () => tone({ freq: 620, glide: 180, type: "triangle", dur: 0.12, vol: 0.45 }),
    bomb: () => { noise({ dur: 0.35, vol: 0.6 }); tone({ freq: 160, glide: -120, type: "sawtooth", dur: 0.35, vol: 0.5 }); },

    // Plinko
    peg: (opt) => tone({ freq: 500 + (opt?.pitch || 0), type: "square", dur: 0.03, vol: 0.25 }),
    slot: (opt) => arpeggio((opt?.mult || 1) >= 3 ? [700, 900, 1200] : [500, 650], 0.05),

    // Dungeon
    step: () => tone({ freq: 220, type: "sine", dur: 0.04, vol: 0.25 }),
    hit: () => { noise({ dur: 0.1, vol: 0.4 }); tone({ freq: 240, type: "square", dur: 0.08, vol: 0.3 }); },
    pickup: () => arpeggio([700, 950], 0.05),
    stairs: () => arpeggio([400, 600, 800], 0.07),

    // Emoji Match
    ematchflip: () => tone({ freq: 560, type: "triangle", dur: 0.06, vol: 0.35 }),
    ematch: () => arpeggio([660, 880], 0.06),
    emismatch: () => tone({ freq: 200, type: "sawtooth", dur: 0.18, vol: 0.4 }),

    // Sudoku
    place: () => tone({ freq: 540, type: "sine", dur: 0.06, vol: 0.35 }),
    erase: () => tone({ freq: 360, type: "sine", dur: 0.05, vol: 0.3 }),
    error: () => tone({ freq: 180, type: "sawtooth", dur: 0.22, vol: 0.45 }),
    complete: () => arpeggio([523, 659, 784, 1047, 1319], 0.07),
};

export function playSound(name, opt) {
    if (muted || !unlocked) return;
    if (throttled()) return;
    const fn = SOUNDS[name];
    if (fn) { try { fn(opt); } catch { /* ignore */ } }
}
