import { useState } from "react";
import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import SeasonsArchiveSection from "@/components/SeasonsArchiveSection";
import ConceptSection from "@/components/ConceptSection";
import DarkToCreamTransition from "@/components/DarkToCreamTransition";
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
      <div
        aria-hidden="true"
        className="hero-cream-transition w-full"
        style={{
          height: "500px",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(26,20,16,0.95) 100%), linear-gradient(to bottom, #1A1410 0%, #1A1410 8%, #2B1A14 18%, #3A2820 30%, #5A4A3A 44%, #8A7D6A 58%, #B8AE9C 72%, #D8CFBE 84%, #EDE5D4 93%, #F5EFE6 100%)",
        }}
      />
      <ZoomParallaxSection content={content.zoom} theme={theme} />
      <SeasonsArchiveSection />
      <ConceptSection content={content.concept} theme={theme} />
      <div aria-hidden="true" className="w-full" style={{ height: "400px", background: content.bands.zoomToProducers || theme.bandZoomToProducers }} />
      <ProducersSection content={content.producers} theme={theme} />
      <ReserveSection content={content.reserve} theme={theme} />
      <DarkToCreamTransition />
      <TresGallerySection content={content.gallery} theme={theme} />
      <FooterSection content={content.footer} theme={theme} />

      <style>{`
        @media (max-width: 767px) {
          .hero-cream-transition {
            height: 340px !important;
            background: radial-gradient(ellipse 80% 55% at 50% 40%, transparent 0%, rgba(26,20,16,0.95) 100%), linear-gradient(to bottom, #1A1410 0%, #1A1410 8%, #2B1A14 18%, #3A2820 30%, #5A4A3A 44%, #8A7D6A 58%, #B8AE9C 72%, #D8CFBE 84%, #EDE5D4 93%, #F5EFE6 100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
