import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !isDarkMode;
        setIsDarkMode(newDark);
        
        if (newDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                padding: "10px",
                borderRadius: "50%",
                background: isDarkMode 
                    ? "rgba(15, 23, 42, 0.9)" 
                    : "rgba(255, 255, 255, 0.9)",
                border: isDarkMode 
                    ? "1px solid rgba(255,255,255,0.2)" 
                    : "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = isDarkMode
                    ? "0 0 15px rgba(139, 92, 246, 0.5)"
                    : "0 0 15px rgba(139, 92, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
            }}
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <Sun style={{ width: "24px", height: "24px", color: "#facc15" }} />
            ) : (
                <Moon style={{ width: "24px", height: "24px", color: "#2563eb" }} />
            )}
        </button>
    );
};