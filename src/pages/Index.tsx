import { useState } from "react";
import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import SeasonsArchiveSection from "@/components/SeasonsArchiveSection";
import ConceptSection from "@/components/ConceptSection";
import ProducersSection from "@/components/ProducersSection";
import ReserveSection from "@/components/ReserveSection";
import FooterSection from "@/components/FooterSection";
import IntroOverlay from "@/components/IntroOverlay";

const Index = () => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="min-h-screen">
      {!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}
      <SeasonBar />
      <HeroSection shouldPlay={introDone} />
      <div
        aria-hidden="true"
        className="w-full"
        style={{
          height: "120px",
          background:
            "linear-gradient(to bottom, hsl(24 24% 8%) 0%, hsl(24 24% 8%) 12%, hsl(48 13% 9%) 22%, hsl(33 25% 13%) 34%, hsl(24 29% 18%) 46%, hsl(26 21% 29%) 58%, hsl(38 13% 48%) 70%, hsl(36 20% 67%) 81%, hsl(38 25% 80%) 90%, hsl(36 33% 95%) 100%)",
        }}
      />
      <ZoomParallaxSection />
      <SeasonsArchiveSection />
      <ConceptSection />
      <ProducersSection />
      <ReserveSection />
      <FooterSection />

      <style>{`
        @media (max-width: 767px) {
          .min-h-screen > div[aria-hidden="true"] {
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
