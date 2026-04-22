import type { Season } from "@/lib/seasonContext";

import dish01 from "@/assets/dishes/dish-01.jpg";
import dish02 from "@/assets/dishes/dish-02.jpg";
import dish03 from "@/assets/dishes/dish-03.jpg";
import dish04 from "@/assets/dishes/dish-04.jpg";
import dish05 from "@/assets/dishes/dish-05.jpg";
import dish06 from "@/assets/dishes/dish-06.jpg";
import dish07 from "@/assets/dishes/dish-07.jpg";
import dish08 from "@/assets/dishes/dish-08.jpg";

export const legacyDishImages = [dish01, dish02, dish03, dish04, dish05, dish06, dish07, dish08];

export const legacySeasonDescriptions: Record<Season, string[]> = {
  spring: [
    "Spring pastures, first foraging",
    "The earth still cool, the stem still pale",
    "Hedgerow blossoms, morning milk",
    "Forest floor after rain",
    "The garden at its gentlest",
    "First warmth, first sweetness",
    "Wildflowers pressed into curd",
    "A whisper of citrus and herb",
  ],
  summer: [
    "Sun-warmed, hand-torn, still breathing",
    "Orchard heat trapped in juice",
    "Tide pools at golden hour",
    "Pollen dust on yellow petals",
    "The garden in full chorus",
    "Stone fruit, sun-split, fragrant",
    "Aged slowly, served simply",
    "The long day's last sweetness",
  ],
  autumn: [
    "Dark woods, cold morning, smoke",
    "Earth and age, nothing wasted",
    "Field to fire, butter to brown",
    "Preserved before the frost",
    "Raw edge, soft centre",
    "Roots, bark, deep forest",
    "Rind and rot, noble and true",
    "Bitterness tempered by heat",
  ],
  winter: [
    "Cold sea, patient hands",
    "Underground, unhurried",
    "Brightness against the grey",
    "River to smoke to silk",
    "What the earth gives slowly",
    "Ice crystals on crimson",
    "Time compressed into flavour",
    "Dark, salt, stillness",
  ],
};

export const legacySeasonSubheadings: Record<Season, string> = {
  spring: "A celebration of first growth",
  summer: "Abundance at the golden hour",
  autumn: "The harvest, the hearth, the fire",
  winter: "Stillness, depth, preservation",
};