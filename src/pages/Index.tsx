import { useState } from "react";
import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import SeasonsArchiveSection from "@/components/SeasonsArchiveSection";
import ConceptSection from "@/components/ConceptSection";
import TresGallerySection from "@/components/TresGallerySection";
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
      <TresGallerySection />
      <div
        aria-hidden="true"
        className="w-full"
        style={{
          height: "400px",
          background:
            "linear-gradient(to bottom, #1A1410 0%, #1A1410 12%, #1B1A13 22%, #2A2218 34%, #3A2A20 46%, #5A4A3A 58%, #8A7D6A 70%, #B8AE9C 81%, #D8CFBE 90%, #F5EFE6 100%)",
        }}
      />
      <ProducersSection />
      <ReserveSection />
      <FooterSection />

      <style>{`
        @media (max-width: 767px) {
          .min-h-screen > div[aria-hidden="true"] {
            height: 80px;
          }

          .min-h-screen > div[aria-hidden="true"]:last-of-type {
            height: 260px;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
