import { useEffect, useRef, useState } from "react";

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
}

const producers: Producer[] = [
  { name: "Willem de Boer", specialty: "Heritage lamb, Hoeksche Waard", distance: "18km", image: producer01 },
  { name: "Anneke Visser", specialty: "Raw milk cheese, Alblasserwaard", distance: "24km", image: producer02 },
  { name: "Joris van Dijk", specialty: "Line-caught fish, North Sea", distance: "28km", image: producer03 },
  { name: "Marieke Bos", specialty: "Wild herbs & foraging, Biesbosch", distance: "15km", image: producer04 },
  { name: "Pieter Hendriks", specialty: "Heritage vegetables, Westland", distance: "12km", image: producer05 },
  { name: "Sanne de Groot", specialty: "Honeycomb & beeswax, Ridderkerk", distance: "8km", image: producer06 },
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
      className="min-w-[280px] sm:min-w-[320px] snap-start rounded-lg overflow-hidden cursor-pointer group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s ease ${index * 0.1}s`,
        boxShadow: "0 4px 20px -4px rgba(42, 31, 24, 0.15)",
      }}
    >
      {/* Portrait photo — top 65% */}
      <div className="relative h-[280px] sm:h-[300px] overflow-hidden">
        <img
          src={producer.image}
          alt={producer.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={640}
          height={896}
        />
        {/* Warm tint overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(42, 31, 24, 0.1)", mixBlendMode: "multiply" }}
        />
      </div>

      {/* Info — bottom 35% */}
      <div
        className="p-5 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ backgroundColor: "#E8DCC8" }}
      >
        <h3 className="font-display text-lg" style={{ color: "#2A1F18" }}>
          {producer.name}
        </h3>
        <p className="font-accent text-sm mt-1" style={{ color: "#8B7355" }}>
          {producer.specialty}
        </p>
        <span
          className="inline-block mt-3 px-3 py-1 text-xs font-body tracking-wide rounded-full"
          style={{
            color: "#8B7355",
            border: "1px solid rgba(139, 115, 85, 0.3)",
          }}
        >
          {producer.distance}
        </span>
      </div>
    </div>
  );
}

function SourcingRadius() {
  const ref = useRef<SVGCircleElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setDrawn(true); obs.unobserve(el); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const circumference = 2 * Math.PI * 120;

  return (
    <div className="flex flex-col items-center mt-20 mb-8">
      <svg width="260" height="260" viewBox="0 0 260 260" className="opacity-30">
        <circle
          ref={ref}
          cx="130"
          cy="130"
          r="120"
          fill="none"
          stroke="hsl(var(--season-mid))"
          strokeWidth="1"
          strokeDasharray={circumference}
          strokeDashoffset={drawn ? 0 : circumference}
          style={{ transition: "stroke-dashoffset 2s ease-out" }}
        />
        {/* Center dot */}
        <circle cx="130" cy="130" r="3" fill="hsl(var(--season-mid))" />
      </svg>
      <p
        className="font-display text-lg mt-4 tracking-wide"
        style={{ color: "#B8B0A3" }}
      >
        30km
      </p>
      <p
        className="font-body text-xs uppercase tracking-[0.2em] mt-1"
        style={{ color: "#B8B0A3" }}
      >
        Tres · Rotterdam
      </p>
    </div>
  );
}

export default function ProducersSection() {
  return (
    <>
      {/* Transitional quote strip */}
      <div
        className="w-full flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: "#2A1F18",
          minHeight: "300px",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <p
          className="font-display italic text-xl sm:text-2xl max-w-2xl leading-relaxed"
          style={{ color: "#F7F3ED" }}
        >
          "The best producers and growers have been invited to be a part of this celebration of Dutch produce."
        </p>
        <p
          className="font-body text-xs uppercase tracking-[0.25em] mt-6"
          style={{ color: "#8B7355" }}
        >
          All ingredients sourced within 30km of Rotterdam
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
          {/* Section header */}
          <div className="mb-16">
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
              className="font-accent text-base max-w-lg"
              style={{ color: "#8B7355" }}
            >
              Every name on this wall has shaped what you'll taste tonight.
            </p>
          </div>

          {/* Horizontal scrolling cards */}
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 scrollbar-hide">
            {producers.map((p, i) => (
              <ProducerCard key={p.name} producer={p} index={i} />
            ))}
          </div>

          {/* Sourcing radius visual */}
          <SourcingRadius />
        </div>
      </section>
    </>
  );
}
