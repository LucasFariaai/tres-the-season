import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Season = "winter" | "spring" | "summer" | "autumn";

interface SeasonContextValue {
  season: Season;
  setSeason: (s: Season) => void;
  isNatural: boolean;
  naturalSeason: Season;
}

const SeasonContext = createContext<SeasonContextValue | null>(null);

export function getSeasonFromDate(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0-indexed
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export const seasonLabels: Record<Season, string> = {
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
};

export const seasonIcons: Record<Season, string> = {
  winter: "❄",
  spring: "🌱",
  summer: "☀",
  autumn: "🍂",
};

export const seasonQuotes: Record<Season, string> = {
  winter: "Stillness beneath the frost.",
  spring: "Everything begins again.",
  summer: "Abundance in golden light.",
  autumn: "Complex without being complicated.",
};

export const seasonMenus: Record<Season, { items: string[]; subtitle: string }> = {
  winter: {
    subtitle: "The sea, preserved and still",
    items: [
      "Dry-aged turbot",
      "Celery root, black truffle",
      "Preserved citrus, fennel pollen",
      "Smoked eel, buttermilk",
      "Root vegetables, bone marrow",
      "Beetroot, horseradish snow",
      "Aged Gouda, winter honey",
      "Dark chocolate, sea salt, bay leaf",
    ],
  },
  spring: {
    subtitle: "First light, first growth",
    items: [
      "Young lamb, wild garlic",
      "White asparagus, hollandaise foam",
      "Elderflower, goat's milk",
      "Morel mushrooms, spring onion",
      "Green pea, mint, ricotta",
      "Rhubarb, strawberry, verbena",
      "Fresh cheese, wildflower honey",
      "Lemon thyme panna cotta",
    ],
  },
  summer: {
    subtitle: "Long days, full plates",
    items: [
      "Heirloom tomato, burrata",
      "Stone fruit, basil, olive oil",
      "Langoustine, summer herbs",
      "Courgette flower, saffron",
      "Fresh peas, edible flowers",
      "Peach, lavender, almond",
      "Aged comté, fig preserves",
      "Apricot tart, thyme ice cream",
    ],
  },
  autumn: {
    subtitle: "The forest, the field, the fire",
    items: [
      "Wild game, juniper",
      "Porcini mushroom, aged parmesan",
      "Pumpkin, brown butter, sage",
      "Quince, fermented berries",
      "Venison tartare, smoked egg",
      "Chestnut, truffle, celery",
      "Blue cheese, walnut, pear",
      "Dark caramel, espresso, hazelnut",
    ],
  },
};

export function SeasonProvider({ children }: { children: React.ReactNode }) {
  const natural = getSeasonFromDate();
  const [season, setSeasonState] = useState<Season>(natural);
  const [isNatural, setIsNatural] = useState(true);

  const setSeason = useCallback(
    (s: Season) => {
      setSeasonState(s);
      setIsNatural(s === natural);
    },
    [natural]
  );

  useEffect(() => {
    document.documentElement.className = document.documentElement.className
      .replace(/season-\w+/g, "")
      .trim();
    document.documentElement.classList.add(`season-${season}`);
  }, [season]);

  return (
    <SeasonContext.Provider value={{ season, setSeason, isNatural, naturalSeason: natural }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error("useSeason must be used within SeasonProvider");
  return ctx;
}
