import { useRef, useState, useCallback } from "react";
import ProducerCard from "./producers/ProducerCard";
import ProducerMap from "./producers/ProducerMap";
import { producers } from "./producers/data";

export default function ProducersSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handlePinClick = useCallback((index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleCardClick = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="producers"
      className="relative overflow-hidden"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />

        {/* Section header */}
        <div className="relative z-[2] text-center pt-0 pb-8 px-6">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "hsl(30 22% 44%)" }}>
            Our Producers
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4" style={{ color: "hsl(var(--wine-bg))" }}>
            The Circle
          </h2>
          <p className="font-accent text-base max-w-lg mx-auto" style={{ color: "hsl(30 22% 44%)" }}>
            Every name here has shaped what you'll taste tonight.
          </p>
          <p className="font-body text-xs mt-3" style={{ color: "hsl(35 13% 69%)" }}>
            Explore our network of local producers
          </p>
        </div>

        {/* Split view — desktop */}
        <div className="relative z-[2] hidden lg:flex" style={{ height: "85vh", maxHeight: "800px" }}>
          {/* Left panel — scrollable producer list */}
          <div
            className="w-[45%] overflow-y-auto"
            style={{ borderRight: "1px solid #E8DCC8" }}
          >
            {producers.map((p, i) => (
              <div key={p.name} ref={(el) => { cardRefs.current[i] = el; }}>
                <ProducerCard
                  producer={p}
                  index={i}
                  isActive={activeIndex === i}
                  onHover={setHoveredIndex}
                  onClick={handleCardClick}
                />
              </div>
            ))}
          </div>

          {/* Right panel — sticky map */}
          <div className="w-[55%]">
            <ProducerMap
              activeIndex={activeIndex}
              hoveredIndex={hoveredIndex}
              onPinClick={handlePinClick}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="relative z-[2] lg:hidden">
          {/* Map at top */}
          <ProducerMap
            activeIndex={activeIndex}
            hoveredIndex={hoveredIndex}
            onPinClick={handlePinClick}
            className="w-full"
            style={{ height: "50vh" }}
          />
          {/* Producer list below */}
          <div className="px-2">
            {producers.map((p, i) => (
              <div key={p.name} ref={(el) => { cardRefs.current[i] = el; }}>
                <ProducerCard
                  producer={p}
                  index={i}
                  isActive={activeIndex === i}
                  onHover={setHoveredIndex}
                  onClick={handleCardClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Closing quote */}
        <p className="font-accent text-lg text-center py-16 relative z-[2]" style={{ color: "hsl(35 13% 69%)" }}>
          Complex without being complicated.
        </p>
      </section>
  );
}
