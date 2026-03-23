import { useEffect, useRef, useState } from "react";
import { useSeason, seasonMenus, seasonLabels } from "@/lib/seasonContext";

function MenuLine({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="py-5 border-b border-season-lighter/30 season-transition"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
    >
      <span className="font-display text-xl sm:text-2xl md:text-3xl text-season-dark season-transition">
        {text}
      </span>
    </div>
  );
}

export default function MenuPoem() {
  const { season } = useSeason();
  const menu = seasonMenus[season];

  return (
    <section id="menu" className="bg-season-lightest season-transition py-24 sm:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-season-mid mb-4 season-transition">
          Tasting Menu · {seasonLabels[season]}
        </p>
        <h2 className="font-accent text-xl sm:text-2xl text-season-dark mb-16 season-transition">
          {menu.subtitle}
        </h2>

        <div>
          {menu.items.map((item, i) => (
            <MenuLine key={`${season}-${i}`} text={item} index={i} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-display text-3xl text-season-dark mb-8 season-transition">€185</p>
          <button
            onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-block px-8 py-3 bg-season-dark text-season-lightest font-body text-sm tracking-widest uppercase rounded-sm hover:bg-season-darkest transition-colors season-transition"
          >
            Reserve
          </button>
        </div>
      </div>
    </section>
  );
}
