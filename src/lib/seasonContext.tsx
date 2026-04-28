import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

import dish01 from "@/assets/dishes/dish-01.jpg";
import dish02 from "@/assets/dishes/dish-02.jpg";
import dish03 from "@/assets/dishes/dish-03.jpg";
import dish04 from "@/assets/dishes/dish-04.jpg";
import dish05 from "@/assets/dishes/dish-05.jpg";
import dish06 from "@/assets/dishes/dish-06.jpg";
import dish07 from "@/assets/dishes/dish-07.jpg";
import dish08 from "@/assets/dishes/dish-08.jpg";
import foodCotton from "@/assets/food-cotton.jpg";
import foodTableSpread from "@/assets/food-table-spread.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDryage from "@/assets/food-dryage.jpg";
import foodMeatPlate from "@/assets/food-meat-plate.jpg";
import foodSouffle from "@/assets/food-souffle.jpg";
import foodGlazed from "@/assets/food-glazed.jpg";

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

export interface SeasonProcessItem {
  title: string;
  caption: string;
  image: string;
}

export interface SeasonPageContent {
  accent: string;
  accentSoft: string;
  ink: string;
  muted: string;
  paper: string;
  line: string;
  tagline: string;
  strapline: string;
  poem: string[];
  ingredients: string[];
  featuredDish: {
    title: string;
    description: string;
    image: string;
  };
  galleryImages: string[];
  process: SeasonProcessItem[];
  rhythm: {
    note: string;
    hours: string[];
    address: string[];
    travel: string;
  };
}

