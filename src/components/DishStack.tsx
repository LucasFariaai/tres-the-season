import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type PanInfo } from "framer-motion";
import { useSeason, seasonMenus, seasonLabels } from "@/lib/seasonContext";

import dish01 from "@/assets/dishes/dish-01.jpg";
import dish02 from "@/assets/dishes/dish-02.jpg";
import dish03 from "@/assets/dishes/dish-03.jpg";
import dish04 from "@/assets/dishes/dish-04.jpg";
import dish05 from "@/assets/dishes/dish-05.jpg";
import dish06 from "@/assets/dishes/dish-06.jpg";
import dish07 from "@/assets/dishes/dish-07.jpg";
import dish08 from "@/assets/dishes/dish-08.jpg";

const dishImages = [dish01, dish02, dish03, dish04, dish05, dish06, dish07, dish08];

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

export default function DishStack() {
  const { season } = useSeason();
  const menu = seasonMenus[season];
  const descriptions = seasonDescriptions[season] || seasonDescriptions.spring;
  const items = menu.items;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scroll-driven index: section height = items.length * 100vh
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to currentIndex
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const maxIndex = items.length - 1;
      const newIndex = Math.min(maxIndex, Math.max(0, Math.round(v * maxIndex)));
      setCurrentIndex(newIndex);
    });
    return unsubscribe;
  }, [scrollYProgress, items.length]);

  // Click on dot → scroll to that step
  const scrollToIndex = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.offsetTop;
      const sectionScrollHeight = section.offsetHeight - window.innerHeight;
      const targetScroll = sectionTop + (index / (items.length - 1)) * sectionScrollHeight;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [items.length]
  );

  // Drag navigation
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold && currentIndex < items.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else if (info.offset.y > threshold && currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
    if (diff === -1) return { y: -160, scale: 0.88, opacity: 0.5, zIndex: 4, rotateX: 6 };
    if (diff === -2) return { y: -260, scale: 0.78, opacity: 0.2, zIndex: 3, rotateX: 12 };
    if (diff === 1) return { y: 160, scale: 0.88, opacity: 0.5, zIndex: 4, rotateX: -6 };
    if (diff === 2) return { y: 260, scale: 0.78, opacity: 0.2, zIndex: 3, rotateX: -12 };
    return { y: diff > 0 ? 400 : -400, scale: 0.7, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -15 : 15 };
  };

  const isVisible = (index: number) => Math.abs(index - currentIndex) <= 2;

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="relative w-full"
      style={{
        height: `${items.length * 40}vh`,
        backgroundColor: "#F7F3ED",
      }}
    >
      {/* Sticky inner container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Paper texture */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />

        <div className="relative z-[2] h-full flex flex-col lg:flex-row">
          {/* Left: Dish info — uses flex column with mt-auto footer */}
          <div className="flex flex-col justify-between px-8 sm:px-12 lg:px-20 lg:w-[45%] h-[35vh] lg:h-full py-8 lg:py-16">
            {/* Header */}
            <div>
              <p
                className="font-body text-xs tracking-[0.3em] uppercase mb-2"
                style={{ color: "#8B7355" }}
              >
                Tasting Menu
              </p>
              <h2
                className="font-display italic text-2xl sm:text-3xl mb-4 season-transition"
                style={{ color: "hsl(var(--season-dark))" }}
              >
                {seasonLabels[season]}
              </h2>
            </div>

            {/* Active dish info */}
            <div className="relative flex-1 flex items-center">
              <div className="relative w-full max-w-md">
                {items.map((item, i) => (
                  <motion.div
                    key={`${season}-${i}`}
                    initial={false}
                    animate={{
                      opacity: i === currentIndex ? 1 : 0,
                      y: i === currentIndex ? 0 : 10,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute top-1/2 -translate-y-1/2 left-0 w-full"
                    style={{ pointerEvents: i === currentIndex ? "auto" : "none" }}
                  >
                    <div className="relative pt-10 sm:pt-14">
                      <span
                        className="absolute -top-2 left-0 font-display text-[72px] sm:text-[90px] leading-none select-none pointer-events-none"
                        style={{ color: "#E8DCC8", opacity: 0.25 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="font-display text-[22px] sm:text-[28px] leading-snug relative z-[1] break-words"
                        style={{ color: "#2A1F18" }}
                      >
                        {item}
                      </h3>
                      <p
                        className="font-accent text-[14px] sm:text-[15px] mt-3 leading-relaxed relative z-[1] break-words"
                        style={{ color: "#8B7355" }}
                      >
                        {descriptions[i] || ""}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer: dots + pricing */}
            <div className="space-y-4">
              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className="transition-all duration-300"
                    style={{
                      width: i === currentIndex ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      backgroundColor: i === currentIndex
                        ? "hsl(var(--season-dark))"
                        : "#E8DCC8",
                    }}
                    aria-label={`Go to dish ${i + 1}`}
                  />
                ))}
              </div>

              {/* Pairings */}
              <p
                className="font-body text-[12px]"
                style={{ color: "#B8B0A3" }}
              >
                18 servings · €185 · Wine pairing €110
              </p>
            </div>
          </div>

          {/* Right: Image stack */}
          <div className="relative flex-1 flex items-center justify-center perspective-[1200px] h-[65vh] lg:h-full">
            <motion.div
              className="relative w-[280px] h-[370px] sm:w-[340px] sm:h-[450px] lg:w-[400px] lg:h-[530px]"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              style={{ cursor: "grab" }}
            >
              {items.map((item, index) => {
                if (!isVisible(index)) return null;
                const style = getCardStyle(index);

                return (
                  <motion.div
                    key={`${season}-img-${index}`}
                    initial={false}
                    animate={{
                      y: style.y,
                      scale: style.scale,
                      opacity: style.opacity,
                      rotateX: style.rotateX,
                    }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0"
                    style={{ zIndex: style.zIndex }}
                  >
                    <div
                      className="w-full h-full overflow-hidden rounded-2xl"
                      style={{
                        boxShadow: "0 12px 40px rgba(42, 31, 24, 0.2)",
                      }}
                    >
                      <img
                        src={dishImages[index % dishImages.length]}
                        alt={item}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1/4"
                        style={{
                          background: "linear-gradient(to top, rgba(42,31,24,0.4), transparent)",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Counter */}
            <div
              className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 font-display"
              style={{ color: "#B8B0A3" }}
            >
              <span className="text-2xl" style={{ color: "#2A1F18" }}>
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-1">/</span>
              <span className="text-sm">
                {String(items.length).padStart(2, "0")}
              </span>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 lg:hidden">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#B8B0A3" strokeWidth="1.5">
                <path d="M3 10l5-5 5 5" />
              </svg>
              <span className="font-body text-[11px] tracking-[0.15em] uppercase" style={{ color: "#B8B0A3" }}>
                Scroll or drag
              </span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#B8B0A3" strokeWidth="1.5">
                <path d="M3 6l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
