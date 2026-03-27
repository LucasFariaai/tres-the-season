import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import DishStack from "@/components/DishStack";
import SeasonSelector from "@/components/SeasonSelector";
import ConceptSection from "@/components/ConceptSection";
import ProducersSection from "@/components/ProducersSection";

import ReserveSection from "@/components/ReserveSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SeasonBar />
      <HeroSection />
      <ZoomParallaxSection />
      <DishStack />
      <SeasonSelector />
      <ConceptSection />
      <ProducersSection />
      
      <ReserveSection />
      <FooterSection />
    </div>
  );
};

export default Index;
