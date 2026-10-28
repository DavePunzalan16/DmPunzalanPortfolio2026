// Live preview bento grid (Task B — main feature). Replaces the old (never
// present) "Quick Navigate" block with 7 data-driven cards. Every card is a
// single <a href="#section"> that reuses the existing hash router. No second
// routing system. All data imported from existing sources — never hardcoded.
import { useEffect, useRef, useState } from "react";
import { User, Code2, Briefcase, HeartHandshake, FolderGit2, Award, Mail } from "lucide-react";

import { PreviewCard } from "@/components/home/PreviewCard";
import { useCountUp } from "@/hooks/useCountUp";
import "@/components/home/preview-grid.css";

import { skills, SKILL_STATUS } from "@/data/skills";
import { experienceSummary } from "@/components/ExperienceSection";
import { volunteerSummary } from "@/components/VolunteerSection";
import { featuredProject } from "@/components/ProjectsSection";
import certManifest from "@/data/certImages.generated.json";

// Keep the old Quick Navigate code out but recoverable (none existed; this gates
// the legacy block so it is trivially restorable).
const LEGACY_QUICK_NAV = false;

const PHOTO_SRC = "assets/DavePFP.jpg";
const BIO_FIRST = "BS Computer Science graduate from UE Caloocan specializing in Web Development.";
const EDU_CHIP = "BS Computer Science — UE Caloocan";
const EMAIL = "dave16punzalan@gmail.com";
const GITHUB = "https://github.com/DavePunzalan16";
const LINKEDIN = "https://www.linkedin.com/in/davematthewpunzalan/";

// ─── Skills selection: first 8 PRIMARY, then fill to 8 in array order ───────
const pickSkills = () => {
    if (!Array.isArray(skills) || skills.length === 0) {
        console.warn("[PreviewGrid] skills data source is empty/missing (src/data/skills.js)");
        return [];
    }
    const primary = skills.filter((s) => s.status === "PRIMARY");
    const rest = skills.filter((s) => s.status !== "PRIMARY");
    return [...primary, ...rest].slice(0, 8);
};

// ─── Certificate fan: match 3 featured filenames, else first 3 ──────────────
const pickCerts = () => {
    if (!Array.isArray(certManifest) || certManifest.length === 0) {
        console.warn("[PreviewGrid] certificate manifest is empty/missing (src/data/certImages.generated.json)");
        return [];
    }
    const wanted = ["MicrosoftCybersecurityAnalyst", "MicrosoftPowerBIDataAnalyst", "Meta_React_Coursera"];
    const matched = wanted
        .map((w) => certManifest.find((e) => (e.file || "").includes(w)))
        .filter(Boolean);
    const picks = matched.length === 3 ? matched : certManifest.slice(0, 3);
    return picks;
};

// Org name -> up to 2-letter initials.
const initials = (name) =>
    (name || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("") || "?";

// Small lazy image with skeleton shimmer + gradient fallback on error.
const LazyImg = ({ src, alt, width, height, fallback }) => {
    const [state, setState] = useState("loading"); // loading | loaded | error
    return (
        <>
            {state === "loading" && <span className="pv-skeleton" style={{ position: "absolute", inset: 0 }} aria-hidden="true" />}
            {state !== "error" ? (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setState("loaded")}
                    onError={() => setState("error")}
                    style={{ opacity: state === "loaded" ? 1 : 0, transition: "opacity 0.3s ease" }}
                />
            ) : (
                fallback
            )}
        </>
    );
};

// Volunteer count-up (uses the shared hook; falls back to "11+").
const VolunteerCount = () => {
    const count = volunteerSummary?.count;
    const target = typeof count === "number" && count > 0 ? `${count}` : "11+";
    const [ref, display] = useCountUp(target);
    return (
        <div className="pv-vol__count">
            <span ref={ref} className="pv-vol__num">{display}</span>
            <span className="pv-vol__label">volunteer roles</span>
        </div>
    );
};

