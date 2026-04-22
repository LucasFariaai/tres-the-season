import { useEffect, useState } from "react";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import IntroOverlay from "@/components/IntroOverlay";
import MenuPoemSection from "@/components/MenuPoemSection";
import ProcessGrid from "@/components/ProcessGrid";
import RhythmSection from "@/components/RhythmSection";
import SeasonBar from "@/components/SeasonBar";
import SeasonToggle from "@/components/SeasonToggle";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import { seasonPageContent, useSeason } from "@/lib/seasonContext";

function SeasonalBridge() {
  const { season } = useSeason();
  const content = seasonPageContent[season];

  return (
    <>
      <div
        aria-hidden="true"
        className="w-full"
        style={{
          height: "120px",
          background:
            "linear-gradient(to bottom, hsl(24 24% 8%) 0%, hsl(24 24% 8%) 12%, hsl(48 13% 9%) 22%, hsl(33 25% 13%) 34%, hsl(24 29% 18%) 46%, hsl(26 21% 29%) 58%, hsl(38 13% 48%) 70%, hsl(36 20% 67%) 81%, hsl(38 25% 80%) 90%, hsl(36 33% 95%) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="w-full"
        style={{
          height: "260px",
          background: `linear-gradient(to bottom, hsl(var(--wine-bg)) 0%, hsl(var(--wine-bg)) 20%, ${content.accentSoft} 48%, hsl(34 20% 34%) 72%, ${content.paper} 100%)`,
        }}
      />
    </>
  );
}

export default function Seasons() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(var(--wine-bg))" }}>
      {!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}
      <SeasonBar />
      <SeasonToggle />
      <HeroSection shouldPlay={introDone} />
      <SeasonalBridge />
      <ZoomParallaxSection />
      <main style={{ backgroundColor: "hsl(var(--wine-bg))" }}>
        <MenuPoemSection />
        <ProcessGrid />
      </main>
      <RhythmSection />
      <FooterSection />

      <style>{`
        @media (max-width: 767px) {
          .min-h-screen > div[aria-hidden="true"]:first-of-type {
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}