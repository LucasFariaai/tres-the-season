import { seasonLabels, seasonPageContent, type Season, useSeason } from "@/lib/seasonContext";

const orderedSeasons: Season[] = ["spring", "summer", "autumn", "winter"];

export default function SeasonToggle() {
  const { season, setSeason } = useSeason();

  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:right-6">
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        {orderedSeasons.map((item) => {
          const isActive = item === season;
          const content = seasonPageContent[item];

          return (
            <button
              key={item}
              type="button"
              onClick={() => setSeason(item)}
              aria-label={`Switch to ${seasonLabels[item]}`}
              aria-pressed={isActive}
              className="group flex items-center gap-3"
              style={{ fontFamily: "Abel, sans-serif" }}
            >
              <span
                className="text-[11px] uppercase tracking-[0.18em] text-white/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                {seasonLabels[item]}
              </span>
              <span
                className="block h-3 w-3 rounded-full border"
                style={{
                  borderColor: isActive ? content.accent : "hsl(var(--wine-text) / 0.35)",
                  backgroundColor: isActive ? content.accent : "transparent",
                  boxShadow: "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}