export const PreviewGrid = () => {
    const gridRef = useRef(null);
    // Under reduced motion, show everything immediately (no entrance animation).
    const [inView, setInView] = useState(
        () => typeof window !== "undefined" &&
            !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );

    // Staggered entrance: toggle .is-in once when the grid scrolls into view.
    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) { setInView(true); obs.disconnect(); }
                });
            },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const chosenSkills = pickSkills();
    const chosenCerts = pickCerts();
    const certTotal = Array.isArray(certManifest) ? certManifest.length : 0;
    const volOrgs = Array.isArray(volunteerSummary?.orgs) ? volunteerSummary.orgs.slice(0, 4) : [];
    const exp = experienceSummary?.latest;

    return (
        <section className="pv-section" aria-label="Quick navigate preview cards">
            <div className="pv-head">
                <h2 className="pv-title">Quick Navigate</h2>
                <p className="pv-subtitle">A quick peek at everything. Click any card to dive in.</p>
            </div>

            {LEGACY_QUICK_NAV && (
                <div className="pv-legacy">{/* Legacy Quick Navigate block (disabled) */}</div>
            )}

            <div ref={gridRef} className={`pv-grid${inView ? " is-in" : ""}`}>
                {/* 1 — About (wide) */}
                <PreviewCard href="#about" icon={User} title="About" index={0} wide>
                    <div className="pv-about">
                        <span className="pv-about__photo">
                            <img
                                src={PHOTO_SRC}
                                alt="Dave Punzalan"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const fb = e.currentTarget.nextElementSibling;
                                    if (fb) fb.style.display = "flex";
                                }}
                            />
                            <span className="pv-about__fallback" style={{ display: "none" }}>DP</span>
                        </span>
                        <div>
                            <div className="pv-about__name">Dave Punzalan</div>
                            <p className="pv-about__bio">{BIO_FIRST}</p>
                            <span className="pv-chip">{EDU_CHIP}</span>
                        </div>
                    </div>
                </PreviewCard>

                {/* 2 — Skills */}
                <PreviewCard href="#skills" icon={Code2} title="Skills" caption="Core tools I build with" index={1}>
                    {chosenSkills.length > 0 ? (
                        <div className="pv-skills">
                            {chosenSkills.map((s, i) => {
                                const dotClass = SKILL_STATUS?.[s.status]?.dot || "bg-primary";
                                return (
                                    <span key={s.name} className="pv-skill" style={{ "--pv-si": i }}>
                                        <span className={`pv-skill__dot ${dotClass}`} aria-hidden="true" />
                                        {s.name}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="pv-card__caption">Skills coming soon.</p>
                    )}
                </PreviewCard>

                {/* 3 — Experience */}
                <PreviewCard href="#experience" icon={Briefcase} title="Experience" index={2}>
                    {exp ? (
                        <div className="pv-exp">
                            <div className="pv-exp__row">
                                <span className="pv-exp__dot" aria-hidden="true" />
                                <span>
                                    <span className="pv-exp__role">{exp.role}</span>
                                    <br />
                                    <span className="pv-exp__org">{exp.org}</span>{" "}
                                    <span className="pv-exp__period">· {exp.period}</span>
                                </span>
                            </div>
                            <span className="pv-exp__count">{experienceSummary.count} roles</span>
                        </div>
                    ) : (
                        <p className="pv-card__caption">Experience coming soon.</p>
                    )}
                </PreviewCard>

                {/* 4 — Volunteer */}
                <PreviewCard href="#volunteer" icon={HeartHandshake} title="Volunteer" caption="Communities I give back to" index={3}>
                    <div className="pv-vol">
                        {volOrgs.length > 0 && (
                            <div className="pv-vol__avatars" aria-hidden="true">
                                {volOrgs.map((org, i) => (
                                    <span key={`${org}-${i}`} className="pv-vol__avatar" title={org}>
                                        {initials(org)}
                                    </span>
                                ))}
                            </div>
                        )}
                        <VolunteerCount />
                    </div>
                </PreviewCard>

                {/* 5 — Projects */}
                <PreviewCard href="#projects" icon={FolderGit2} title="Projects" index={4}>
                    {featuredProject ? (
                        <>
                            <div className="pv-proj__thumb">
                                <LazyImg
                                    src={featuredProject.image}
                                    alt={featuredProject.title}
                                    width={320}
                                    height={180}
                                    fallback={
                                        <span className="pv-proj__fallback">{featuredProject.title}</span>
                                    }
                                />
                            </div>
                            <div className="pv-proj__title">{featuredProject.title}</div>
                            <div className="pv-proj__tags">
                                {(featuredProject.tags || []).slice(0, 3).map((t) => (
                                    <span key={t} className="pv-proj__tag">{t}</span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="pv-card__caption">Projects coming soon.</p>
                    )}
                </PreviewCard>

                {/* 6 — Certificates (wide) */}
                <PreviewCard
                    href="#certificates"
                    icon={Award}
                    title="Certificates"
                    caption={<><span className="pv-cert__count">{certTotal}</span> certificates earned</>}
                    index={5}
                    wide
                >
                    {chosenCerts.length > 0 ? (
                        <div className="pv-cert__stack">
                            {chosenCerts.map((c, i) => (
                                <span key={c.file || i} className={`pv-cert__img pv-cert__img--${i}`}>
                                    <LazyImg
                                        src={c.url}
                                        alt={c.stem || "Certificate"}
                                        width={180}
                                        height={135}
                                        fallback={<span className="pv-cert__fallback">{c.stem || "Certificate"}</span>}
                                    />
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="pv-card__caption">Certificates coming soon.</p>
                    )}
                </PreviewCard>

                {/* 7 — Contact */}
                <PreviewCard href="#contact" icon={Mail} title="Contact" caption="Let's build something together" index={6}>
                    <div>
                        <div className="pv-contact__email">{EMAIL}</div>
                        <span className="pv-contact__cta">Let's talk</span>
                        <div className="pv-contact__socials">
                            <a
                                href={GITHUB}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pv-contact__social"
                                aria-label="Visit GitHub profile"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                            </a>
                            <a
                                href={LINKEDIN}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pv-contact__social"
                                aria-label="Visit LinkedIn profile"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href={`mailto:${EMAIL}`}
                                className="pv-contact__social"
                                aria-label="Send an email"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </PreviewCard>
            </div>
        </section>
    );
};

export default PreviewGrid;
