import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";

const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Volunteer", href: "#volunteer" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    return (
        <>
            <nav className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300",
                scrolled ? "py-3 bg-background/90 backdrop-blur-md shadow-sm" : "py-5"
            )}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                    <a href="#hero" className="text-lg font-bold flex items-center shrink-0">
                        <span className="text-glow text-foreground">DavePunzalan</span>
                        <span className="ml-1 text-primary">Portfolio</span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {navItems.map((item, key) => (
                            <a
                                key={key}
                                href={item.href}
                                className="text-sm xl:text-base text-foreground/80 font-medium hover:text-primary transition-colors duration-300 whitespace-nowrap"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* RIGHT SIDE: Hamburger only (ThemeToggle is separate fixed button) */}
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
                        style={{ zIndex: 9999 }}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 flex flex-col items-center justify-center lg:hidden",
                "bg-background/95 backdrop-blur-md",
                "transition-opacity duration-300",
                menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-5 right-4 p-2 text-foreground hover:text-primary transition-colors"
                    style={{ zIndex: 9999 }}
                    aria-label="Close menu"
                >
                    <X size={22} />
                </button>

                <div className="flex flex-col items-center space-y-8">
                    {navItems.map((item, key) => (
                        <a
                            key={key}
                            href={item.href}
                            className="text-2xl sm:text-3xl font-semibold text-foreground/80 hover:text-primary transition-colors duration-300"
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
};