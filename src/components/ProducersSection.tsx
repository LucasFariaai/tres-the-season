import { useEffect, useRef, useState } from "react";
import { useSeason, seasonLabels, type Season } from "@/lib/seasonContext";

interface Producer {
  name: string;
  specialty: string;
  distance: string;
  quote: string;
}

const producers: Record<Season, Producer[]> = {
  winter: [
    { name: "Vishandel de Kust", specialty: "North Sea fish, day-boat catch", distance: "12 km", quote: "The cold water gives the flesh its firm texture." },
    { name: "Hoeve Biesland", specialty: "Root vegetables, heritage varieties", distance: "18 km", quote: "What sleeps under frozen ground feeds the soul." },
    { name: "De Citroenboom", specialty: "Preserved citrus, ferments", distance: "8 km", quote: "Preservation is the art of patience." },
  ],
  spring: [
    { name: "Tuin van Floddertje", specialty: "Wild herbs, edible flowers", distance: "6 km", quote: "Spring doesn't wait. We pick at dawn." },
    { name: "Schapenboerderij Groen", specialty: "Young lamb, free-range", distance: "22 km", quote: "Our lambs taste the first grass of the year." },
    { name: "Aspergehoeve", specialty: "White asparagus, hand-cut", distance: "28 km", quote: "Each spear is cut by hand, before sunrise." },
  ],
  summer: [
    { name: "Tomatenkas Zuid", specialty: "Heirloom tomatoes, 40 varieties", distance: "15 km", quote: "A good tomato needs nothing but sunshine." },
    { name: "Fruitweide", specialty: "Stone fruit, berries", distance: "20 km", quote: "Summer is too short not to taste it." },
    { name: "Kruidenrijk", specialty: "Fresh herbs, micro greens", distance: "5 km", quote: "We grow flavour, not volume." },
  ],
  autumn: [
    { name: "Wildhandel Veluwe", specialty: "Wild game, venison, pheasant", distance: "25 km", quote: "The forest provides when you respect it." },
    { name: "Paddenstoelen Pracht", specialty: "Wild mushrooms, foraged", distance: "10 km", quote: "I know every tree in this forest by name." },
    { name: "Landgoed de Herfst", specialty: "Pumpkin, quince, chestnuts", distance: "16 km", quote: "Autumn is not decline — it is ripening." },
  ],
};

function ProducerCard({ producer, index }: { producer: Producer; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="min-w-[280px] sm:min-w-[320px] snap-start bg-season-lighter/50 rounded-sm p-6 season-transition"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s ease ${index * 0.1}s`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-display text-lg text-season-darkest season-transition">{producer.name}</h3>
        <span className="text-xs font-body text-season-mid season-transition">{producer.distance}</span>
      </div>
      <p className="font-body text-sm text-season-mid mb-4 season-transition">{producer.specialty}</p>
      <p className="font-accent text-sm text-season-dark season-transition">"{producer.quote}"</p>
    </div>
  );
}

export default function ProducersSection() {
  const { season } = useSeason();
  const seasonProducers = producers[season];

  return (
    <section id="producers" className="bg-background season-transition py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-season-mid mb-4 season-transition">
          The Producers Circle
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-season-dark mb-4 season-transition">
          Within 30 kilometres
        </h2>
        <p className="font-body text-muted-foreground max-w-lg mb-12">
          Every ingredient has a name. Every producer, a story. Our {seasonLabels[season].toLowerCase()} menu is shaped by what grows closest.
        </p>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide">
          {seasonProducers.map((p, i) => (
            <ProducerCard key={`${season}-${p.name}`} producer={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
