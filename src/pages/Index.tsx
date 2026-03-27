import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import MenuPoem from "@/components/MenuPoem";
import ProducersSection from "@/components/ProducersSection";
import ProcessSection from "@/components/ProcessSection";
import ReserveSection from "@/components/ReserveSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SeasonBar />
      <HeroSection />
      <ZoomParallaxSection />
      <MenuPoem />
      <ProducersSection />
      <ProcessSection />
      <ReserveSection />
      <FooterSection />
    </div>
  );
};

export default Index;
