import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { legacyDishImages, legacySeasonDescriptions } from "@/data/legacySeasonMenu";
import { useIsMobile } from "@/hooks/use-mobile";
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
  pairingPriceNonAlcoholic: "Non-alcoholic pairing €100",
};

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
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const segmentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const dishes = useMemo(
    () =>
      menu.items.map((item, index) => ({
        id: `${season}-${index}`,
        index,
        number: String(index + 1).padStart(2, "0"),
        name: item,
        description: descriptions[index] || "",
        image: legacyDishImages[index] ?? null,
      })),
    [descriptions, menu.items, season],
  );

  const totalDishes = dishes.length;
  const activeDish = dishes[activeIndex] ?? dishes[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [season, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const nodes = segmentRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const index = Number((visibleEntries[0].target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) {
          setActiveIndex(index);
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.2, 0.5, 0.8, 1],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isMobile, totalDishes]);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className={`relative overflow-hidden bg-[#F5EFE6] text-[#1A1410] ${className}`.trim()}
    >
      {!isMobile ? (
        <div className="relative">
          <div className="sticky top-0 grid h-screen grid-cols-2 bg-[#F5EFE6]">
            <div className="flex h-full flex-col justify-between" style={{ padding: "120px 48px 64px 8%" }}>
              <div>
                {showHeader ? (
                  <>
                    <p
                      style={{
                        fontFamily: "Abel, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#C17D3E",
                      }}
                    >
                      TASTING MENU
                    </p>
                    <h2
                      className="mt-3"
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "clamp(36px, 5vw, 56px)",
                        lineHeight: 1,
                        color: "#1A1410",
                      }}
                    >
                      {seasonLabels[season]}
                    </h2>
                    <div
                      aria-hidden="true"
                      className="mt-4 mb-10"
                      style={{ width: "60px", height: "1px", backgroundColor: "rgba(26,20,16,0.1)" }}
                    />
                  </>
                ) : null}

                <div className="relative min-h-[320px] max-w-[460px] overflow-hidden">
                  {dishes.map((dish, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <div
                        key={dish.id}
                        aria-hidden={!isActive}
                        className="absolute inset-0"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? "translateY(0)" : "translateY(-12px)",
                          transition: prefersReducedMotion
                            ? "none"
                            : isActive
                              ? "opacity 350ms cubic-bezier(0.45, 0, 0.15, 1) 100ms, transform 350ms cubic-bezier(0.45, 0, 0.15, 1) 100ms"
                              : "opacity 250ms cubic-bezier(0.45, 0, 0.15, 1), transform 250ms cubic-bezier(0.45, 0, 0.15, 1)",
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        <div className="relative pt-10">
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 top-0 select-none"
                            style={{
                              fontFamily: "Fraunces, serif",
                              fontWeight: 400,
                              fontSize: "clamp(100px, 15vw, 200px)",
                              lineHeight: 0.8,
                              color: "rgba(26,20,16,0.04)",
                            }}
                          >
                            {dish.number}
                          </span>
                          <div className="relative z-10 max-w-[28rem]">
                            <h3
                              style={{
                                fontFamily: "Fraunces, serif",
                                fontStyle: "italic",
                                fontWeight: 400,
                                fontSize: "clamp(28px, 4vw, 42px)",
                                lineHeight: 1.15,
                                color: "#1A1410",
                              }}
                            >
                              {dish.name}
                            </h3>
                            <p
                              className="mt-3"
                              style={{
                                fontFamily: "Fraunces, serif",
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: "16px",
                                lineHeight: 1.4,
                                color: "rgba(26,20,16,0.5)",
                              }}
                            >
                              {dish.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p
                  style={{
                    fontFamily: "Abel, sans-serif",
                    fontSize: "12px",
                    color: "rgba(26,20,16,0.3)",
                  }}
                >
                  {activeDish.number} / {String(totalDishes).padStart(2, "0")}
                </p>
                <p
                  style={{
                    fontFamily: "Abel, sans-serif",
                    fontSize: "12px",
                    color: "rgba(26,20,16,0.25)",
                  }}
                >
                  {menuMeta.servings} · {menuMeta.tastingPrice}
                </p>
                <p
                  style={{
                    fontFamily: "Abel, sans-serif",
                    fontSize: "11px",
                    color: "rgba(26,20,16,0.2)",
                  }}
                >
                  {menuMeta.pairingPrice} · {menuMeta.pairingPriceNonAlcoholic}
                </p>
                {showCta ? (
                  <button
                    type="button"
                    onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" })}
                    className="pt-4 text-left"
                    style={{
                      fontFamily: "Abel, sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#1A1410",
                    }}
                  >
                    Reserve
                  </button>
                ) : null}
              </div>
            </div>

            <div className="relative h-screen overflow-hidden bg-[#2A1810]">
              {dishes.map((dish, index) => {
                const isActive = index === activeIndex;

                return dish.image ? (
                  <img
                    key={dish.id}
                    src={dish.image}
                    alt={isActive ? dish.name : ""}
                    aria-hidden={!isActive}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transition: prefersReducedMotion ? "none" : "opacity 500ms cubic-bezier(0.45, 0, 0.15, 1)",
                      filter: "brightness(0.92) contrast(1.05)",
                    }}
                  />
                ) : (
                  <div
                    key={dish.id}
                    aria-hidden={!isActive}
                    className="absolute inset-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transition: prefersReducedMotion ? "none" : "opacity 500ms cubic-bezier(0.45, 0, 0.15, 1)",
                      backgroundColor: "#2A1810",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none opacity-0">
            {dishes.map((dish, index) => (
              <div
                key={dish.id}
                ref={(node) => {
                  segmentRefs.current[index] = node;
                }}
                data-index={index}
                style={{ height: "80vh" }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 py-12 sm:px-8">
          <div className="mx-auto max-w-[760px]">
            {showHeader ? (
              <div className="mb-10">
                <p
                  style={{
                    fontFamily: "Abel, sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#C17D3E",
                  }}
                >
                  TASTING MENU
                </p>
                <h2
                  className="mt-3"
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(36px, 10vw, 56px)",
                    lineHeight: 1,
                    color: "#1A1410",
                  }}
                >
                  {seasonLabels[season]}
                </h2>
                <div
                  aria-hidden="true"
                  className="mt-4 mb-0"
                  style={{ width: "60px", height: "1px", backgroundColor: "rgba(26,20,16,0.1)" }}
                />
              </div>
            ) : null}

            <div className="space-y-10">
              {dishes.map((dish, index) => (
                <motion.article
                  key={dish.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : index * 0.06 }}
                  className="overflow-hidden"
                >
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-[280px] w-full object-cover"
                      style={{ filter: "brightness(0.92) contrast(1.05)" }}
                    />
                  ) : (
                    <div className="h-[280px] w-full" style={{ backgroundColor: "#2A1810" }} />
                  )}

                  <div className="relative px-0 pb-0 pt-6">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-2 select-none"
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontWeight: 400,
                        fontSize: "88px",
                        lineHeight: 0.8,
                        color: "rgba(26,20,16,0.04)",
                      }}
                    >
                      {dish.number}
                    </span>
                    <div className="relative z-10 pt-7">
                      <p
                        style={{
                          fontFamily: "Abel, sans-serif",
                          fontSize: "12px",
                          color: "rgba(26,20,16,0.3)",
                        }}
                      >
                        {dish.number} / {String(totalDishes).padStart(2, "0")}
                      </p>
                      <h3
                        className="mt-3"
                        style={{
                          fontFamily: "Fraunces, serif",
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: "32px",
                          lineHeight: 1.15,
                          color: "#1A1410",
                        }}
                      >
                        {dish.name}
                      </h3>
                      <p
                        className="mt-3"
                        style={{
                          fontFamily: "Fraunces, serif",
                          fontStyle: "italic",
                          fontWeight: 300,
                          fontSize: "16px",
                          lineHeight: 1.4,
                          color: "rgba(26,20,16,0.5)",
                        }}
                      >
                        {dish.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-10 space-y-2">
              <p
                style={{
                  fontFamily: "Abel, sans-serif",
                  fontSize: "12px",
                  color: "rgba(26,20,16,0.25)",
                }}
              >
                {menuMeta.servings} · {menuMeta.tastingPrice}
              </p>
              <p
                style={{
                  fontFamily: "Abel, sans-serif",
                  fontSize: "11px",
                  color: "rgba(26,20,16,0.2)",
                }}
              >
                {menuMeta.pairingPrice} · {menuMeta.pairingPriceNonAlcoholic}
              </p>
              {showCta ? (
                <button
                  type="button"
                  onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" })}
                  className="pt-4 text-left"
                  style={{
                    fontFamily: "Abel, sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#1A1410",
                  }}
                >
                  Reserve
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
