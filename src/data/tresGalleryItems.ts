import galleryRoom from "@/assets/photos-2026/gallery-room.jpg";
import galleryKitchenHands from "@/assets/photos-2026/gallery-kitchen-hands.jpg";
import galleryLarder from "@/assets/photos-2026/gallery-larder.jpg";
import galleryProduct from "@/assets/photos-2026/gallery-product.jpg";
import galleryFlowerPlate from "@/assets/photos-2026/gallery-flower-plate.jpg";
import galleryFlowerDetail from "@/assets/photos-2026/gallery-flower-detail.jpg";
import galleryMeat from "@/assets/photos-2026/gallery-meat.jpg";
import gallerySouffle from "@/assets/photos-2026/gallery-souffle.jpg";
import galleryDessert from "@/assets/photos-2026/gallery-dessert.jpg";
import galleryAtmospheric from "@/assets/photos-2026/gallery-atmospheric.jpg";
import galleryGlazed from "@/assets/photos-2026/gallery-glazed.jpg";
import gallerySpread from "@/assets/photos-2026/gallery-spread.jpg";

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
    mediaSrc: galleryRoom,
    alt: "A quiet corner of the dining room at Tres",
    width: "medium",
    label: "The room",
    caption: "A table set for the long rhythm of the evening.",
  },
  {
    id: "kitchen-hands",
    type: "image",
    mediaSrc: galleryKitchenHands,
    alt: "Chef's hands preparing a course in the kitchen",
    width: "narrow",
  },
  {
    id: "dry-age",
    type: "image",
    mediaSrc: galleryLarder,
    alt: "Cured meats hanging in the larder",
    width: "wide",
    label: "The larder",
    caption: "Time is part of the ingredient.",
  },
  {
    id: "founders",
    type: "image",
    mediaSrc: galleryProduct,
    alt: "A whole lobster prepared for service",
    width: "medium",
  },
  {
    id: "cotton-dish",
    type: "image",
    mediaSrc: galleryFlowerPlate,
    alt: "A single edible flower on a black pedestal",
    width: "wide",
    label: "The plate",
    caption: "Softness, smoke and structure in a single gesture.",
  },
  {
    id: "flower-detail",
    type: "image",
    mediaSrc: galleryFlowerDetail,
    alt: "A delicate crisp basket on weathered wood",
    width: "narrow",
  },
  {
    id: "meat-course",
    type: "image",
    mediaSrc: galleryMeat,
    alt: "A meat course finished tableside with sourdough",
    width: "medium",
  },
  {
    id: "souffle-course",
    type: "image",
    mediaSrc: gallerySouffle,
    alt: "A pristine white dessert in a shell-shaped bowl",
    width: "narrow",
    label: "The kitchen",
    caption: "Precision without spectacle.",
  },
  {
    id: "dessert-course",
    type: "image",
    mediaSrc: galleryDessert,
    alt: "A smoked dessert pillar resting on stone",
    width: "wide",
  },
  {
    id: "linen-flowers",
    type: "image",
    mediaSrc: galleryAtmospheric,
    alt: "An atmospheric still life of pine and ember",
    width: "medium",
    label: "The details",
    caption: "Every surface carries the same quiet intensity.",
  },
  {
    id: "glazed-bite",
    type: "image",
    mediaSrc: galleryGlazed,
    alt: "A glazed fish bite served in a porcelain bowl",
    width: "narrow",
  },
  {
    id: "room-spread",
    type: "image",
    mediaSrc: gallerySpread,
    alt: "An overhead view of a broth course at Tres",
    width: "wide",
    label: "The world of Tres",
    caption: "Light, texture and season held in one continuous frame.",
  },
];
