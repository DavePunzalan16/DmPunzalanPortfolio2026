import { useEffect, useState } from "react";

// Pure builders (module scope) — no React state, safe for lazy init and resize.
const buildStars = () => {
    const numberOfStars = Math.floor(
        (window.innerWidth * window.innerHeight) / 10000
    );
    const newStars = [];
    for (let i = 0; i < numberOfStars; i++) {
        newStars.push({
            id: i,
            size: Math.random() * 3 + 1,
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: Math.random() * 0.5 + 0.5,
            animationDuration: Math.random() * 4 + 2,
        });
    }
    return newStars;
};

const buildMeteors = () => {
    const numberOfMeteors = 6;
    const newMeteors = [];
    for (let i = 0; i < numberOfMeteors; i++) {
        newMeteors.push({
            id: i,
            size: Math.random() * 2 + 1,
            x: Math.random() * 100,
            y: Math.random() * 20,
            delay: Math.random() * 15,
            animationDuration: Math.random() * 3 + 3,
        });
    }
    return newMeteors;
};

export const StarBackground = () => {
    // Lazy initializers compute once on mount (no setState inside an effect).
    const [stars, setStars] = useState(buildStars);
    const [meteors] = useState(buildMeteors);

    // Regenerate the star field on resize (updates from within the event callback).
    useEffect(() => {
        const handleResize = () => setStars(buildStars());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="star animate-pulse-subtle"
                    style={{
                        width: star.size + "px",
                        height: star.size + "px",
                        left: star.x + "%",
                        top: star.y + "%",
                        opacity: star.opacity,
                        animationDuration: star.animationDuration + "s",
                    }}
                />
            ))}

            {meteors.map((meteor) => (
                <div
                    key={meteor.id}
                    className="meteor animate-meteor"
                    style={{
                        width: meteor.size * 25 + "px",
                        height: "1px",
                        left: meteor.x + "%",
                        top: meteor.y + "%",
                        animationDelay: meteor.delay + "s",
                        animationDuration: meteor.animationDuration + "s",
                    }}
                />
            ))}
        </div>
    );
};
