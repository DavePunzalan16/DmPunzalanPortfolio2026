import { useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Fullscreen lightbox for community images.
 * - ESC closes, arrow keys navigate
 * - Locks background scroll while open
 * - Touch swipe to navigate
 */
export const CommunityLightbox = ({
    images = [],
    index = 0,
    label,
    title,
    onClose,
    onPrev,
    onNext,
}) => {
    const touchStartX = useRef(null);
    const dialogRef = useRef(null);

    const handleKey = useCallback(
        (e) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowLeft") onPrev();
            else if (e.key === "ArrowRight") onNext();
        },
        [onClose, onPrev, onNext]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        // focus the dialog for keyboard users
        dialogRef.current?.focus();
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [handleKey]);

    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
            delta > 0 ? onPrev() : onNext();
        }
        touchStartX.current = null;
    };

    return (
        <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} image viewer`}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 animate-fade-in outline-none"
            onClick={onClose}
        >
            {/* Close */}
            <button
                onClick={onClose}
                aria-label="Close image viewer"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-secondary/80 text-foreground border border-border hover:bg-secondary hover:text-primary hover:scale-110 transition-all duration-300"
            >
                <X size={22} />
            </button>

            {/* Prev */}
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-secondary/80 text-foreground border border-border hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Image */}
            <figure
                className="relative max-w-5xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <img
                    src={images[index]}
                    alt={`${title} — photo ${index + 1} of ${images.length}`}
                    className="max-h-[78vh] w-auto max-w-full object-contain rounded-2xl border border-border/50 shadow-2xl"
                />
                <figcaption className="mt-4 text-center">
                    {label && (
                        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 mb-2">
                            {label}
                        </span>
                    )}
                    <p className="text-foreground font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {index + 1} / {images.length}
                    </p>
                </figcaption>
            </figure>

            {/* Next */}
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                aria-label="Next image"
                className={cn(
                    "absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full",
                    "bg-secondary/80 text-foreground border border-border hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                )}
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};
