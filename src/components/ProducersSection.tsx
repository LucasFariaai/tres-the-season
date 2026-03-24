import { useEffect, useRef, useState, useCallback } from "react";

import producer01 from "@/assets/producers/producer-01.jpg";
import producer02 from "@/assets/producers/producer-02.jpg";
import producer03 from "@/assets/producers/producer-03.jpg";
import producer04 from "@/assets/producers/producer-04.jpg";
import producer05 from "@/assets/producers/producer-05.jpg";
import producer06 from "@/assets/producers/producer-06.jpg";

interface Producer {
  name: string;
  specialty: string;
  distance: string;
  image: string;
  region: string;
}

const producers: Producer[] = [
  { name: "Willem de Boer", specialty: "Heritage lamb, Hoeksche Waard", distance: "18km", image: producer01, region: "Hoeksche Waard" },
  { name: "Anneke Visser", specialty: "Raw milk cheese, Alblasserwaard", distance: "24km", image: producer02, region: "Alblasserwaard" },
  { name: "Joris van Dijk", specialty: "Line-caught fish, North Sea", distance: "28km", image: producer03, region: "North Sea" },
  { name: "Marieke Bos", specialty: "Wild herbs & foraging, Biesbosch", distance: "15km", image: producer04, region: "Biesbosch" },
  { name: "Pieter Hendriks", specialty: "Heritage vegetables, Westland", distance: "12km", image: producer05, region: "Westland" },
  { name: "Sanne de Groot", specialty: "Honeycomb & beeswax, Ridderkerk", distance: "8km", image: producer06, region: "Ridderkerk" },
];

// Positions around the circle for region dots (angle in degrees)
const regionDots = [
  { label: "Hoeksche Waard", angle: 35 },
  { label: "Biesbosch", angle: 135 },
  { label: "Westland", angle: 225 },
  { label: "North Sea", angle: 315 },
];

function ProducerCard({ producer, index }: { producer: Producer; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="min-w-[280px] sm:min-w-[300px] snap-start overflow-hidden cursor-pointer group"
      style={{
        height: "420px",
        borderRadius: "6px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        transition: `all 0.6s ease ${index * 0.1}s`,
        boxShadow: "0 4px 20px rgba(42, 31, 24, 0.12)",
      }}
    >
      <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: "6px" }}>
        {/* Full-bleed portrait */}
        <img
          src={producer.image}
          alt={producer.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          loading="lazy"
          width={600}
          height={840}
        />
        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "45%",
            background: "linear-gradient(to top, rgba(42, 31, 24, 0.85) 0%, rgba(42, 31, 24, 0.4) 60%, transparent 100%)",
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Hover: lighten overlay */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            height: "45%",
            background: "linear-gradient(to top, rgba(42, 31, 24, 0.65) 0%, rgba(42, 31, 24, 0.2) 60%, transparent 100%)",
            transition: "opacity 0.4s ease",
          }}
        />
        {/* Text on overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3 className="font-display text-lg" style={{ color: "#F7F3ED" }}>
            {producer.name}
          </h3>
          <p className="font-accent text-[13px] mt-1" style={{ color: "#D4CFC6" }}>
            {producer.specialty}
          </p>
          <span
            className="inline-block mt-3 px-3 py-0.5 text-[11px] font-body tracking-wide rounded-full"
            style={{
              color: "#D4CFC6",
              border: "1px solid #8B7355",
            }}
          >
            {producer.distance}
          </span>
        </div>
      </div>
    </div>
  );
}

function SourcingRadius() {
  const ref = useRef<SVGCircleElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [dotsVisible, setDotsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          obs.unobserve(el);
          setTimeout(() => setDotsVisible(true), 1800);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const r = 110;
  const cx = 140;
  const cy = 140;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center mt-20 mb-8">
      <div className="relative" style={{ width: 280, height: 280 }}>
        <svg width="280" height="280" viewBox="0 0 280 280">
          {/* Main circle */}
          <circle
            ref={ref}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#D4CFC6"
            strokeWidth="1"
            opacity="0.4"
            strokeDasharray={circumference}
            strokeDashoffset={drawn ? 0 : circumference}
            style={{ transition: "stroke-dashoffset 2s ease-out" }}
          />
          {/* Center dot */}
          <circle cx={cx} cy={cy} r="3" fill="#8B7355" />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-body text-[10px] tracking-[0.15em] uppercase" style={{ color: "#8B7355" }}>
            Tres
          </span>
          <span className="font-accent text-[14px] mt-1" style={{ color: "#8B7355" }}>
            30km radius
          </span>
        </div>

        {/* Region dots */}
        {regionDots.map((dot, i) => {
          const rad = (dot.angle * Math.PI) / 180;
          const dotR = r - 8;
          const x = cx + dotR * Math.cos(rad);
          const y = cy + dotR * Math.sin(rad);
          const labelLeft = dot.angle > 90 && dot.angle < 270;
          
          return (
            <div
              key={dot.label}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                opacity: dotsVisible ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.15}s`,
              }}
            >
              <div className="relative flex items-center">
                <div
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ backgroundColor: "#8B7355" }}
                />
                <span
                  className="absolute whitespace-nowrap font-body text-[9px] tracking-wide uppercase"
                  style={{
                    color: "#B8B0A3",
                    [labelLeft ? "right" : "left"]: "12px",
                  }}
                >
                  {dot.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScrollArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300"
      style={{
        border: "1px solid #B8B0A3",
        color: "#8B7355",
        background: "rgba(247, 243, 237, 0.8)",
      }}
      aria-label={`Scroll ${direction}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        {direction === "left" ? (
          <path d="M9 2L4 7L9 12" />
        ) : (
          <path d="M5 2L10 7L5 12" />
        )}
      </svg>
    </button>
  );
}

export default function ProducersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
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
        className="relative overflow-hidden py-24 sm:py-32"
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

        <div className="relative z-[2] max-w-7xl mx-auto px-6">
          {/* Section header — centered */}
          <div className="text-center mb-16">
            <p
              className="font-body text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "#8B7355" }}
            >
              Our Producers
            </p>
            <h2
              className="font-display text-4xl sm:text-5xl mb-4"
              style={{ color: "#2A1F18" }}
            >
              The Circle
            </h2>
            <p
              className="font-accent text-base max-w-lg mx-auto"
              style={{ color: "#8B7355" }}
            >
              Every name here has shaped what you'll taste tonight.
            </p>
          </div>

          {/* Card carousel with arrows */}
          <div className="relative group/scroll">
            {/* Left arrow */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-1">
              <ScrollArrow direction="left" onClick={() => scroll("left")} />
            </div>

            {/* Scrollable cards */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {producers.map((p, i) => (
                <ProducerCard key={p.name} producer={p} index={i} />
              ))}
            </div>

            {/* Right arrow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-1">
              <ScrollArrow direction="right" onClick={() => scroll("right")} />
            </div>
          </div>

          {/* Minimal scroll indicator */}
          <div className="flex justify-center mt-8">
            <div
              className="relative overflow-hidden rounded-full"
              style={{ width: 200, height: 2, backgroundColor: "#E8DCC8" }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${Math.max(20, scrollProgress * 100)}%`,
                  backgroundColor: "#8B7355",
                  transition: "width 0.15s ease-out",
                }}
              />
            </div>
          </div>

          {/* Sourcing radius */}
          <SourcingRadius />

          {/* Closing quote */}
          <p
            className="font-accent text-lg text-center mt-12 mb-4"
            style={{ color: "#B8B0A3" }}
          >
            Complex without being complicated.
          </p>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: "80px" }} />
      </section>
    </>
  );
}
