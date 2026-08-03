import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { PlatformsBar } from "@/components/sections/PlatformsBar";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DashboardPreviewSection } from "@/components/sections/DashboardPreviewSection";
import { Stats } from "@/components/sections/Stats";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PlatformsBar />
        <Services />
        <HowItWorks />
        <DashboardPreviewSection />
        <Stats />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
