import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { PlatformsBar } from "@/components/sections/PlatformsBar";
import { Services } from "@/components/sections/Services";
import { PlansSection } from "@/components/sections/PlansSection";
import { ReleasesCarousel } from "@/components/sections/ReleasesCarousel";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DashboardPreviewSection } from "@/components/sections/DashboardPreviewSection";
import { ResourcesSection } from "@/components/sections/ResourcesSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="upsi-site">
      <Navbar />
      <main id="contenido">
        <Hero />
        <PlatformsBar />
        <Services />
        <PlansSection />
        <ReleasesCarousel />
        <HowItWorks />
        <DashboardPreviewSection />
        <ResourcesSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
