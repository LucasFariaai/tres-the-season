import { useState } from "react";
import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import SeasonsArchiveSection from "@/components/SeasonsArchiveSection";
import MenuPoemSection from "@/components/MenuPoemSection";
import ConceptSection from "@/components/ConceptSection";
import GreenStarSection from "@/components/GreenStarSection";
import SectionTransition from "@/components/SectionTransition";
import TresGallerySection from "@/components/TresGallerySection";
import ProducersSection from "@/components/ProducersSection";
import ReserveSection from "@/components/ReserveSection";
import FooterSection from "@/components/FooterSection";
import IntroOverlay from "@/components/IntroOverlay";
import { usePublishedHome } from "@/hooks/usePublishedHome";

const DARK = "#1b1310";
const CREAM = "#F5EFE6";

const Index = () => {
  const [introDone, setIntroDone] = useState(false);
  const { content, theme } = usePublishedHome();

  return (
    <div className="min-h-screen">
      {!introDone && <div><IntroOverlay onComplete={() => setIntroDone(true)} /></div>}
      <div><SeasonBar /></div>
      <div><HeroSection shouldPlay={introDone} content={content.hero} theme={theme} /></div>
      <div><SectionTransition from={DARK} to={CREAM} /></div>
      <div><ZoomParallaxSection content={content.zoom} theme={theme} /></div>
      <div>
        <SectionTransition
          from={CREAM}
          to={CREAM}
          height="200vh"
          content={content.livingMenuTransition}
        />
      </div>
      <div><SeasonsArchiveSection /></div>
      <div><MenuPoemSection showCta={false} /></div>
      <div><ConceptSection content={content.concept} theme={theme} /></div>
      <div><GreenStarSection content={content.greenStar} /></div>
      <div>
        <SectionTransition
          from={DARK}
          to={CREAM}
          height="200vh"
          content={content.circleTransition}
        />
      </div>
      <div><ProducersSection content={content.producers} theme={theme} /></div>
      <div><ReserveSection content={content.reserve} theme={theme} /></div>
      <div><TresGallerySection content={content.gallery} theme={theme} /></div>
      <div><FooterSection content={content.footer} theme={theme} /></div>
    </div>
  );
};

export default Index;
