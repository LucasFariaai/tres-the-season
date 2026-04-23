import { useEffect, useMemo, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reducedMotion = useReducedMotion();

  const activeDish = menu.items[activeIndex] ?? menu.items[0];
  const activeDescription = descriptions[activeIndex] ?? descriptions[0] ?? "";
  const progressDots = menu.items.map((_, index) => index);

  const stackIndices = useMemo(() => {
    const length = legacyDishImages.length;
    return [
      (activeIndex - 1 + length) % length,
      activeIndex % length,
      (activeIndex + 1) % length,
      (activeIndex + 2) % length,
    ];
  }, [activeIndex]);

  useEffect(() => {
    if (reducedMotion) return;

    const nodes = lineRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) setActiveIndex(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "-42% 0px -42% 0px",
        threshold: 0.01,
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [menu.items, reducedMotion]);

  return (
    <section
      id="menu"
      ref={containerRef}
      className={`relative overflow-hidden bg-[#F3F0EB] text-[#2B231E] ${className}`.trim()}
      style={{ minHeight: "100vh" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 32%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.3), transparent 28%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-10 pt-4 sm:px-10 sm:pb-12 lg:px-12 lg:pb-14 lg:pt-3">
        {showCta ? (
          <div className="flex justify-center pb-6 sm:pb-8">
            <div
              className="flex items-center gap-3 border border-black/10 bg-[#7D7970] px-4 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
              style={{ borderRadius: "999px" }}
            >
              <img src={logoTresNav} alt="Tres" className="h-5 w-auto opacity-95" />
              <button
                type="button"
                onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
                className="flex items-center gap-1.5 bg-white px-5 py-2 text-[13px] font-medium text-[#231E1A] transition-opacity duration-300 hover:opacity-90"
                style={{ borderRadius: "999px", fontFamily: "'Source Sans 3', sans-serif" }}
              >
                Reserve
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid min-h-[calc(100vh-64px)] items-start gap-10 lg:grid-cols-[minmax(320px,0.88fr)_minmax(380px,1.12fr)] lg:gap-6 xl:gap-10">
          <div className="flex min-h-full flex-col justify-between lg:py-6 xl:py-10">
            <div>
              {showHeader ? (
                <div className="mb-10 sm:mb-12">
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
                  </h1>
                </div>
              ) : null}

              <div className="hidden lg:block lg:max-w-[420px] xl:max-w-[470px]">
                <div className="relative py-6 xl:py-8">
                  <span
                    className="pointer-events-none absolute left-0 top-0 select-none text-[92px] leading-none text-[#EEE6DA] xl:text-[108px]"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="relative z-10 pt-10">
                    <h2
                      className="max-w-[360px] text-[34px] leading-[1.08] text-[#332925] xl:max-w-[420px] xl:text-[42px]"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                    >
                      {activeDish}
                    </h2>
                    <p
                      className="mt-3 text-[16px] italic text-[#c9b89e] xl:text-[18px]"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                    >
                      {activeDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3 sm:space-y-4 lg:mt-14">
              <div className="flex items-center gap-2.5">
                {progressDots.map((dot) => {
                  const isActive = dot === activeIndex;
                  return (
                    <button
                      key={dot}
                      type="button"
                      aria-label={`Go to dish ${dot + 1}`}
                      onClick={() => {
                        setActiveIndex(dot);
                        lineRefs.current[dot]?.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
                      }}
                      className="transition-all duration-300"
                      style={{
                        width: isActive ? "22px" : "7px",
                        height: "7px",
                        borderRadius: "999px",
                        backgroundColor: isActive ? "hsl(var(--season-dark))" : "#E4D7C5",
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-[12px] text-[#B1A291]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {menuMeta.servings} · {menuMeta.tastingPrice} · {menuMeta.pairingPrice}
              </p>
            </div>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(340px,0.95fr)_minmax(340px,0.95fr)] lg:gap-6 xl:gap-10">
            <div className="order-2 lg:order-1 lg:pr-2 xl:pr-4">
              <div className="space-y-8 pb-12 lg:space-y-10 lg:pb-24 lg:pt-[34vh]">
                {menu.items.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={`${season}-${index}`}
                      ref={(node) => {
                        lineRefs.current[index] = node;
                      }}
                      data-index={index}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      className="block w-full text-left outline-none"
                      style={{
                        opacity: isActive ? 1 : 0.58,
                        transform: isActive ? "translateY(0)" : "translateY(0)",
                        transition: "opacity 280ms ease",
                      }}
                    >
                      <div className="relative py-3 lg:py-4">
                        <span
                          className="pointer-events-none absolute left-0 top-0 select-none text-[72px] leading-none text-[#EEE6DA] sm:text-[82px]"
                          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="relative z-10 pl-1 pt-8 sm:pt-9">
                          <h3
                            className="max-w-[360px] text-[28px] leading-[1.12] text-[#332925] sm:text-[32px]"
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                          >
                            {item}
                          </h3>
                          <p
                            className="mt-2 text-[15px] italic text-[#c9b89e] sm:text-[16px]"
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                          >
                            {descriptions[index] || ""}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:py-10">
              <div className="relative mx-auto h-[560px] w-full max-w-[520px] sm:h-[620px] lg:h-[680px] lg:max-w-[560px] xl:h-[720px]">
                <div
                  className="absolute left-[20%] top-[3%] h-[24%] w-[58%] overflow-hidden rounded-2xl border border-white/20 bg-[#c4b7a4]/40"
                  style={{
                    opacity: 0.7,
                    transform: "translateZ(0)",
                  }}
                >
                  <img src={legacyDishImages[stackIndices[0]]} alt="" className="h-full w-full object-cover blur-[1px] saturate-[0.8]" />
                </div>

                <div
                  className="absolute left-[16%] top-[20%] h-[58%] w-[68%] overflow-hidden rounded-[28px] bg-[#c6b8a5]/30"
                  style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}
                >
                  <img
                    src={legacyDishImages[stackIndices[1]]}
                    alt={activeDish}
                    className="h-full w-full object-cover"
                    style={{ transition: reducedMotion ? "none" : "transform 360ms ease, opacity 260ms ease" }}
                  />
                </div>

                <div className="absolute left-[20%] top-[73%] h-[20%] w-[58%] overflow-hidden rounded-2xl bg-[#b9a997]/35 opacity-65">
                  <img src={legacyDishImages[stackIndices[2]]} alt="" className="h-full w-full object-cover" />
                </div>

                <div className="absolute left-[24%] top-[86%] h-[12%] w-[50%] overflow-hidden rounded-2xl bg-[#d9d2c6]/70 opacity-60">
                  <img src={legacyDishImages[stackIndices[3]]} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
