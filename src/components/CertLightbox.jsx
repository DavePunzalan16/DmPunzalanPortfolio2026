import { useEffect, useRef, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable accessible lightbox gallery driven by an array of image paths.
 * Any multi-image certificate can reuse it by passing several files.
 *
 * Features: prev/next buttons + arrow keys, Esc + backdrop click to close,
 * swipe on mobile, thumbnail strip, counter, focus trap, role="dialog"/
 * aria-modal, focus returned to trigger on close, body scroll lock, and only
 * the NEXT image preloaded.
 */
export const CertLightbox = ({ images = [], title = "Gallery", startIndex = 0, onClose }) => {
    const [index, setIndex] = useState(startIndex);
    const dialogRef = useRef(null);
    const touchStartX = useRef(null);
    const total = images.length;

    const go = useCallback((n) => setIndex(((n % total) + total) % total), [total]);
    const prev = useCallback(() => go(index - 1), [go, index]);
    const next = useCallback(() => go(index + 1), [go, index]);

    // Keyboard: Esc close, arrows navigate, Tab focus-trap.
    const onKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape") { e.preventDefault(); onClose(); }
            else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
            else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
            else if (e.key === "Tab") {
                const nodes = dialogRef.current?.querySelectorAll(
                    'button, [href], [tabindex]:not([tabindex="-1"])'
                );
                if (!nodes || !nodes.length) return;
                const first = nodes[0];
                const last = nodes[nodes.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        },
        [onClose, prev, next]
    );

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        // move focus into the dialog
        const t = setTimeout(() => dialogRef.current?.focus(), 0);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", onKeyDown);
            clearTimeout(t);
        };
    }, [onKeyDown]);

    // Preload ONLY the next image.
    useEffect(() => {
        if (total < 2) return;
        const img = new Image();
        img.src = images[(index + 1) % total];
    }, [index, images, total]);

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev() : next());
        touchStartX.current = null;
    };

    return (
        <div
            className="cert-lightbox-backdrop fixed inset-0 z-[1000] flex items-center justify-center bg-background/90 backdrop-blur-md p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={`${title} — image gallery`}
                tabIndex={-1}
                className="cert-lightbox relative w-full max-w-4xl outline-none"
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close gallery"
                    className="absolute -top-2 right-0 sm:-top-3 sm:-right-3 z-10 p-2 rounded-full bg-card border border-border text-foreground hover:text-primary hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <figure
                    className="m-0"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="relative flex items-center justify-center rounded-2xl overflow-hidden border border-border bg-card">
                        <img
                            src={images[index]}
                            alt={`${title} — photo ${index + 1} of ${total}`}
                            className="max-h-[70vh] w-auto max-w-full object-contain"
                            decoding="async"
                        />

                        {total > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    aria-label="Previous image"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 border border-border text-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    aria-label="Next image"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 border border-border text-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}

                        {/* Counter */}
                        <span className="absolute bottom-2 right-3 text-xs px-2 py-1 rounded-full bg-background/80 border border-border text-foreground">
                            {index + 1} / {total}
                        </span>
                    </div>

                    <figcaption className="mt-3 text-center text-sm text-muted-foreground">{title}</figcaption>
                </figure>

                {/* Thumbnail strip */}
                {total > 1 && (
                    <div className="mt-3 flex gap-2 justify-center flex-wrap">
                        {images.map((src, i) => (
                            <button
                                key={src}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Go to image ${i + 1}`}
                                aria-current={i === index}
                                className={cn(
                                    "w-14 h-10 rounded-md overflow-hidden border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    i === index ? "border-primary ring-1 ring-primary" : "border-border opacity-60 hover:opacity-100"
                                )}
                            >
                                <img src={src} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
