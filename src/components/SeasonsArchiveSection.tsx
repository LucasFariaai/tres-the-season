import { useMemo, useState } from "react";
import { seasonLabels, type Season, useSeason } from "@/lib/seasonContext";
import { useIsMobile } from "@/hooks/use-mobile";

import foodCotton from "@/assets/food-cotton.jpg";
import foodTableSpread from "@/assets/food-table-spread.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDryage from "@/assets/food-dryage.jpg";

const allSeasons: Season[] = ["spring", "summer", "autumn", "winter"];

const seasonMeta: Record<Season, { ordinal: string; teaser: string; year: string; image: string; video?: string | null }> = {
  spring: {
    ordinal: "01",
    teaser: "First growth, wild garlic, elderflower",
    year: "2025",
    image: foodCotton,
    video: null,
  },
  summer: {
    ordinal: "02",
    teaser: "Stone fruit, langoustine, edible flowers",
    year: "2025",
    image: foodTableSpread,
    video: null,
  },
  autumn: {
    ordinal: "03",
    teaser: "Wild game, porcini, fermented berries",
    year: "2025",
    image: foodDessert,
    video: null,
  },
  winter: {
    ordinal: "04",
    teaser: "Smoked eel, black truffle, bone marrow",
    year: "2025",
    image: foodDryage,
    video: null,
  },
};

export default function SeasonsArchiveSection() {
  const { season, setSeason } = useSeason();
  const isMobile = useIsMobile();
  const [hoveredSeason, setHoveredSeason] = useState<Season | null>(null);

  const activeSeason = useMemo(() => hoveredSeason && !isMobile ? hoveredSeason : season, [hoveredSeason, isMobile, season]);

  return (
    <section
      className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      style={{ backgroundColor: "#F5EFE6" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col">
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
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {meta.ordinal}
                  </p>
                  <p
                    style={{
                      color: `hsl(var(--wine-text) / ${labelColor})`,
                      fontFamily: "'Playfair Display', serif",
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
                        fontFamily: "'Source Sans 3', sans-serif",
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
                        fontFamily: "'Source Sans 3', sans-serif",
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

      </div>
    </section>
  );
}