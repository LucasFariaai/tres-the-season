import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import logoTresNav from "@/assets/logo-tres-nav.svg";
import { seasonLabels, type Season, useSeason } from "@/lib/seasonContext";
import { usePublishedHome } from "@/hooks/usePublishedHome";
import { defaultHomeCmsContent } from "@/lib/site-editor/defaults";
import type { MenusContent } from "@/lib/site-editor/types";

type MenuPoemProps = {
  seasonOverride?: Season;
  showHeader?: boolean;
  showCta?: boolean;
  className?: string;
  menus?: MenusContent;
};

const SCROLL_PER_DISH_VH = 40;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default function MenuPoem({
  seasonOverride,
  showHeader = true,
  showCta = true,
  className = "",
  menus,
}: MenuPoemProps) {
  const { season: contextSeason } = useSeason();
  const season = seasonOverride ?? contextSeason;
  const sourceMenus = menus ?? defaultHomeCmsContent.menus;
  const seasonMenu = sourceMenus[season] ?? defaultHomeCmsContent.menus[season];
  const dishes = seasonMenu.items.length > 0 ? seasonMenu.items : defaultHomeCmsContent.menus[season].items;
  const reducedMotion = useReducedMotion();
  const totalCount = dishes.length;
  const { content: cmsContent } = usePublishedHome();
  const menuMeta = {
    servings: "18 servings",
    tastingPrice: cmsContent.reserve.price,
    pairingPrice: `Wine pairing ${cmsContent.reserve.alcoholicPairingPrice}`,
  };

  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reducedMotion) return;
    const clamped = Math.max(0, Math.min(0.9999, progress));
    const idx = Math.min(totalCount - 1, Math.floor(clamped * totalCount));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  // Reset to first dish when the season changes so the active index never points past the end.
  useEffect(() => {
    setActiveIndex(0);
  }, [season, totalCount]);

  const activeDish = dishes[activeIndex] ?? dishes[0];
  const dishImages = useMemo(() => dishes.map((dish) => dish.image), [dishes]);

  // Preload all dish images once so swaps are instant.
  useEffect(() => {
    dishImages.forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [dishImages]);

  const sectionHeight = reducedMotion
    ? "auto"
    : `calc(100vh + ${totalCount * SCROLL_PER_DISH_VH}vh)`;

  if (reducedMotion) {
    return (
      <section
        id="menu"
        ref={sectionRef}
        className={`relative bg-[#F5EFE6] text-[#2B231E] ${className}`.trim()}
      >
        <div className="mx-auto max-w-[1100px] px-6 py-16 sm:px-10 lg:px-12">
          {showHeader ? (
            <div className="mb-14">
              <p
                className="text-[11px] uppercase tracking-[0.34em] text-[#c9b89e]"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                Tasting Menu
              </p>
              <h1
                className="mt-2 text-[44px] leading-none sm:text-[54px]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "hsl(var(--season-dark))",
                }}
              >
                {seasonLabels[season]}
                <span className="ml-3 align-baseline text-[24px] sm:text-[28px] not-italic tracking-[0.08em] text-[#c9b89e]" style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 300 }}>2025</span>
              </h1>
            </div>
          ) : null}
          <ul className="space-y-12">
            {dishes.map((dish, index) => (
              <li key={`${season}-${index}`} className="grid gap-6 lg:grid-cols-[0.9fr_1fr] lg:gap-10">
                <div>
                  <h3
                    className="text-[28px] leading-[1.12] text-[#332925]"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                  >
                    {dish.name}
                  </h3>
                  <p
                    className="mt-2 text-[16px] italic text-[#c9b89e]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {dish.description}
                  </p>
                </div>
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full rounded-[28px] object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      id="menu"
      ref={sectionRef}
      className={`relative bg-[#F5EFE6] text-[#2B231E] ${className}`.trim()}
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 flex h-screen w-full items-stretch overflow-hidden">
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col px-6 sm:px-10 lg:px-12">
          {showCta ? (
            <div className="flex justify-center pt-5 sm:pt-7">
              <div
                className="flex items-center gap-3 border border-black/10 bg-[#7D7970] px-4 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                style={{ borderRadius: "999px" }}
              >
                <img src={logoTresNav} alt="Tres" className="h-5 w-auto opacity-95" />
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("reserve")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center gap-1.5 bg-white px-5 py-2 text-[13px] font-medium text-[#231E1A] transition-opacity duration-300 hover:opacity-90"
                  style={{ borderRadius: "999px", fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Reserve
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col flex-1 gap-6 py-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-[1fr_auto] lg:items-stretch lg:gap-x-16 lg:gap-y-0 lg:py-10">
            <div className="order-1 flex flex-col lg:col-start-1 lg:row-start-1 lg:justify-center">
              {showHeader ? (
                <div className="mb-6 lg:mb-10">
                  <p
                    className="text-[11px] uppercase tracking-[0.34em] text-[#c9b89e]"
                    style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    Tasting Menu
                  </p>
                  <h1
                    className="mt-2 text-[44px] leading-none sm:text-[54px]"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      color: "hsl(var(--season-dark))",
                    }}
                  >
                    {seasonLabels[season]}
                    <span className="ml-3 align-baseline text-[24px] sm:text-[28px] not-italic tracking-[0.08em] text-[#c9b89e]" style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 300 }}>2025</span>
                  </h1>
                </div>
              ) : null}

              <div className="relative min-h-[150px] lg:min-h-[380px] xl:min-h-[420px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`text-${season}-${activeIndex}`}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <h2
                      className="max-w-[520px] text-[32px] leading-[1.08] text-[#332925] sm:text-[36px] xl:text-[44px]"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                    >
                      {activeDish?.name}
                    </h2>
                    <p
                      className="mt-3 max-w-[520px] text-[15px] italic text-[#c9b89e] sm:text-[17px] xl:text-[19px]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {activeDish?.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="order-3 space-y-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-10 lg:space-y-4">
              <div className="flex items-center gap-2">
                {dishes.map((_, dot) => {
                  const isActive = dot === activeIndex;
                  return (
                    <span
                      key={dot}
                      aria-hidden="true"
                      className="transition-all duration-500"
                      style={{
                        width: isActive ? "22px" : "6px",
                        height: "6px",
                        borderRadius: "999px",
                        backgroundColor: isActive ? "hsl(var(--season-dark))" : "#E4D7C5",
                      }}
                    />
                  );
                })}
              </div>
              <p
                className="text-[12px] text-[#B1A291]"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                {menuMeta.servings} · {menuMeta.tastingPrice} · {menuMeta.pairingPrice}
              </p>
            </div>

            <div className="order-2 relative flex items-center justify-center lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div
                className="relative mx-auto h-[58vh] w-full max-w-[560px] overflow-hidden rounded-[32px] bg-[#c6b8a5]/20 sm:h-[62vh] lg:h-[68vh] xl:h-[72vh]"
                style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.14)" }}
              >
                {dishes.map((dish, index) => {
                  const isActive = index === activeIndex;
                  // Eager-load current + next; lazy for the rest.
                  const isPriority = isActive || index === (activeIndex + 1) % totalCount;
                  return (
                    <motion.img
                      key={`dish-${season}-${index}`}
                      src={dish.image}
                      alt={dish.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      decoding="async"
                      loading={isPriority ? "eager" : "lazy"}
                      // @ts-expect-error fetchpriority is a valid HTML attr
                      fetchpriority={isActive ? "high" : "low"}
                      draggable={false}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 1.04,
                      }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      style={{ willChange: "opacity, transform" }}
                    />
                  );
                })}

                <div
                  className="pointer-events-none absolute bottom-5 right-5 text-[11px] tracking-[0.3em] text-white/85 mix-blend-difference"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="mx-2 opacity-60">/</span>
                  {String(totalCount).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
