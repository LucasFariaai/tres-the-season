import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import logoTresNav from "@/assets/logo-tres-nav.svg";
import { legacyDishImages, legacySeasonDescriptions } from "@/data/legacySeasonMenu";
import { seasonLabels, seasonMenus, type Season, useSeason } from "@/lib/seasonContext";

type MenuPoemProps = {
  seasonOverride?: Season;
  showHeader?: boolean;
  showCta?: boolean;
  className?: string;
};

const menuMeta = {
  servings: "18 servings",
  tastingPrice: "€185",
  pairingPrice: "Wine pairing €110",
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
}: MenuPoemProps) {
  const { season: contextSeason } = useSeason();
  const season = seasonOverride ?? contextSeason;
  const menu = seasonMenus[season];
  const descriptions = legacySeasonDescriptions[season] || legacySeasonDescriptions.spring;
  const reducedMotion = useReducedMotion();
  const totalCount = menu.items.length;
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

  const activeDish = menu.items[activeIndex] ?? menu.items[0];
  const activeDescription = descriptions[activeIndex] ?? descriptions[0] ?? "";
  const activeImage =
    legacyDishImages[activeIndex % legacyDishImages.length] ?? legacyDishImages[0];

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
            {menu.items.map((item, index) => (
              <li key={`${season}-${index}`} className="grid gap-6 lg:grid-cols-[0.9fr_1fr] lg:gap-10">
                <div>
                  <h3
                    className="text-[28px] leading-[1.12] text-[#332925]"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                  >
                    {item}
                  </h3>
                  <p
                    className="mt-2 text-[16px] italic text-[#c9b89e]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {descriptions[index] || ""}
                  </p>
                </div>
                <img
                  src={legacyDishImages[index % legacyDishImages.length]}
                  alt={item}
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

          <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-10">
            <div className="flex flex-col justify-center">
              {showHeader ? (
                <div className="mb-10">
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

              <div className="relative min-h-[320px] lg:min-h-[380px] xl:min-h-[420px]">
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
                      className="max-w-[520px] text-[36px] leading-[1.08] text-[#332925] xl:text-[44px]"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                    >
                      {activeDish}
                    </h2>
                    <p
                      className="mt-4 max-w-[520px] text-[17px] italic text-[#c9b89e] xl:text-[19px]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {activeDescription}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-2">
                  {menu.items.map((_, dot) => {
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
            </div>

            <div className="relative flex items-center justify-center">
              <div
                className="relative mx-auto h-[58vh] w-full max-w-[560px] overflow-hidden rounded-[32px] bg-[#c6b8a5]/20 sm:h-[62vh] lg:h-[68vh] xl:h-[72vh]"
                style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.14)" }}
              >
                <AnimatePresence mode="sync" initial={false}>
                  <motion.img
                    key={`img-${season}-${activeIndex}`}
                    src={activeImage}
                    alt={activeDish}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>

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
