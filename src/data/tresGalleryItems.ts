import chefImg from "@/assets/chef-kitchen.jpg";
import foundersImg from "@/assets/founders-cellar.jpg";
import foodTableSpread from "@/assets/food-table-spread.jpg";
import foodTableSpreadTwo from "@/assets/food-table-spread-2.jpg";
import foodDryage from "@/assets/food-dryage.jpg";
import foodCotton from "@/assets/food-cotton.jpg";
import foodMeatPlate from "@/assets/food-meat-plate.jpg";
import foodSouffle from "@/assets/food-souffle.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodGlazed from "@/assets/food-glazed.jpg";
import detailFlowerWood from "@/assets/detail-flower-wood.jpg";
import detailFlowerLinen from "@/assets/detail-flower-linen.jpg";

export type TresGalleryMediaType = "image" | "video";
export type TresGalleryWidth = "narrow" | "medium" | "wide";

export interface TresGalleryItem {
  id: string;
  type: TresGalleryMediaType;
  mediaSrc: string;
  alt: string;
  width: TresGalleryWidth;
  label?: string;
  caption?: string;
}

export const tresGalleryItems: TresGalleryItem[] = [
  {
    id: "cellar-table",
    type: "image",
    mediaSrc: foodTableSpread,
    alt: "A candlelit tasting table inside Tres",
    width: "medium",
    label: "The room",
    caption: "A table set for the long rhythm of the evening.",
  },
  {
    id: "kitchen-hands",
    type: "image",
    mediaSrc: chefImg,
    alt: "Chef preparing a dish in the kitchen",
    width: "narrow",
  },
  {
    id: "dry-age",
    type: "image",
    mediaSrc: foodDryage,
    alt: "Dry ageing cabinet with heritage meats",
    width: "wide",
    label: "The larder",
    caption: "Time is part of the ingredient.",
  },
  {
    id: "founders",
    type: "image",
    mediaSrc: foundersImg,
    alt: "The founders inside the cellar",
    width: "medium",
  },
  {
    id: "cotton-dish",
    type: "image",
    mediaSrc: foodCotton,
    alt: "A plated course with cotton flower garnish",
    width: "wide",
    label: "The plate",
    caption: "Softness, smoke and structure in a single gesture.",
  },
  {
    id: "flower-detail",
    type: "image",
    mediaSrc: detailFlowerWood,
    alt: "Edible flowers arranged on a wooden surface",
    width: "narrow",
  },
  {
    id: "meat-course",
    type: "image",
    mediaSrc: foodMeatPlate,
    alt: "Dry aged meat course served with bread",
    width: "medium",
  },
  {
    id: "souffle-course",
    type: "image",
    mediaSrc: foodSouffle,
    alt: "A golden herb crusted soufflé",
    width: "narrow",
    label: "The kitchen",
    caption: "Precision without spectacle.",
  },
  {
    id: "dessert-course",
    type: "image",
    mediaSrc: foodDessert,
    alt: "Dessert plated on a pink linen tablecloth",
    width: "wide",
  },
  {
    id: "linen-flowers",
    type: "image",
    mediaSrc: detailFlowerLinen,
    alt: "Floral detail styled on linen",
    width: "medium",
    label: "The details",
    caption: "Every surface carries the same quiet intensity.",
  },
  {
    id: "glazed-bite",
    type: "image",
    mediaSrc: foodGlazed,
    alt: "A glazed bite on a charred serving board",
    width: "narrow",
  },
  {
    id: "room-spread",
    type: "image",
    mediaSrc: foodTableSpreadTwo,
    alt: "Another view of the tasting spread at Tres",
    width: "wide",
    label: "The world of Tres",
    caption: "Light, texture and season held in one continuous frame.",
  },
];