import { useState, useCallback } from "react";
import { Users } from "lucide-react";
import { communityMoments } from "@/data/community";
import { CommunityCarousel } from "@/components/CommunityCarousel";
import { CommunityLightbox } from "@/components/CommunityLightbox";

export const CommunityMoments = () => {
    // lightbox = { groupIndex, imageIndex } | null
    const [lightbox, setLightbox] = useState(null);

    const openLightbox = useCallback((groupIndex, imageIndex) => {
        setLightbox({ groupIndex, imageIndex });
    }, []);

    const closeLightbox = useCallback(() => setLightbox(null), []);

    const activeGroup = lightbox != null ? communityMoments[lightbox.groupIndex] : null;
    const activeImages = activeGroup?.images ?? [];

    const prevImage = useCallback(() => {
        setLightbox((lb) =>
            lb == null
                ? lb
                : {
                      ...lb,
                      imageIndex:
                          (lb.imageIndex - 1 + communityMoments[lb.groupIndex].images.length) %
                          communityMoments[lb.groupIndex].images.length,
                  }
        );
    }, []);

    const nextImage = useCallback(() => {
        setLightbox((lb) =>
            lb == null
                ? lb
                : {
                      ...lb,
                      imageIndex:
                          (lb.imageIndex + 1) % communityMoments[lb.groupIndex].images.length,
                  }
        );
    }, []);

    return (
        <section id="community" className="py-16 sm:py-20 md:py-24 px-4 relative">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <Users className="h-4 w-4" />
                        Giving Back
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Community <span className="text-primary">Moments</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Beyond building software, I actively contribute to tech communities through
                        volunteering, technical support, operations, leadership, and event collaboration.
                    </p>
                </div>

                {/* Grid of event carousels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {communityMoments.map((moment, gIdx) => (
                        <CommunityCarousel
                            key={moment.id}
                            moment={moment}
                            onOpenLightbox={(imgIdx) => openLightbox(gIdx, imgIdx)}
                        />
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox != null && (
                <CommunityLightbox
                    images={activeImages}
                    index={lightbox.imageIndex}
                    label={activeGroup.category}
                    title={activeGroup.title}
                    onClose={closeLightbox}
                    onPrev={prevImage}
                    onNext={nextImage}
                />
            )}
        </section>
    );
};
