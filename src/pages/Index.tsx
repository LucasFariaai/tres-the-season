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
import { usePublishedHome } from "@/hooks/usePublishedHome";

const Index = () => {
  const [introDone, setIntroDone] = useState(false);
  const { content, theme } = usePublishedHome();

  return (
    <div className="min-h-screen">
      {!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}
      <SeasonBar />
      <HeroSection shouldPlay={introDone} content={content.hero} theme={theme} />
      <div aria-hidden="true" className="w-full" style={{ height: "120px", background: content.bands.heroToZoom || theme.bandHeroToZoom }} />
      <ZoomParallaxSection content={content.zoom} theme={theme} />
      <SeasonsArchiveSection />
      <ConceptSection content={content.concept} theme={theme} />
      <TresGallerySection />
      <div aria-hidden="true" className="w-full" style={{ height: "400px", background: content.bands.zoomToProducers || theme.bandZoomToProducers }} />
      <ProducersSection content={content.producers} theme={theme} />
      <ReserveSection content={content.reserve} theme={theme} />
      <FooterSection content={content.footer} theme={theme} />

      <style>{`
        @media (max-width: 767px) {
          .min-h-screen > div[aria-hidden="true"] { height: 80px; }
          .min-h-screen > div[aria-hidden="true"]:last-of-type { height: 260px; }
        }
      `}</style>
    </div>
  );
};

export default Index;
