import { useState, useEffect, useCallback } from "react";
import { ThemeContext } from "@/hooks/theme-context";

const STORAGE_KEY = "portfolio-theme";

const getStored = () => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    // Default to dark (the signature look).
    return "dark";
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getStored);

    // Keep the DOM class + storage in sync with the current theme.
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(
        () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
        []
    );
    const setTheme = useCallback((t) => {
        if (t === "light" || t === "dark") setThemeState(t);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === "dark" }}>
            {children}
        </ThemeContext.Provider>
    );
};
