import { createContext, useContext } from "react";

// Simple dark/light theme context. `theme` is "dark" | "light".
export const ThemeContext = createContext(null);

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
};
