import { useState, useEffect } from "react";
import { ENABLE_PAGED_VIEWS, VIEW_IDS, onViewChange, currentView } from "@/lib/pagedViews";

const LABELS = {
    hero: "Home", about: "About", skills: "Skills", experience: "Experience",
    volunteer: "Volunteer", projects: "Projects", certificates: "Certificates", contact: "Contact",
};

/**
 * Previous / Next view navigation, following the navbar order.
 * Only renders when paged views are enabled; hidden on the Home view's top is
 * fine — it reflects the CURRENT view and updates via onViewChange.
 */
export const ViewNav = () => {
    const [view, setView] = useState(currentView() || "hero");

    useEffect(() => onViewChange(setView), []);

    if (!ENABLE_PAGED_VIEWS) return null;
    const i = VIEW_IDS.indexOf(view);
    if (i < 0) return null;
    const prev = i > 0 ? VIEW_IDS[i - 1] : null;
    const next = i < VIEW_IDS.length - 1 ? VIEW_IDS[i + 1] : null;

    return (
        <nav className="view-nav" aria-label="Previous and next section">
            {prev ? (
                <a href={`#${prev}`}>
                    <span className="view-nav__dir">← Previous</span>
                    <span>{LABELS[prev]}</span>
                </a>
            ) : <span />}
            {next ? (
                <a href={`#${next}`}>
                    <span className="view-nav__dir">Next →</span>
                    <span>{LABELS[next]}</span>
                </a>
            ) : <span />}
        </nav>
    );
};

export default ViewNav;
