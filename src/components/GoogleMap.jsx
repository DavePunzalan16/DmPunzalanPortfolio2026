import { MapPin } from "lucide-react";

const MAP_SRC =
    "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1147.483932574306!2d121.00234556983865!3d14.67519813107259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s415%20Rose%20Street%2C%20Caloocan%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1788873934479!5m2!1sen!2sph";

export const GoogleMap = () => {
    return (
        <section id="location" className="py-16 sm:py-20 md:py-24 px-4 relative bg-secondary/20">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <MapPin className="h-4 w-4" />
                        Where I'm Based
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Find <span className="text-primary">Me</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Based in Caloocan City, Metro Manila — open to on-site, hybrid, and remote
                        opportunities across the Philippines and beyond.
                    </p>
                </div>

                {/* Responsive map wrapper — no fixed 800px, fluid width, aspect-ratio height */}
                <div className="gradient-border rounded-2xl overflow-hidden shadow-lg">
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                        <iframe
                            src={MAP_SRC}
                            title="Map showing Dave's location in Caloocan City, Metro Manila"
                            className="absolute inset-0 w-full h-full border-0"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
