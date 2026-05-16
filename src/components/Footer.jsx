import { ArrowUp, Mail, Search, Heart, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Inline GitHub icon
const GitHubIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

// Inline LinkedIn icon
const LinkedInIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const footerLinks = {
    navigation: [
        { name: "Home", href: "#hero" },
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Volunteer", href: "#volunteer" },
        { name: "Projects", href: "#projects" },
        { name: "Contact", href: "#contact" },
    ],
    resources: [
        { name: "GitHub", href: "https://github.com/DavePunzalan16", external: true },
        { name: "LinkedIn", href: "https://www.linkedin.com/in/davematthewpunzalan/", external: true },
        { name: "Resume", href: "#", external: false },
        { name: "Blog", href: "#", external: false },
    ],
    tech: [
        { name: "React", href: "https://react.dev", external: true },
        { name: "Tailwind CSS", href: "https://tailwindcss.com", external: true },
        { name: "Vite", href: "https://vitejs.dev", external: true },
        { name: "Node.js", href: "https://nodejs.org", external: true },
    ],
};

const socialLinks = [
    { name: "GitHub", href: "https://github.com/DavePunzalan16", icon: GitHubIcon },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/davematthewpunzalan/", icon: LinkedInIcon },
    { name: "Email", href: "mailto:dave16punzalan@gmail.com", icon: Mail },
];

export const Footer = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const filteredNav = footerLinks.navigation.filter((link) =>
        link.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
    }));

    return (
        <footer className="relative overflow-hidden bg-card border-t border-border">
            {/* Floating particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-primary/10 animate-float"
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.left}%`,
                            bottom: "-10px",
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* Wave SVG top */}
                <div className="absolute top-0 left-0 right-0 -translate-y-full">
                    <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
                        <path d="M0,60 L0,30 Q360,0 720,30 T1440,30 L1440,60 Z" fill="hsl(var(--card))" />
                    </svg>
                </div>

                {/* Search Section */}
                <div className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                                Quick <span className="text-primary">Navigate</span>
                            </h3>
                            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                                Search through sections or jump directly to where you want to go.
                            </p>
                        </div>

                        <div className="max-w-xl mx-auto relative">
                            <div className={cn(
                                "relative flex items-center transition-all duration-300",
                                searchFocused ? "scale-[1.02]" : "scale-100"
                            )}>
                                <Search className={cn(
                                    "absolute left-4 h-5 w-5 transition-colors duration-300",
                                    searchFocused ? "text-primary" : "text-muted-foreground"
                                )} />
                                <input
                                    type="text"
                                    placeholder="Search sections..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className={cn(
                                        "w-full pl-12 pr-4 py-4 rounded-2xl",
                                        "bg-background/80 backdrop-blur-sm border-2 border-border",
                                        "text-foreground placeholder:text-muted-foreground",
                                        "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                                        "transition-all duration-300 text-sm sm:text-base"
                                    )}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 p-1 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Search dropdown */}
                            {searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                                    {filteredNav.length > 0 ? (
                                        filteredNav.map((link) => (
                                            <a
                                                key={link.name}
                                                href={link.href}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors duration-200 group"
                                                onClick={() => setSearchQuery("")}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                                                <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                                    {link.name}
                                                </span>
                                                <ArrowUp className="ml-auto h-3 w-3 text-muted-foreground -rotate-45 group-hover:text-primary transition-colors" />
                                            </a>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                                            No sections found for "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Brand */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <a href="#hero" className="inline-block mb-4">
                                <span className="text-xl font-bold text-glow">
                                    Dave<span className="text-primary">Punzalan</span>
                                </span>
                            </a>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                                BS Computer Science graduate building fast, accessible, and visually stunning web experiences with React and modern tech.
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target={social.href.startsWith("http") ? "_blank" : undefined}
                                            rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                            className={cn(
                                                "p-2.5 rounded-xl bg-background/80 border border-border",
                                                "text-foreground/70 hover:text-primary hover:border-primary/30",
                                                "hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]",
                                                "transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                                            )}
                                            aria-label={social.name}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigate */}
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                                Navigate
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.navigation.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                            onMouseEnter={() => setHoveredLink(link.name)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                        >
                                            <span className={cn(
                                                "h-px bg-primary transition-all duration-300",
                                                hoveredLink === link.name ? "w-4" : "w-0"
                                            )} />
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                                Resources
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            target={link.external ? "_blank" : undefined}
                                            rel={link.external ? "noopener noreferrer" : undefined}
                                            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                            onMouseEnter={() => setHoveredLink(link.name)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                        >
                                            <span className={cn(
                                                "h-px bg-primary transition-all duration-300",
                                                hoveredLink === link.name ? "w-4" : "w-0"
                                            )} />
                                            {link.name}
                                            {link.external && (
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Built With */}
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                                Built With
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.tech.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                            onMouseEnter={() => setHoveredLink(link.name)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                        >
                                            <span className={cn(
                                                "h-px bg-primary transition-all duration-300",
                                                hoveredLink === link.name ? "w-4" : "w-0"
                                            )} />
                                            {link.name}
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/50 py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                            &copy; {new Date().getFullYear()}{" "}
                            <span className="font-semibold text-foreground/80">DavePunzalan</span>
                            . Crafted with{" "}
                            <Heart className="h-3 w-3 text-red-400 fill-red-400 animate-pulse-subtle inline" />{" "}
                            and lots of coffee.
                        </p>

                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">All rights reserved.</span>
                            <button
                                onClick={scrollToTop}
                                className={cn(
                                    "group flex items-center gap-2 px-4 py-2 rounded-full",
                                    "bg-background/80 border border-border",
                                    "text-sm text-muted-foreground hover:text-primary",
                                    "hover:border-primary/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]",
                                    "transition-all duration-300 hover:scale-105"
                                )}
                                aria-label="Back to top"
                            >
                                <span className="text-xs font-medium">Top</span>
                                <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};