export const seasonPageContent: Record<Season, SeasonPageContent> = {
  winter: {
    accent: "hsl(29 22% 62%)",
    accentSoft: "hsl(35 16% 34%)",
    ink: "hsl(36 43% 93%)",
    muted: "hsl(38 18% 66%)",
    paper: "hsl(36 33% 95%)",
    line: "hsl(36 43% 93% / 0.12)",
    tagline: "Preserved, patient, close to the flame.",
    strapline: "Winter gathers depth from smoke, salt and time.",
    poem: [
      "Cold sea and cellar stone.",
      "Roots pulled from dark soil.",
      "A little smoke held in butter.",
      "Everything slower, everything clearer.",
    ],
    ingredients: ["Dry-aged turbot", "celery root", "black truffle", "preserved citrus", "smoked eel", "bay leaf"],
    featuredDish: {
      title: "Dry-aged turbot with black truffle",
      description: "A winter plate built around restraint, marine sweetness and the depth that only patience allows.",
      image: dish04,
    },
    galleryImages: [foodDryage, dish04, dish01],
    process: [
      { title: "Dry-aging", caption: "Fish and meat are held back until texture turns silkier and flavour turns inward.", image: foodDryage },
      { title: "Preserving", caption: "Citrus, roots and leaves are put away early so the cold months never feel empty.", image: dish02 },
      { title: "Smoking", caption: "A measured touch of smoke gives warmth without heaviness.", image: foodGlazed },
    ],
    rhythm: {
      note: "Winter service is intimate and unhurried, built for long tables and longer conversations.",
      hours: ["Wednesday – Saturday", "18:00 – 23:00"],
      address: ["Walhalla, Veerlaan 11", "3072 AN Rotterdam", "The Netherlands"],
      travel: "Reach us from the Maas side and let the cellar warmth take over from the harbour air.",
    },
  },
  spring: {
    accent: "hsl(120 22% 53%)",
    accentSoft: "hsl(132 18% 26%)",
    ink: "hsl(36 43% 93%)",
    muted: "hsl(108 15% 72%)",
    paper: "hsl(36 33% 95%)",
    line: "hsl(36 43% 93% / 0.12)",
    tagline: "First growth, first brightness.",
    strapline: "Spring at Tres is green, wet, floral and alive with small shifts.",
    poem: [
      "Wild garlic before noon.",
      "Milk still carrying the field.",
      "Rain in the hedgerow.",
      "The season beginning in whispers.",
    ],
    ingredients: ["Young lamb", "wild garlic", "white asparagus", "elderflower", "morel", "green pea"],
    featuredDish: {
      title: "Young lamb with wild garlic",
      description: "Tender spring lamb balanced with fresh alliums and a sauce that tastes more of the field than the kitchen.",
      image: dish01,
    },
    galleryImages: [foodCotton, dish01, dish03],
    process: [
      { title: "Foraging", caption: "The first days begin in damp woodland, collecting herbs when they are still bright with water.", image: foodCotton },
      { title: "Infusing", caption: "Flowers and stems are steeped slowly, building aroma without noise.", image: dish03 },
      { title: "Sprouting", caption: "New growth is used young, before sweetness turns obvious.", image: foodSouffle },
    ],
    rhythm: {
      note: "Spring service feels lighter on the table, with sharper aromas and a little more daylight at the start of dinner.",
      hours: ["Wednesday – Saturday", "18:00 – 23:00"],
      address: ["Walhalla, Veerlaan 11", "3072 AN Rotterdam", "The Netherlands"],
      travel: "Come early and walk the quay before descending into the cellar.",
    },
  },
  summer: {
    accent: "hsl(34 30% 50%)",
    accentSoft: "hsl(30 32% 24%)",
    ink: "hsl(36 43% 93%)",
    muted: "hsl(40 30% 70%)",
    paper: "hsl(36 33% 95%)",
    line: "hsl(36 43% 93% / 0.12)",
    tagline: "Long light, generous produce.",
    strapline: "Summer turns the menu outward, brighter, looser and full of orchard warmth.",
    poem: [
      "Fruit split by the sun.",
      "Herbs cut at the last minute.",
      "Shellfish kept clean and cold.",
      "The room holding the day a little longer.",
    ],
    ingredients: ["Heirloom tomato", "stone fruit", "langoustine", "courgette flower", "fresh peas", "fig"],
    featuredDish: {
      title: "Langoustine with summer herbs",
      description: "Sweet shellfish, herb oils and bright vegetal notes, plated with the ease that only warm months allow.",
      image: dish03,
    },
    galleryImages: [foodTableSpread, dish03, dish06],
    process: [
      { title: "Grilling", caption: "Stone fruit and vegetables meet grapevine embers for quick char and perfume.", image: foodTableSpread },
      { title: "Curing", caption: "Seafood is seasoned lightly so salinity stays precise and clean.", image: dish06 },
      { title: "Churning", caption: "Cultured dairy brings coolness and lift to the warmest services.", image: foodDessert },
    ],
    rhythm: {
      note: "Summer service begins with more glow above ground and ends with the cellar at its most vivid.",
      hours: ["Wednesday – Saturday", "18:00 – 23:30"],
      address: ["Walhalla, Veerlaan 11", "3072 AN Rotterdam", "The Netherlands"],
      travel: "Arrive by foot or water and let the contrast between harbour light and candlelight do the rest.",
    },
  },
  autumn: {
    accent: "hsl(22 38% 32%)",
    accentSoft: "hsl(20 28% 18%)",
    ink: "hsl(36 43% 93%)",
    muted: "hsl(30 28% 68%)",
    paper: "hsl(36 33% 95%)",
    line: "hsl(36 43% 93% / 0.12)",
    tagline: "Forest, field and embers.",
    strapline: "Autumn sharpens the menu with smoke, fermentation and the pull of the woods.",
    poem: [
      "Juniper in the air.",
      "Mushrooms brushed, not washed.",
      "Butter going just beyond nutty.",
      "Darkness arriving before dessert.",
    ],
    ingredients: ["Wild game", "porcini", "pumpkin", "quince", "venison", "chestnut"],
    featuredDish: {
      title: "Wild game with juniper",
      description: "Autumn’s defining plate, rich but exact, with smoke, berry acidity and the grain of the forest still intact.",
      image: dish05,
    },
    galleryImages: [foodMeatPlate, dish05, dish07],
    process: [
      { title: "Foraging", caption: "Mushrooms, leaves and berries arrive with the damp edge of the season still on them.", image: foodMeatPlate },
      { title: "Braising", caption: "Long cooking gives structure and calm to stronger cuts.", image: dish05 },
      { title: "Fermenting", caption: "Acidity is developed ahead of time so rich dishes stay lucid.", image: dish07 },
    ],
    rhythm: {
      note: "Autumn service is darker, deeper and especially tuned to wine, smoke and long finishes.",
      hours: ["Wednesday – Saturday", "18:00 – 23:00"],
      address: ["Walhalla, Veerlaan 11", "3072 AN Rotterdam", "The Netherlands"],
      travel: "The best approach is slow, through the quay, with enough time for a first glass downstairs.",
    },
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
