import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { X, Menu } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";

const navItems = [
    { name: "Home", href: "#hero", id: "hero" },
    { name: "About", href: "#about", id: "about" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Experience", href: "#experience", id: "experience" },
    { name: "Volunteer", href: "#volunteer", id: "volunteer" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Certificates", href: "#certificates", id: "certificates" },
    { name: "Contact", href: "#contact", id: "contact" },
];

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState("hero");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Track the active section for nav highlight.
    useEffect(() => {
        const sections = navItems
            .map((n) => document.getElementById(n.id))
            .filter(Boolean);
        if (!sections.length) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
        );
        sections.forEach((s) => obs.observe(s));
        return () => obs.disconnect();
    }, []);

    // Close the drawer when resizing up to desktop.
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Lock body scroll + close on ESC while the drawer is open.
    useEffect(() => {
        if (!menuOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    const close = useCallback(() => setMenuOpen(false), []);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-300",
                    scrolled || menuOpen ? "py-2.5 bg-background/90 backdrop-blur-md shadow-sm border-b border-border/50" : "py-4"
                )}
            >
                <div className="container mx-auto flex items-center justify-between gap-3">
                    <a href="#hero" className="text-base sm:text-lg font-bold flex items-center shrink-0" onClick={close}>
                        <span className="text-glow text-foreground">DavePunzalan</span>
                        <span className="ml-1 text-primary">Portfolio</span>
                    </a>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-5 xl:gap-7">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.href}
                                aria-current={active === item.id ? "true" : undefined}
                                className={cn(
                                    "text-sm xl:text-[15px] font-medium transition-colors duration-300 whitespace-nowrap relative",
                                    active === item.id ? "text-primary" : "text-foreground/80 hover:text-primary"
                                )}
                            >
                                {item.name}
                                {active === item.id && (
                                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-primary" />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        <ThemeSelector variant="icon" />
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:text-primary hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-drawer"
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Backdrop */}
            <div
                onClick={close}
                aria-hidden="true"
                className={cn(
                    "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden transition-opacity duration-300",
                    menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />

            {/* Compact right-side drawer — only as wide/tall as needed */}
            <aside
                id="mobile-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={cn(
                    "fixed top-0 right-0 z-40 h-full w-[78%] max-w-xs lg:hidden",
                    "bg-background/95 backdrop-blur-md border-l border-border shadow-2xl",
                    "flex flex-col transition-transform duration-300 ease-out",
                    menuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 h-16 border-b border-border/60 shrink-0">
                    <span className="text-sm font-semibold text-foreground/70">Menu</span>
                    <button
                        onClick={close}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-foreground hover:text-primary hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            onClick={close}
                            aria-current={active === item.id ? "true" : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors duration-200",
                                active === item.id
                                    ? "bg-primary/15 text-primary"
                                    : "text-foreground/80 hover:bg-secondary hover:text-primary"
                            )}
                        >
                            <span className={cn("w-1.5 h-1.5 rounded-full", active === item.id ? "bg-primary" : "bg-foreground/30")} />
                            {item.name}
                        </a>
                    ))}

                    <div className="border-t border-border/60 mt-3 pt-4">
                        <ThemeSelector variant="inline" />
                    </div>
                </div>
            </aside>
        </>
    );
};
