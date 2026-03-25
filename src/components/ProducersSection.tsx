import { useRef, useState, useCallback, useEffect } from "react";
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
    <>
      {/* Transitional dark quote strip */}
      <div
        className="w-full flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#2A1F18", paddingTop: "100px", paddingBottom: "100px" }}
      >
        <p
          className="font-display italic text-xl sm:text-2xl max-w-2xl leading-relaxed"
          style={{ color: "#F7F3ED" }}
        >
          "The best producers and growers have been invited to be a part of this celebration of Dutch produce."
        </p>
        <p
          className="font-body text-[13px] uppercase tracking-[0.25em] mt-6"
          style={{ color: "#8B7355" }}
        >
          Every ingredient sourced within 30 kilometres of Rotterdam
        </p>
      </div>

      {/* Producers section */}
      <section
        id="producers"
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F7F3ED" }}
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
        <div className="relative z-[2] text-center pt-24 pb-8 px-6">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#8B7355" }}>
            Our Producers
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4" style={{ color: "#2A1F18" }}>
            The Circle
          </h2>
          <p className="font-accent text-base max-w-lg mx-auto" style={{ color: "#8B7355" }}>
            Every name here has shaped what you'll taste tonight.
          </p>
          <p className="font-body text-xs mt-3" style={{ color: "#B8B0A3" }}>
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
        <p className="font-accent text-lg text-center py-16 relative z-[2]" style={{ color: "#B8B0A3" }}>
          Complex without being complicated.
        </p>
      </section>
    </>
  );
}
