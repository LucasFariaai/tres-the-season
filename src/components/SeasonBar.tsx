import { useState } from "react";
import { useSeason, seasonLabels, seasonIcons, type Season } from "@/lib/seasonContext";

const allSeasons: Season[] = ["winter", "spring", "summer", "autumn"];

export default function SeasonBar() {
  const { season, setSeason, isNatural, naturalSeason } = useSeason();
  const [pickerOpen, setPickerOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 season-transition bg-season-nav-bg text-season-nav-fg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-xl tracking-widest uppercase"
        >
          Tres
        </button>

        {/* Centre: Season toggle */}
        <div className="relative">
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className="flex items-center gap-2 font-accent text-sm tracking-wide opacity-90 hover:opacity-100 transition-opacity"
          >
            <span>{seasonIcons[season]}</span>
            <span>{seasonLabels[season]}</span>
            {!isNatural && (
              <span className="text-[10px] uppercase tracking-widest opacity-60 ml-1">
                (preview)
              </span>
            )}
          </button>

          {pickerOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-season-dark rounded-md shadow-xl overflow-hidden min-w-[160px]">
              {allSeasons.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSeason(s);
                    setPickerOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-body flex items-center gap-2 transition-colors
                    ${s === season ? "bg-season-mid text-season-lightest" : "text-season-lighter hover:bg-season-mid/30"}`}
                >
                  <span>{seasonIcons[s]}</span>
                  <span>{seasonLabels[s]}</span>
                  {s === naturalSeason && (
                    <span className="text-[9px] ml-auto opacity-50 uppercase">now</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-body tracking-wide">
          {[
            { label: "Menu", id: "menu" },
            { label: "Producers", id: "producers" },
            { label: "Process", id: "process" },
            { label: "Reserve", id: "reserve" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="opacity-80 hover:opacity-100 transition-opacity relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-season-light after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
