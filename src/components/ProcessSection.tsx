import { useEffect, useRef, useState } from "react";
import { useSeason, type Season } from "@/lib/seasonContext";

interface ProcessItem {
  title: string;
  caption: string;
}

const processes: Record<Season, ProcessItem[]> = {
  winter: [
    { title: "Dry-aging", caption: "Turbot aged for 14 days develops a depth of umami." },
    { title: "Fermenting", caption: "Root vegetables lacto-fermented since autumn." },
    { title: "Smoking", caption: "Cold-smoked eel over beechwood for 48 hours." },
    { title: "Preserving", caption: "Citrus preserved in salt, ready since October." },
  ],
  spring: [
    { title: "Foraging", caption: "Wild garlic gathered from the forest floor at dawn." },
    { title: "Pickling", caption: "First asparagus trimmings pickled for depth." },
    { title: "Infusing", caption: "Elderflower steeped in goat's whey overnight." },
    { title: "Sprouting", caption: "Micro herbs grown in our own greenhouse." },
  ],
  summer: [
    { title: "Grilling", caption: "Stone fruit charred over grapevine embers." },
    { title: "Curing", caption: "Langoustine cured with summer herbs and sea salt." },
    { title: "Drying", caption: "Tomatoes slow-dried for concentrated sweetness." },
    { title: "Churning", caption: "Cultured butter made fresh each morning." },
  ],
  autumn: [
    { title: "Braising", caption: "Game braised low and slow with juniper and bay." },
    { title: "Foraging", caption: "Wild mushrooms foraged from the Veluwe forests." },
    { title: "Fermenting", caption: "Berries lacto-fermented for acidic complexity." },
    { title: "Roasting", caption: "Chestnuts roasted and turned into silky purée." },
  ],
};

function ProcessCard({ item, index }: { item: ProcessItem; index: number }) {
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
      className="bg-season-dark/10 rounded-sm p-6 season-transition group cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s ease ${index * 0.1}s`,
      }}
    >
      <h3 className="font-display text-xl text-season-darkest mb-3 season-transition">
        {item.title}
      </h3>
      <p className="font-body text-sm text-season-mid leading-relaxed season-transition">
        {item.caption}
      </p>
    </div>
  );
}

export default function ProcessSection() {
  const { season } = useSeason();
  const items = processes[season];

  return (
    <section id="process" className="bg-season-lightest season-transition py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-season-mid mb-4 season-transition">
          The Process
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-season-dark mb-12 season-transition">
          How we work this season
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <ProcessCard key={`${season}-${item.title}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
