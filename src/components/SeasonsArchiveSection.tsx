import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { seasonLabels, seasonMenus, type Season, useSeason } from "@/lib/seasonContext";
import { useIsMobile } from "@/hooks/use-mobile";

import foodCotton from "@/assets/food-cotton.jpg";
import foodTableSpread from "@/assets/food-table-spread.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDryage from "@/assets/food-dryage.jpg";
import dish01 from "@/assets/dishes/dish-01.jpg";
import dish02 from "@/assets/dishes/dish-02.jpg";
import dish03 from "@/assets/dishes/dish-03.jpg";
import dish04 from "@/assets/dishes/dish-04.jpg";
import dish05 from "@/assets/dishes/dish-05.jpg";
import dish06 from "@/assets/dishes/dish-06.jpg";
import dish07 from "@/assets/dishes/dish-07.jpg";
import dish08 from "@/assets/dishes/dish-08.jpg";

gsap.registerPlugin(ScrollTrigger);

const allSeasons: Season[] = ["spring", "summer", "autumn", "winter"];
const dishImages = [dish01, dish02, dish03, dish04, dish05, dish06, dish07, dish08];

const seasonMeta: Record<Season, { ordinal: string; teaser: string; year: string; image: string; video?: string | null }> = {
  spring: {
    ordinal: "01",
    teaser: "First growth, wild garlic, elderflower",
    year: "2024",
    image: foodCotton,
    video: null,
  },
  summer: {
    ordinal: "02",
    teaser: "Stone fruit, langoustine, edible flowers",
    year: "2024",
    image: foodTableSpread,
    video: null,
  },
  autumn: {
    ordinal: "03",
    teaser: "Wild game, porcini, fermented berries",
    year: "2024",
    image: foodDessert,
    video: null,
  },
  winter: {
    ordinal: "04",
    teaser: "Smoked eel, black truffle, bone marrow",
    year: "2024",
    image: foodDryage,
    video: null,
  },
};

const seasonDescriptions: Record<Season, string[]> = {
  spring: [
    "Spring pastures, first foraging.",
    "The earth still cool, the stem still pale.",
    "Hedgerow blossoms, morning milk.",
    "Forest floor after rain.",
    "The garden at its gentlest.",
    "First warmth, first sweetness.",
    "Wildflowers pressed into curd.",
    "A whisper of citrus and herb.",
  ],
  summer: [
    "Sun-warmed, hand-torn, still breathing.",
    "Orchard heat trapped in juice.",
    "Tide pools at golden hour.",
    "Pollen dust on yellow petals.",
    "The garden in full chorus.",
    "Stone fruit, sun-split, fragrant.",
    "Aged slowly, served simply.",
    "The long day's last sweetness.",
  ],
  autumn: [
    "Dark woods, cold morning, smoke.",
    "Earth and age, nothing wasted.",
    "Field to fire, butter to brown.",
    "Preserved before the frost.",
    "Raw edge, soft centre.",
    "Roots, bark, deep forest.",
    "Rind and rot, noble and true.",
    "Bitterness tempered by heat.",
  ],
  winter: [
    "Cold sea, patient hands.",
    "Underground, unhurried.",
    "Brightness against the grey.",
    "River to smoke to silk.",
    "What the earth gives slowly.",
    "Ice crystals on crimson.",
    "Time compressed into flavour.",
    "Dark, salt, stillness.",
  ],
};

function getDishRows(season: Season) {
  const items = seasonMenus[season]?.items ?? [];
  const descriptions = seasonDescriptions[season] ?? [];

  if (!items.length) {
    return Array.from({ length: 4 }, (_, index) => ({
      id: `${season}-placeholder-${index}`,
      number: String(index + 1).padStart(2, "0"),
      name: "Coming soon",
      description: "",
      image: dishImages[index % dishImages.length],
    }));
  }

  return items.map((item, index) => ({
    id: `${season}-${index}`,
    number: String(index + 1).padStart(2, "0"),
    name: item,
    description: descriptions[index] ?? "",
    image: dishImages[index % dishImages.length],
  }));
}

