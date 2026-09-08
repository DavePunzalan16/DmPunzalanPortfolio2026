import { StarBackground } from "@/components/StarBackground";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { BeyondTheCode } from "../components/BeyondTheCode";
import { SkillsSection } from "../components/SkillsSection";
import { VolunteerSection } from "../components/VolunteerSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { CertificatesSection } from "../components/CertificatesSection";
import { CommunityMoments } from "../components/CommunityMoments";
import { GoogleMap } from "../components/GoogleMap";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export const Home = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <StarBackground />
      <Navbar />

      <main className="relative z-0">
        <HeroSection />
        <AboutSection />
        <BeyondTheCode />
        <SkillsSection />
        <VolunteerSection />
        <ProjectsSection />
        <CertificatesSection />
        <CommunityMoments />
        <GoogleMap />
        <ContactSection />
      </main>

      <Footer />

      {/* Chatbot */}
      <Chatbot />

      {/* Scroll to top — bottom-left so it never overlaps the chatbot stack on the right */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
        className={`fixed left-4 sm:left-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-all duration-300 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};