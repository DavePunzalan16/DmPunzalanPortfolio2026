import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/theme-context";

/**
 * Simple dark / light toggle.
 * - variant="icon": compact round button (desktop navbar)
 * - variant="inline": labelled row (mobile menu)
 */
export const ThemeSelector = ({ variant = "icon", className }) => {
    const { isDark, toggleTheme } = useTheme();

    if (variant === "inline") {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={isDark}
                className={cn(
                    "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-colors duration-200",
                    "text-foreground/80 hover:bg-secondary hover:text-primary",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    className
                )}
            >
                {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                <span className="text-base font-medium">
                    {isDark ? "Dark mode" : "Light mode"}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">Tap to switch</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(
                "inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card/60 backdrop-blur-sm",
                "text-foreground/80 hover:text-primary hover:border-primary/40 transition-colors duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                className
            )}
        >
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-primary" />}
        </button>
    );
};
