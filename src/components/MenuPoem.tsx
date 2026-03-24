import { useEffect, useRef, useState, useCallback } from "react";
import { useSeason, seasonMenus, seasonLabels } from "@/lib/seasonContext";

// Dish images — spring set (used as default for all seasons for now)
import dish01 from "@/assets/dishes/dish-01.jpg";
import dish02 from "@/assets/dishes/dish-02.jpg";
import dish03 from "@/assets/dishes/dish-03.jpg";
import dish04 from "@/assets/dishes/dish-04.jpg";
import dish05 from "@/assets/dishes/dish-05.jpg";
import dish06 from "@/assets/dishes/dish-06.jpg";
import dish07 from "@/assets/dishes/dish-07.jpg";
import dish08 from "@/assets/dishes/dish-08.jpg";

const dishImages = [dish01, dish02, dish03, dish04, dish05, dish06, dish07, dish08];

// Poetic one-line descriptions per season per dish
const seasonDescriptions: Record<string, string[]> = {
  spring: [
    "Spring pastures, first foraging",
    "The earth still cool, the stem still pale",
    "Hedgerow blossoms, morning milk",
    "Forest floor after rain",
    "The garden at its gentlest",
    "First warmth, first sweetness",
    "Wildflowers pressed into curd",
    "A whisper of citrus and herb",
  ],
  summer: [
    "Sun-warmed, hand-torn, still breathing",
    "Orchard heat trapped in juice",
    "Tide pools at golden hour",
    "Pollen dust on yellow petals",
    "The garden in full chorus",
    "Stone fruit, sun-split, fragrant",
    "Aged slowly, served simply",
    "The long day's last sweetness",
  ],
  autumn: [
    "Dark woods, cold morning, smoke",
    "Earth and age, nothing wasted",
    "Field to fire, butter to brown",
    "Preserved before the frost",
    "Raw edge, soft centre",
    "Roots, bark, deep forest",
    "Rind and rot, noble and true",
    "Bitterness tempered by heat",
  ],
  winter: [
    "Cold sea, patient hands",
    "Underground, unhurried",
    "Brightness against the grey",
    "River to smoke to silk",
    "What the earth gives slowly",
    "Ice crystals on crimson",
    "Time compressed into flavour",
    "Dark, salt, stillness",
  ],
};

const seasonSubheadings: Record<string, string> = {
  spring: "A celebration of first growth",
  summer: "Abundance at the golden hour",
  autumn: "The harvest, the hearth, the fire",
  winter: "Stillness, depth, preservation",
};

function MenuLine({
  text,
  description,
  index,
  onInView,
}: {
  text: string;
  description: string;
  index: number;
  onInView: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fade-in observer
    const fadeObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          fadeObserver.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    fadeObserver.observe(el);

    // Active-tracking observer (center of viewport)
    const activeObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onInView(index);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.1,
      }
    );
    activeObserver.observe(el);

    return () => {
      fadeObserver.disconnect();
      activeObserver.disconnect();
    };
  }, [index, onInView]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        paddingTop: index === 0 ? "0px" : "40px",
        paddingBottom: "40px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${index * 0.08}s, transform 0.7s ease ${index * 0.08}s`,
      }}
    >
      {/* Watermark number */}
      <span
        className="absolute -left-1 -top-2 font-display text-[100px] leading-none select-none pointer-events-none"
        style={{ color: "#E8DCC8", opacity: 0.2 }}
      >
        {num}
      </span>

      <div className="relative z-10 pl-14 sm:pl-16">
        <h3
          className="font-display text-[22px] sm:text-[26px] leading-snug"
          style={{ color: "#2A1F18" }}
        >
          {text}
        </h3>
        <p
          className="font-accent text-[14px] sm:text-[15px] mt-1.5"
          style={{ color: "#8B7355" }}
        >
          {description}
        </p>
      </div>

      {/* Divider */}
      <div
        className="mt-8 sm:mt-10 h-px w-full"
        style={{ backgroundColor: "#E8DCC8" }}
      />
    </div>
  );
}

export default function MenuPoem() {
  const { season } = useSeason();
  const menu = seasonMenus[season];
  const descriptions = seasonDescriptions[season] || seasonDescriptions.spring;
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const handleInView = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Crossfade image when active dish changes
  useEffect(() => {
    if (activeIndex === displayIndex) return;
    setFading(true);
    const timeout = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setFading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [activeIndex, displayIndex]);

  return (
    <>
      {/* Hero-to-menu gradient transition strip */}
      <div
        className="h-[150px] w-full"
        style={{
          background: "linear-gradient(to bottom, #1A1410, #F7F3ED)",
        }}
      />

      <section
        id="menu"
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F7F3ED" }}
      >
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />

        <div className="relative z-[2] max-w-7xl mx-auto">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row">
            {/* Left: Sticky dish image showcase */}
            <div className="hidden lg:block lg:w-[45%] relative">
            <div className="sticky top-0 h-screen flex items-center justify-center p-8">
                <div
                  className="relative w-full max-h-[75vh] overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    maskImage: "radial-gradient(ellipse 75% 75% at center, black 45%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 75% 75% at center, black 45%, transparent 100%)",
                  }}
                >
                  <img
                    src={dishImages[displayIndex % dishImages.length]}
                    alt={menu.items[displayIndex] || "Seasonal dish"}
                    className="w-full h-full object-cover"
                    style={{
                      opacity: fading ? 0 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                    loading="lazy"
                    width={800}
                    height={1000}
                  />
                  {/* Soft overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at center, transparent 40%, rgba(247, 243, 237, 0.6) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Menu items */}
            <div className="w-full lg:w-[55%] px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 lg:pt-32 pb-24">
              {/* Section header */}
              <div className="mb-16 sm:mb-20">
                <p
                  className="font-body text-xs tracking-[0.3em] uppercase mb-4"
                  style={{ color: "#8B7355" }}
                >
                  Tasting Menu
                </p>
                <h2
                  className="font-display italic text-3xl sm:text-4xl mb-3 season-transition"
                  style={{ color: "hsl(var(--season-dark))" }}
                >
                  {seasonLabels[season]}
                </h2>
                <p
                  className="font-accent text-base mb-3"
                  style={{ color: "#B8B0A3" }}
                >
                  {seasonSubheadings[season]}
                </p>
                <p
                  className="font-body text-[13px]"
                  style={{ color: "#B8B0A3" }}
                >
                  18 servings · €185 per guest
                </p>
              </div>

              {/* Menu items */}
              <div>
                {menu.items.map((item, i) => (
                  <MenuLine
                    key={`${season}-${i}`}
                    text={item}
                    description={descriptions[i] || ""}
                    index={i}
                    onInView={handleInView}
                  />
                ))}
              </div>

              {/* Pairings */}
              <div className="mt-8 pt-8">
                <p
                  className="font-body text-sm text-center"
                  style={{ color: "#B8B0A3" }}
                >
                  Wine pairing €110 · Non-alcoholic pairing €100
                </p>
              </div>

              {/* CTA */}
              <div className="mt-12 text-center">
                <button
                  onClick={() =>
                    document
                      .getElementById("reserve")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-block px-10 py-4 font-display text-sm tracking-[0.12em] uppercase rounded-sm transition-colors duration-300"
                  style={{
                    backgroundColor: "#2A1F18",
                    color: "#F7F3ED",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `hsl(var(--season-dark))`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2A1F18";
                  }}
                >
                  Reserve Your Evening
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
