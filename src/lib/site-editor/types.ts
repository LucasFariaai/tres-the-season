import type { Producer } from "@/components/producers/types";
import type { TresGalleryItem, TresGalleryWidth } from "@/data/tresGalleryItems";

export type HomeSectionId =
  | "hero"
  | "bands"
  | "zoom"
  | "concept"
  | "gallery"
  | "producers"
  | "reserve"
  | "footer"
  | "greenStar"
  | "livingMenuTransition"
  | "circleTransition";

export interface SiteMediaItem {
  id?: string;
  file_path: string;
  title: string | null;
  alt_text: string | null;
  tags: string[];
  metadata?: Record<string, unknown>;
}

export interface HeroContent {
  tagline: string;
  location: string;
  reserveLabel: string;
}

export interface BandContent {
  heroToZoom: string;
  zoomToProducers: string;
}

export interface ZoomImage {
  src: string;
  alt: string;
}

export interface ZoomContent {
  images: ZoomImage[];
}

export interface ConceptContent {
  eyebrow: string;
  title: string;
  body: string;
  handsTitle: string;
  handsBody: string;
  placeTitle: string;
  placeBody: string;
  quote: string;
  chefImage: string;
  chefAlt: string;
  foundersImage: string;
  foundersAlt: string;
}

export interface GalleryContent {
  eyebrow: string;
  subtitle: string;
  items: TresGalleryItem[];
}

export interface ProducersContent {
  eyebrow: string;
  title: string;
  body: string;
  helper: string;
  closingQuote: string;
  items: Producer[];
}

export interface ReserveContent {
  eyebrow: string;
  title: string;
  hoursTitle: string;
  hoursLines: string[];
  locationTitle: string;
  locationLines: string[];
  travelTitle: string;
  travelLines: string[];
  price: string;
  reserveButton: string;
  note: string;
}

export interface FooterContent {
  quote: string;
  instagramUrl: string;
  facebookUrl: string;
  logoAlt: string;
}

export interface GreenStarPillar {
  id: string;
  number: string;
  label: string;
  title: string;
  body: string;
}

export interface GreenStarContent {
  eyebrow: string;
  title: string;
  award: string;
  body: string;
  body2: string;
  pillars: GreenStarPillar[];
  ctaLabel: string;
}

export interface TransitionContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface HomeCmsContent {
  hero: HeroContent;
  bands: BandContent;
  zoom: ZoomContent;
  concept: ConceptContent;
  gallery: GalleryContent;
  producers: ProducersContent;
  reserve: ReserveContent;
  footer: FooterContent;
  greenStar: GreenStarContent;
  livingMenuTransition: TransitionContent;
  circleTransition: TransitionContent;
}

export interface SiteThemeTokens {
  heroOverlay: string;
  conceptBackground: string;
  zoomBackground: string;
  producersBackground: string;
  reserveBackground: string;
  footerBackground: string;
  bandHeroToZoom: string;
  bandZoomToProducers: string;
}

export interface EditorSnapshotPayload {
  content: HomeCmsContent;
  theme: SiteThemeTokens;
  media: SiteMediaItem[];
}

export interface EditorHistoryEntry {
  id: string;
  name: string | null;
  kind: string;
  created_at: string;
  restored_from: string | null;
}

export interface EditorChangeLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
  details: Record<string, unknown>;
}

export interface GalleryItemInput {
  id: string;
  width: TresGalleryWidth;
  label?: string;
  caption?: string;
  alt: string;
  mediaSrc: string;
}
