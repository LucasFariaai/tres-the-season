import { useEffect, useRef, useState } from "react";
import { useSeason, seasonMenus, seasonLabels } from "@/lib/seasonContext";
import menuSpring from "@/assets/menu-spring.jpg";

// Seasonal palette shades for abstract circular thumbnails
const seasonThumbnailColors: Record<string, string[]> = {
  winter: [
    "hsl(213, 27%, 24%)", "hsl(212, 14%, 48%)", "hsl(209, 18%, 71%)",
    "hsl(210, 18%, 60%)", "hsl(213, 18%, 35%)", "hsl(220, 30%, 20%)",
    "hsl(209, 18%, 55%)", "hsl(212, 14%, 40%)",
  ],
  spring: [
    "hsl(130, 20%, 33%)", "hsl(120, 22%, 53%)", "hsl(118, 30%, 70%)",
    "hsl(132, 18%, 42%)", "hsl(118, 35%, 60%)", "hsl(130, 25%, 28%)",
    "hsl(120, 22%, 45%)", "hsl(118, 30%, 55%)",
  ],
  summer: [
    "hsl(30, 32%, 31%)", "hsl(34, 30%, 50%)", "hsl(38, 45%, 65%)",
    "hsl(40, 55%, 55%)", "hsl(34, 30%, 40%)", "hsl(30, 32%, 25%)",
    "hsl(38, 45%, 50%)", "hsl(34, 30%, 60%)",
  ],
  autumn: [
    "hsl(22, 38%, 26%)", "hsl(22, 40%, 39%)", "hsl(30, 55%, 50%)",
    "hsl(32, 50%, 45%)", "hsl(22, 38%, 33%)", "hsl(24, 30%, 20%)",
    "hsl(30, 55%, 40%)", "hsl(22, 40%, 50%)",
  ],
};

function MenuLine({ text, index, season }: { text: string; index: number; season: string }) {
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

  const colors = seasonThumbnailColors[season] || seasonThumbnailColors.spring;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      className="relative py-6 border-b border-season-lighter/30 season-transition"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      {/* Watermark number */}
      <span
        className="absolute -left-2 top-1/2 -translate-y-1/2 font-display text-[80px] leading-none select-none pointer-events-none season-transition"
        style={{ opacity: 0.06 }}
      >
        {num}
      </span>

      <div className="flex items-center gap-5 relative z-10">
        {/* Circular color thumbnail */}
        <div
          className="w-[60px] h-[60px] rounded-full flex-shrink-0"
          style={{
            backgroundColor: colors[index % colors.length],
            opacity: 0.7,
          }}
        />
        <span className="font-display text-xl sm:text-2xl md:text-[28px] text-season-dark season-transition leading-snug">
          {text}
        </span>
      </div>
    </div>
  );
}

export default function MenuPoem() {
  const { season } = useSeason();
  const menu = seasonMenus[season];

  return (
    <section id="menu" className="bg-season-lightest season-transition relative overflow-hidden">
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-[2] max-w-7xl mx-auto">
        {/* Section header */}
        <div className="px-6 pt-24 sm:pt-32 pb-12 text-center">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-season-mid mb-4 season-transition">
            Tasting Menu · {seasonLabels[season]}
          </p>
          <h2 className="font-accent text-xl sm:text-2xl text-season-dark mb-4 season-transition">
            {menu.subtitle}
          </h2>
          <p className="font-body text-sm text-season-mid/70 season-transition">
            8 servings · €185 per guest
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row">
          {/* Left: Sticky image */}
          <div className="hidden lg:block lg:w-[40%] relative">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
              <img
                src={menuSpring}
                alt="Seasonal ingredients"
                className="w-full h-full object-cover"
                loading="lazy"
                width={640}
                height={960}
              />
              {/* Seasonal tint overlay */}
              <div
                className="absolute inset-0 bg-season-dark/20 mix-blend-multiply season-transition"
              />
            </div>
          </div>

          {/* Right: Menu items */}
          <div className="w-full lg:w-[60%] px-6 sm:px-10 lg:px-16 pb-24">
            <div>
              {menu.items.map((item, i) => (
                <MenuLine key={`${season}-${i}`} text={item} index={i} season={season} />
              ))}
            </div>

            {/* Pairings */}
            <div className="mt-12 pt-8 border-t border-season-lighter/30">
              <p className="font-body text-sm text-season-mid/70 season-transition text-center">
                Wine pairing €110 · Non-alcoholic pairing €100
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <button
                onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-block px-10 py-4 bg-season-dark text-season-lightest font-accent text-sm tracking-[0.15em] uppercase rounded-sm hover:bg-season-darkest transition-colors season-transition"
              >
                Reserve Your Evening
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
