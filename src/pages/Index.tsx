import { useState } from "react";
import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ChapterBreak from "@/components/ChapterBreak";
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
      <ChapterBreak word="Winter" subtitle="Where the season is stored." />
      <ZoomParallaxSection />
      <SeasonsArchiveSection />
      <ConceptSection />
      <ProducersSection />
      <ReserveSection />
      <FooterSection />
    </div>
  );
};

export default Index;
