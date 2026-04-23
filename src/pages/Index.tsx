import { useState } from "react";
import SeasonBar from "@/components/SeasonBar";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import SeasonsArchiveSection from "@/components/SeasonsArchiveSection";
import MenuSecretSection from "@/components/MenuSecretSection";
import MenuPoemSection from "@/components/MenuPoemSection";
import ConceptSection from "@/components/ConceptSection";
import GreenStarSection from "@/components/GreenStarSection";
import DarkToCreamTransition from "@/components/DarkToCreamTransition";
import TresGallerySection from "@/components/TresGallerySection";
import ProducersSection from "@/components/ProducersSection";
import ReserveSection from "@/components/ReserveSection";
import FooterSection from "@/components/FooterSection";
import IntroOverlay from "@/components/IntroOverlay";
import { usePublishedHome } from "@/hooks/usePublishedHome";

/* Organic mist transition: dark → cream */
function HeroToZoomBand() {
  return (
    <div
      aria-hidden="true"
      className="hero-cream-transition w-full"
      style={{
        position: "relative",
        height: "clamp(340px, 45vw, 560px)",
        overflow: "hidden",
        backgroundColor: "#1b1310",
      }}
    >
      {/* Base gradient — 20 stops, imperceptible steps */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(to bottom,
          #1b1310 0%,
          #1d1512 5%,
          #201713 10%,
          #241a15 16%,
          #2a1e19 22%,
          #32261e 28%,
          #3e3028 34%,
          #4e3f32 40%,
          #61513f 46%,
          #78654f 52%,
          #8f7c62 58%,
          #a89278 64%,
          #bea88e 70%,
          #cfbca2 75%,
          #daccb5 80%,
          #e3d6c5 85%,
          #eae0d2 89%,
          #efe7db 92%,
          #f3ece2 95%,
          #f7f2ee 100%
        )`,
      }} />

      {/* Left dark mist — rises higher on left */}
      <div style={{
        position: "absolute",
        left: "-12%",
        top: "18%",
        width: "52%",
        height: "65%",
        borderRadius: "42% 58% 52% 48% / 48% 42% 58% 52%",
        background: "radial-gradient(ellipse at center, rgba(27,19,16,0.52) 0%, rgba(27,19,16,0.22) 45%, transparent 70%)",
        filter: "blur(52px)",
        transform: "rotate(-6deg)",
      }} />

      {/* Right dark mist — sinks lower */}
      <div style={{
        position: "absolute",
        right: "-10%",
        top: "34%",
        width: "48%",
        height: "58%",
        borderRadius: "52% 48% 45% 55% / 55% 45% 55% 45%",
        background: "radial-gradient(ellipse at center, rgba(27,19,16,0.46) 0%, rgba(27,19,16,0.18) 45%, transparent 68%)",
        filter: "blur(60px)",
        transform: "rotate(4deg)",
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 300px",
      }} />
    </div>
  );
}

/* Organic mist transition: cream → dark (inverted) */
function ZoomToProducersBand() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        height: "clamp(300px, 35vw, 460px)",
        overflow: "hidden",
        backgroundColor: "#f7f2ee",
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(to bottom,
          #f7f2ee 0%,
          #f1ebe1 5%,
          #e8dece 11%,
          #ddd1bc 18%,
          #cfc0a8 25%,
          #bdac91 32%,
          #a89478 39%,
          #907b60 46%,
          #79634c 53%,
          #634f3b 60%,
          #503d2d 66%,
          #3f2e21 72%,
          #31221a 78%,
          #271b15 83%,
          #221613 88%,
          #1e1412 92%,
          #1c1311 96%,
          #1b1310 100%
        )`,
      }} />

      {/* Right mist stays lighter longer */}
      <div style={{
        position: "absolute",
        right: "-8%",
        top: "20%",
        width: "50%",
        height: "62%",
        borderRadius: "48% 52% 55% 45% / 52% 48% 52% 48%",
        background: "radial-gradient(ellipse at center, rgba(247,242,238,0.35) 0%, rgba(247,242,238,0.1) 45%, transparent 68%)",
        filter: "blur(56px)",
        transform: "rotate(5deg)",
      }} />

      {/* Left mist goes dark sooner */}
      <div style={{
        position: "absolute",
        left: "-6%",
        top: "30%",
        width: "46%",
        height: "56%",
        borderRadius: "55% 45% 48% 52% / 45% 55% 45% 55%",
        background: "radial-gradient(ellipse at center, rgba(27,19,16,0.4) 0%, transparent 65%)",
        filter: "blur(50px)",
        transform: "rotate(-4deg)",
      }} />

      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 300px",
      }} />
    </div>
  );
}

const Index = () => {
  const [introDone, setIntroDone] = useState(false);
  const { content, theme } = usePublishedHome();

  return (
    <div className="min-h-screen">
      {!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}
      <SeasonBar />
      <HeroSection shouldPlay={introDone} content={content.hero} theme={theme} />
      <HeroToZoomBand />
      <ZoomParallaxSection content={content.zoom} theme={theme} />
      <SeasonsArchiveSection />
      <MenuSecretSection />
      <MenuPoemSection showCta={false} />
      <ConceptSection content={content.concept} theme={theme} />
      <GreenStarSection />
      <ZoomToProducersBand />
      <ProducersSection content={content.producers} theme={theme} />
      <ReserveSection content={content.reserve} theme={theme} />
      <DarkToCreamTransition />
      <TresGallerySection content={content.gallery} theme={theme} />
      <FooterSection content={content.footer} theme={theme} />
    </div>
  );
};

export default Index;