export default function SeasonsArchiveSection() {
  const { season, setSeason } = useSeason();
  const isMobile = useIsMobile();
  const [hoveredSeason, setHoveredSeason] = useState<Season | null>(null);
  const [displayedSeason, setDisplayedSeason] = useState<Season>("spring");
  const [dishPhase, setDishPhase] = useState<"in" | "out">("in");
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const rowContentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rowWatermarkRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const chapterRef = useRef<HTMLDivElement | null>(null);
  const chapterLabelRef = useRef<HTMLParagraphElement | null>(null);
  const chapterLineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const chapterSubtitleRef = useRef<HTMLParagraphElement | null>(null);

  const activeSeason = useMemo(() => hoveredSeason && !isMobile ? hoveredSeason : season, [hoveredSeason, isMobile, season]);
  const dishRows = useMemo(() => getDishRows(displayedSeason), [displayedSeason]);

  useEffect(() => {
    setSeason("spring");
  }, [setSeason]);

  useEffect(() => {
    if (season === displayedSeason) return;

    setDishPhase("out");
    const timeout = window.setTimeout(() => {
      setDisplayedSeason(season);
      setDishPhase("in");
    }, 420);

    return () => window.clearTimeout(timeout);
  }, [displayedSeason, season]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      rowContentRefs.current.forEach((node) => node?.classList.add("is-visible"));
      rowWatermarkRefs.current.forEach((node) => node?.classList.add("is-visible"));
      return;
    }

    const triggers = rowRefs.current.map((row, index) => {
      const content = rowContentRefs.current[index];
      const watermark = rowWatermarkRefs.current[index];
      if (!row || !content || !watermark) return null;

      content.classList.remove("is-visible");
      watermark.classList.remove("is-visible");

      return ScrollTrigger.create({
        trigger: row,
        start: "top 82%",
        onEnter: () => {
          window.setTimeout(() => content.classList.add("is-visible"), index * 80);
          window.setTimeout(() => watermark.classList.add("is-visible"), index * 80 + 200);
        },
        onLeaveBack: () => {
          content.classList.remove("is-visible");
          watermark.classList.remove("is-visible");
        },
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, [dishRows]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chapter = chapterRef.current;
    const label = chapterLabelRef.current;
    const subtitle = chapterSubtitleRef.current;
    const lines = chapterLineRefs.current.filter(Boolean) as HTMLParagraphElement[];
    if (!chapter || !label || !subtitle || !lines.length) return;

    if (prefersReduced) {
      label.classList.add("is-visible");
      subtitle.classList.add("is-visible");
      lines.forEach((line) => line.classList.add("is-visible"));
      return;
    }

    [label, subtitle, ...lines].forEach((node) => node.classList.remove("is-visible"));

    const trigger = ScrollTrigger.create({
      trigger: chapter,
      start: "top 72%",
      onEnter: () => {
        label.classList.add("is-visible");
        lines.forEach((line, index) => {
          window.setTimeout(() => line.classList.add("is-visible"), 200 + index * 200);
        });
        window.setTimeout(() => subtitle.classList.add("is-visible"), 850);
      },
      onLeaveBack: () => {
        label.classList.remove("is-visible");
        subtitle.classList.remove("is-visible");
        lines.forEach((line) => line.classList.remove("is-visible"));
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="tres-editorial-theme relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <div className="mb-12 text-center sm:mb-16">
          <p
            className="mb-4 uppercase"
            style={{
              color: "hsl(var(--wine-accent))",
              fontFamily: "Abel, sans-serif",
              fontSize: "12px",
              letterSpacing: "0.18em",
            }}
          >
            THE SEASONS
          </p>
          <h2
            style={{
              color: "hsl(var(--wine-text))",
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            A living menu
          </h2>
          <p
            className="mx-auto mt-3 max-w-2xl"
            style={{
              color: "hsl(var(--wine-muted))",
              fontFamily: "Fraunces, serif",
              fontSize: "18px",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            Each season reshapes the entire experience.
          </p>
        </div>

        <div className="flex flex-col md:flex-row" style={{ minHeight: isMobile ? "auto" : "420px" }}>
          {allSeasons.map((item) => {
            const meta = seasonMeta[item];
            const isActive = activeSeason === item;
            const isHovered = hoveredSeason === item && !isMobile;
            const overlayOpacity = isActive ? 0.45 : isHovered ? 0.58 : 0.72;
            const labelColor = isActive ? 1 : isHovered ? 0.85 : 0.4;
            const collapsedFlex = 0.16;
            const expandedFlex = 0.52;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setSeason(item)}
                onMouseEnter={() => !isMobile && setHoveredSeason(item)}
                onMouseLeave={() => !isMobile && setHoveredSeason(null)}
                className="relative flex w-full flex-col items-start justify-end overflow-hidden border-0 text-left"
                style={{
                  flex: isMobile ? "unset" : isActive ? expandedFlex : collapsedFlex,
                  width: isMobile ? "100%" : undefined,
                  height: isMobile ? (isActive ? "260px" : "64px") : "420px",
                  minHeight: isMobile ? undefined : "420px",
                  transition: isMobile
                    ? "height 520ms cubic-bezier(0.45, 0, 0.15, 1)"
                    : "flex 520ms cubic-bezier(0.45, 0, 0.15, 1)",
                }}
                aria-pressed={season === item}
              >
                <div className="absolute inset-0">
                  {meta.video ? (
                    <video
                      className="h-full w-full object-cover"
                      src={meta.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : meta.image ? (
                    <img src={meta.image} alt={`${seasonLabels[item]} at Tres`} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full" style={{ backgroundColor: "hsl(var(--wine-bg))" }} />
                  )}
                </div>

                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: `hsl(var(--wine-bg) / ${overlayOpacity})`,
                    transition: "background-color 240ms ease",
                  }}
                />

                <div className="relative z-10 flex w-full flex-col items-start px-4 py-4 sm:px-6 sm:py-5">
                  <p
                    style={{
                      color: "hsl(var(--wine-accent))",
                      fontFamily: "Abel, sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {meta.ordinal}
                  </p>
                  <p
                    style={{
                      color: `hsl(var(--wine-text) / ${labelColor})`,
                      fontFamily: "Fraunces, serif",
                      fontSize: isActive ? "clamp(36px, 5vw, 56px)" : "18px",
                      fontStyle: "italic",
                      fontWeight: 400,
                      lineHeight: 1,
                      marginTop: "8px",
                      transition: "font-size 520ms cubic-bezier(0.45, 0, 0.15, 1), color 240ms ease",
                    }}
                  >
                    {seasonLabels[item]}
                  </p>

                  <div
                    style={{
                      marginTop: isActive ? "12px" : "0px",
                      maxHeight: isActive ? "140px" : "0px",
                      opacity: isActive ? 1 : 0,
                      overflow: "hidden",
                      transition: "opacity 240ms ease, max-height 520ms cubic-bezier(0.45, 0, 0.15, 1), margin-top 520ms cubic-bezier(0.45, 0, 0.15, 1)",
                    }}
                  >
                    <p
                      style={{
                        color: "hsl(var(--wine-muted) / 0.75)",
                        fontFamily: "Abel, sans-serif",
                        fontSize: "13px",
                        fontStyle: "italic",
                      }}
                    >
                      {meta.teaser}
                    </p>
                    <span
                      className="mt-3 inline-block border px-3 py-1"
                      style={{
                        borderColor: "hsl(var(--wine-accent) / 0.45)",
                        color: "hsl(var(--wine-accent))",
                        fontFamily: "Abel, sans-serif",
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                      }}
                    >
                      ARCHIVE {meta.year}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p
          className="mx-auto mt-6 max-w-3xl text-center"
          style={{
            color: "hsl(var(--wine-muted) / 0.45)",
            fontFamily: "Fraunces, serif",
            fontSize: "16px",
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          What you see here is memory. What arrives at your table will be its own story.
        </p>

        <div className="pt-16">
          <p
            className="mb-10 text-center uppercase"
            style={{
              color: "hsl(var(--wine-accent))",
              fontFamily: "Abel, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.18em",
            }}
          >
            {seasonLabels[displayedSeason].toUpperCase()} · PAST MENU
          </p>

          <div
            style={{
              opacity: dishPhase === "in" ? 1 : 0,
              transition:
                dishPhase === "in"
                  ? "opacity 400ms cubic-bezier(0.45, 0, 0.15, 1)"
                  : "opacity 300ms cubic-bezier(0.45, 0, 0.15, 1)",
            }}
          >
            {dishRows.map((dish, index) => (
              <article
                key={dish.id}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
                className="relative grid grid-cols-1 gap-6 border-t py-10 md:grid-cols-[minmax(0,1fr)_280px] md:items-center md:gap-10"
                style={{ borderColor: "hsl(var(--wine-text) / 0.07)" }}
              >
                <span
                  ref={(node) => {
                    rowWatermarkRefs.current[index] = node;
                  }}
                  className="tres-season-watermark pointer-events-none absolute left-0 top-3 select-none"
                  style={{
                    color: "hsl(var(--wine-text) / 0.06)",
                    fontFamily: "Fraunces, serif",
                    fontSize: "clamp(64px, 10vw, 120px)",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {dish.number}
                </span>

                <div className="order-2 md:order-1">
                  <div
                    ref={(node) => {
                      rowContentRefs.current[index] = node;
                    }}
                    className="tres-season-row-reveal relative z-10 flex flex-col pt-28 md:pt-16"
                  >
                    <h3
                      style={{
                        color: "hsl(var(--wine-text))",
                        fontFamily: "Fraunces, serif",
                        fontSize: "clamp(22px, 3vw, 32px)",
                        fontStyle: "italic",
                        fontWeight: 400,
                        lineHeight: 1.1,
                      }}
                    >
                      {dish.name}
                    </h3>
                    <p
                      className="mt-3 max-w-2xl"
                      style={{
                        color: "hsl(var(--wine-muted))",
                        fontFamily: "Fraunces, serif",
                        fontSize: "16px",
                        fontStyle: "italic",
                        fontWeight: 300,
                      }}
                    >
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="order-1 md:order-2">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-[220px] w-full object-cover md:h-auto md:w-[280px]"
                    style={{ aspectRatio: isMobile ? undefined : "3 / 4" }}
                    loading="lazy"
                  />
                </div>
              </article>
            ))}

            <div className="border-t" style={{ borderColor: "hsl(var(--wine-text) / 0.07)" }} />
          </div>
        </div>

        <div
          ref={chapterRef}
          className="flex min-h-[360px] items-center justify-center"
          style={{
            backgroundColor: "hsl(var(--wine-bg))",
            minHeight: "50vh",
          }}
        >
          <div className="w-full py-20 md:px-[8%]">
            <div className="mx-auto w-full max-w-6xl text-center md:text-left">
              <p
                ref={chapterLabelRef}
                className="tres-philosophy-reveal uppercase"
                style={{
                  color: "hsl(var(--wine-accent))",
                  fontFamily: "Abel, sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                }}
              >
                OUR PHILOSOPHY
              </p>

              <div className="mt-6 space-y-1">
                {[
                  "This is",
                  "how we",
                  "think.",
                ].map((line, index) => (
                  <p
                    key={line}
                    ref={(node) => {
                      chapterLineRefs.current[index] = node;
                    }}
                    className="tres-philosophy-reveal"
                    style={{
                      color: "hsl(var(--wine-text))",
                      fontFamily: "Fraunces, serif",
                      fontSize: "clamp(48px, 8vw, 96px)",
                      fontStyle: "italic",
                      fontWeight: 400,
                      lineHeight: 0.95,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <p
                ref={chapterSubtitleRef}
                className="tres-philosophy-reveal mx-auto mt-8 max-w-2xl md:mx-0"
                style={{
                  color: "hsl(var(--wine-muted))",
                  fontFamily: "Fraunces, serif",
                  fontSize: "20px",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                Every dish begins in the land and ends at the table.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}