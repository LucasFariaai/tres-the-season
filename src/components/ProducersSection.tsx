import { useCallback, useRef, useState } from "react";
import ProducerCard from "./producers/ProducerCard";
import ProducerMap from "./producers/ProducerMap";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type { ProducersContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface ProducersSectionProps {
  content?: ProducersContent;
  theme?: SiteThemeTokens;
}

export default function ProducersSection({ content, theme }: ProducersSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionContent = content ?? defaultHomeCmsContent.producers;
  const sectionTheme = theme ?? defaultSiteTheme;

  const handlePinClick = useCallback((index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleCardClick = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section id="producers" className="relative overflow-hidden" style={{ backgroundColor: sectionTheme.producersBackground }}>
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <div className="relative z-[2] px-6 pb-8 pt-0 text-center">
        <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">{sectionContent.eyebrow}</p>
        <h2 className="mb-4 font-display text-4xl text-[hsl(var(--wine-bg))] sm:text-5xl">{sectionContent.title}</h2>
        <p className="mx-auto max-w-lg font-accent text-base text-[hsl(var(--accent))]">{sectionContent.body}</p>
        <p className="mt-3 font-body text-xs text-muted-foreground">{sectionContent.helper}</p>
      </div>

      <div className="relative z-[2] hidden lg:flex" style={{ height: "85vh", maxHeight: "800px" }}>
        <div className="w-[45%] overflow-y-auto border-r border-border">
          {sectionContent.items.map((producer, index) => (
            <div key={`${producer.name}-${index}`} ref={(el) => { cardRefs.current[index] = el; }}>
              <ProducerCard producer={producer} index={index} isActive={activeIndex === index} onHover={setHoveredIndex} onClick={handleCardClick} />
            </div>
          ))}
        </div>
        <div className="w-[55%]">
          <ProducerMap activeIndex={activeIndex} hoveredIndex={hoveredIndex} onPinClick={handlePinClick} className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-[2] lg:hidden">
        <ProducerMap activeIndex={activeIndex} hoveredIndex={hoveredIndex} onPinClick={handlePinClick} className="w-full" style={{ height: "50vh" }} />
        <div className="px-2">
          {sectionContent.items.map((producer, index) => (
            <div key={`${producer.name}-${index}`} ref={(el) => { cardRefs.current[index] = el; }}>
              <ProducerCard producer={producer} index={index} isActive={activeIndex === index} onHover={setHoveredIndex} onClick={handleCardClick} />
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-[2] py-16 text-center font-accent text-lg text-muted-foreground">{sectionContent.closingQuote}</p>
    </section>
  );
}
