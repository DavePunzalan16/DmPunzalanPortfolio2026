import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A single event group carousel:
 * - Large featured image with prev/next controls
 * - Pagination dots + "n / total" counter
 * - Category label, title, description
 * - Touch swipe on mobile, click featured image to open lightbox
 */
export const CommunityCarousel = ({ moment, onOpenLightbox }) => {
    const { category, title, description, images } = moment;
    const [current, setCurrent] = useState(0);
    const total = images.length;
    const touchStartX = useRef(null);

    const goTo = useCallback((i) => setCurrent((i + total) % total), [total]);
    const prev = useCallback(() => goTo(current - 1), [goTo, current]);
    const next = useCallback(() => goTo(current + 1), [goTo, current]);

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) delta > 0 ? prev() : next();
        touchStartX.current = null;
    };

    return (
        <article className="gradient-border overflow-hidden rounded-2xl card-hover">
            {/* Featured image */}
            <div
                className="relative aspect-[4/3] sm:aspect-[16/10] bg-secondary/30 overflow-hidden group"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {images.map((src, i) => (
                    <img
                        key={src}
                        src={src}
                        alt={`${title} — photo ${i + 1}`}
                        loading="lazy"
                        onClick={() => onOpenLightbox(current)}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover cursor-zoom-in transition-all duration-700 ease-out",
                            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                        )}
                    />
                ))}

                {/* Gradient scrim for readability */}
                <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent pointer-events-none" />

                {/* Category label */}
                <span className="absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
                    {category}
                </span>

                {/* Counter */}
                <span className="absolute top-3 right-3 z-10 text-xs font-medium px-2.5 py-1 rounded-full bg-background/70 text-foreground border border-border backdrop-blur-sm">
                    {current + 1} / {total}
                </span>

                {/* Expand hint */}
                <button
                    onClick={() => onOpenLightbox(current)}
                    aria-label={`Open ${title} gallery in fullscreen`}
                    className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-background/70 text-foreground border border-border backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                    <Maximize2 size={16} />
                </button>

                {/* Prev / Next */}
                <button
                    onClick={prev}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/70 text-foreground border border-border backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={next}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/70 text-foreground border border-border backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Pagination dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to photo ${i + 1}`}
                            aria-current={i === current}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                i === current ? "w-6 bg-primary" : "w-2 bg-foreground/40 hover:bg-foreground/70"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 text-left">
                <h3 className="text-lg sm:text-xl font-bold mb-2 leading-snug">{title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </article>
    );
};
