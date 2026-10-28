// Spotlight strip (Task D). A thin row of up to 3 mini stat chips shown near
// the preview grid. Only chips whose data exists are rendered; if none qualify,
// the component renders nothing. Reuses existing data sources (no hardcoding).
import { Award, Gamepad2, GraduationCap } from "lucide-react";
import { latestCertificate } from "@/components/CertificatesSection";
import "@/components/home/spotlight-strip.css";

const CURRENTLY_LEARNING = "AWS Cloud";
const BREAKOUT_KEY = "portfolio-arcade:breakout:best";

// Read the Breakout best score defensively (try/catch, numeric guard).
const readBreakoutBest = () => {
    try {
        const raw = window.localStorage.getItem(BREAKOUT_KEY);
        if (raw == null) return 0;
        const n = parseInt(raw, 10);
        return Number.isFinite(n) && n > 0 ? n : 0;
    } catch {
        return 0;
    }
};

export const SpotlightStrip = () => {
    const chips = [];

    // (1) Latest certificate — only if derivable from the data.
    if (latestCertificate?.title && latestCertificate?.date) {
        chips.push(
            <div className="sp-chip" key="latest-cert">
                <Award size={15} className="text-primary" aria-hidden="true" />
                <span className="sp-chip__label">Latest certificate</span>
                <span className="sp-chip__value">{latestCertificate.title}</span>
                <span className="sp-chip__label">· {latestCertificate.date}</span>
            </div>
        );
    } else {
        console.warn("[SpotlightStrip] latestCertificate not derivable (src/components/CertificatesSection.jsx)");
    }

    // (2) Best Breakout score, or a "Play Breakout ->" link if none.
    const best = readBreakoutBest();
    if (best > 0) {
        chips.push(
            <div className="sp-chip" key="breakout">
                <Gamepad2 size={15} className="text-primary" aria-hidden="true" />
                <span className="sp-chip__label">Best Breakout</span>
                <span className="sp-chip__value sp-chip__value--accent">{best}</span>
            </div>
        );
    } else {
        chips.push(
            <a className="sp-chip" key="breakout" href="#arcade" aria-label="Play Breakout in the arcade">
                <Gamepad2 size={15} className="text-primary" aria-hidden="true" />
                <span className="sp-chip__value">Play Breakout →</span>
            </a>
        );
    }

    // (3) Currently learning.
    if (CURRENTLY_LEARNING) {
        chips.push(
            <div className="sp-chip" key="learning">
                <span className="sp-chip__dot" aria-hidden="true" />
                <GraduationCap size={15} className="text-primary" aria-hidden="true" />
                <span className="sp-chip__label">Currently learning</span>
                <span className="sp-chip__value">{CURRENTLY_LEARNING}</span>
            </div>
        );
    }

    if (chips.length === 0) return null;

    return (
        <div className="sp-strip" role="list" aria-label="Portfolio highlights">
            {chips}
        </div>
    );
};

export default SpotlightStrip;
