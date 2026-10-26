// ============================================================================
// Paged views — show ONE section at a time, driven by the navbar + URL hash.
// Non-destructive: sections keep their markup/IDs; we only toggle a `hidden`
// class. Progressive enhancement: if this never runs, every section shows.
//
// Flip ENABLE_PAGED_VIEWS to false to instantly restore the long-scroll page.
// ============================================================================
import { playSound } from "@/lib/sound";

export const ENABLE_PAGED_VIEWS = true;

// Navbar order. #arcade lives inside the Certificates view (not its own view).
export const VIEW_IDS = ["hero", "about", "skills", "experience", "volunteer", "projects", "certificates", "contact"];

// Extra sections that are NOT navbar views but must belong to one so they're
// shown/hidden together (non-destructive: we just toggle their visibility).
//   #beyond-the-code → about, #community + #arcade → certificates, #location → contact
const EXTRA_SECTIONS = {
    "beyond-the-code": "about",
    "arcade": "certificates",
    "community": "certificates",
    "location": "contact",
};

const HIDE_CLASS = "view-hidden";
let current = null;
let initialized = false;
const changeListeners = new Set();

const prefersReduced = () =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const sectionFor = (id) => document.getElementById(id);

// Which view a hash belongs to (#arcade → certificates).
const resolveView = (hash) => {
    const id = (hash || "").replace(/^#/, "");
    if (!id || id === "hero") return "hero";
    if (id === "arcade" || id === "location" || id === "community" || id === "beyond-the-code") {
        // sub-sections that live inside a known view
        if (id === "arcade") return "certificates";
        if (id === "location") return "contact";
        return "about"; // beyond-the-code / community fallbacks
    }
    return VIEW_IDS.includes(id) ? id : "hero";
};

export const onViewChange = (fn) => { changeListeners.add(fn); return () => changeListeners.delete(fn); };

export const showView = (viewId, { scrollToSub = null, playTone = true } = {}) => {
    if (!ENABLE_PAGED_VIEWS) return;
    const target = VIEW_IDS.includes(viewId) ? viewId : "hero";
    if (target === current && !scrollToSub) return;

    VIEW_IDS.forEach((id) => {
        const el = sectionFor(id);
        if (!el) return;
        if (id === target) {
            el.classList.remove(HIDE_CLASS);
            el.removeAttribute("hidden");
            if (!prefersReduced()) {
                el.classList.remove("view-animate");
                // reflow to restart the animation
                void el.offsetWidth;
                el.classList.add("view-animate");
            }
        } else {
            el.classList.add(HIDE_CLASS);
        }
    });

    // Show/hide the extra sub-sections with their parent view.
    Object.entries(EXTRA_SECTIONS).forEach(([id, parent]) => {
        const el = sectionFor(id);
        if (!el) return;
        el.classList.toggle(HIDE_CLASS, parent !== target);
    });

    current = target;
    if (playTone) playSound("view");

    // Update navbar active state + aria-current.
    document.querySelectorAll("[data-nav-view]").forEach((a) => {
        const isActive = a.getAttribute("data-nav-view") === target;
        a.classList.toggle("nav-active", isActive);
        if (isActive) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });

    // Scroll to top (or to a sub-section like #arcade), then focus the heading.
    const doScroll = () => {
        if (scrollToSub) {
            const sub = sectionFor(scrollToSub);
            if (sub) { sub.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" }); return; }
        }
        window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
    };
    doScroll();

    // Move focus to the view's heading for accessibility.
    const el = sectionFor(target);
    const heading = el?.querySelector("h1, h2");
    if (heading) {
        heading.setAttribute("tabindex", "-1");
        setTimeout(() => heading.focus({ preventScroll: true }), 60);
    }

    changeListeners.forEach((fn) => fn(target));
};

const applyFromHash = (playTone = true) => {
    const view = resolveView(window.location.hash);
    const sub = window.location.hash === "#arcade" ? "arcade"
        : window.location.hash === "#location" ? "location" : null;
    showView(view, { scrollToSub: sub, playTone });
};

export const initPagedViews = () => {
    if (!ENABLE_PAGED_VIEWS || initialized) return () => {};
    initialized = true;
    document.documentElement.classList.add("view-paged");

    // Tag navbar anchors so we can manage active state. Anchors already use
    // href="#id"; we add a data attribute mapping to their resolved view.
    const tagAnchors = () => {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            const href = a.getAttribute("href") || "";
            const view = resolveView(href);
            // Only tag nav-like links (inside <nav> or the mobile drawer).
            if (a.closest("nav") || a.closest("[data-mobile-nav]") || a.closest("aside")) {
                a.setAttribute("data-nav-view", view);
            }
        });
    };
    tagAnchors();

    // Intercept same-page hash links so we switch views (and handle #arcade).
    const onClick = (e) => {
        const a = e.target.closest?.('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        // Let it set the hash; our hashchange handler does the work. But we also
        // preventDefault + set hash to guarantee a change event even if same.
        e.preventDefault();
        const targetHash = href;
        if (window.location.hash === targetHash) applyFromHash();
        else window.location.hash = targetHash;
    };
    document.addEventListener("click", onClick);

    const onHash = () => applyFromHash();
    window.addEventListener("hashchange", onHash);

    // Initial view from hash (or Home).
    applyFromHash(false);

    return () => {
        document.removeEventListener("click", onClick);
        window.removeEventListener("hashchange", onHash);
    };
};

export const currentView = () => current;
export const viewOrder = VIEW_IDS;
