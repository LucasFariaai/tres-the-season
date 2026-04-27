import chefImg from "@/assets/photos-2026/concept-chef.jpg";
import foundersImg from "@/assets/photos-2026/concept-founders.jpg";
import zoom1 from "@/assets/photos-2026/zoom-1.jpg";
import zoom2 from "@/assets/photos-2026/zoom-2.jpg";
import zoom3 from "@/assets/photos-2026/zoom-3.jpg";
import zoom4 from "@/assets/photos-2026/zoom-4.jpg";
import zoom5 from "@/assets/photos-2026/zoom-5.jpg";
import zoom6 from "@/assets/photos-2026/zoom-6.jpg";
import zoom7 from "@/assets/photos-2026/zoom-7.jpg";
import { producers } from "@/components/producers/data";
import { tresGalleryItems } from "@/data/tresGalleryItems";
import { legacyDishImages, legacySeasonDescriptions } from "@/data/legacySeasonMenu";
import { seasonMenus } from "@/lib/seasonContext";
import { wines as defaultWineItems } from "@/data/tres-wine-data";
import type { HomeCmsContent, MenusContent, Season, SiteMediaItem, SiteThemeTokens } from "@/lib/site-editor/types";

const seasonOrder: Season[] = ["spring", "summer", "autumn", "winter"];

const defaultMenus: MenusContent = seasonOrder.reduce((accumulator, season) => {
  const sourceMenu = seasonMenus[season];
  const sourceDescriptions = legacySeasonDescriptions[season];
  accumulator[season] = {
    subtitle: sourceMenu.subtitle,
    items: sourceMenu.items.map((name, index) => ({
      name,
      description: sourceDescriptions[index] ?? "",
      image: legacyDishImages[index % legacyDishImages.length],
    })),
  };
  return accumulator;
}, {} as MenusContent);

export const defaultHomeCmsContent: HomeCmsContent = {
  hero: {
    tagline: "Complex without being complicated.",
    location: "Kop van Zuid-Entrepot · Rotterdam",
    reserveLabel: "Reserve",
    videoDesktop: "/videos/hero-desktop.mp4",
    videoMobile: "/videos/hero-mobile.mp4",
    reservationUrl: "https://www.exploretock.com/tresrotterdam",
  },
  bands: {
    heroToZoom:
      "linear-gradient(to bottom, hsl(24 24% 8%) 0%, hsl(24 24% 8%) 12%, hsl(48 13% 9%) 22%, hsl(33 25% 13%) 34%, hsl(24 29% 18%) 46%, hsl(26 21% 29%) 58%, hsl(38 13% 48%) 70%, hsl(36 20% 67%) 81%, hsl(38 25% 80%) 90%, hsl(36 33% 95%) 100%)",
    zoomToProducers:
      "linear-gradient(to bottom, #1A1410 0%, #1A1410 12%, #1B1A13 22%, #2A2218 34%, #3A2A20 46%, #5A4A3A 58%, #8A7D6A 70%, #B8AE9C 81%, #D8CFBE 90%, #F5EFE6 100%)",
  },
  zoom: {
    images: [
      { src: zoom1, alt: "An overhead spread of small plates at Tres" },
      { src: zoom2, alt: "Mise en place of small bowls and tools" },
      { src: zoom3, alt: "A caramelised block of dry-aged meat on a dark plate" },
      { src: zoom4, alt: "A risotto course with glazed fish at Tres" },
      { src: zoom5, alt: "A signature chicken-foot course finished with sauce" },
      { src: zoom6, alt: "A crisp flower presented on a stone pedestal" },
      { src: zoom7, alt: "A scallop served in its own shell" },
    ],
  },
  concept: {
    eyebrow: "Our Philosophy",
    title: "Complex without being complicated.",
    body:
      "Tres is built on a simple conviction: the finest ingredients, treated with restraint and respect, need very little else. Every dish begins in the land and ends at the table, nothing more, nothing less.",
    handsTitle: "The Hands",
    handsBody:
      "Every course is shaped by intuition, not formula. Our kitchen works with what the season brings — adapting, improvising, discovering flavour in restraint.",
    placeTitle: "The Place",
    placeBody:
      "Set inside a 19th-century cellar beneath the Walhalla, where the Maas meets the city. Stone walls, candlelight, and the quiet hum of a kitchen at work, this is where Tres lives.",
    quote: '"We don\'t chase trends. We chase seasons."',
    chefImage: chefImg,
    chefAlt: "Chef preparing dishes in the candlelit kitchen",
    foundersImage: foundersImg,
    foundersAlt: "The founders in the historic cellar of Tres",
  },
  gallery: {
    eyebrow: "The World of Tres",
    subtitle: "Scroll to explore",
    items: tresGalleryItems,
  },
  producers: {
    eyebrow: "Our Producers",
    title: "The Circle",
    body: "Every name here has shaped what you'll taste tonight.",
    helper: "Explore our network of local producers",
    closingQuote: "Complex without being complicated.",
    items: producers,
  },
  reserve: {
    eyebrow: "The Rhythm",
    title: "Visit Tres",
    hoursTitle: "Hours",
    hoursLines: ["Wednesday – Saturday", "18:00 – 23:00"],
    locationTitle: "Location",
    locationLines: ["Walhalla, Veerhaven 1", "3011 BK Rotterdam", "The Netherlands"],
    travelTitle: "Getting here",
    travelLines: ["Take the watertaxi from Rotterdam harbour.", "A seven-minute crossing across the Maas."],
    contactTitle: "Contact us",
    contactPhone: "+31 6 18 02 73 16",
    alcoholicPairingPrice: "€110",
    nonAlcoholicPairingPrice: "€100",
    price: "€185",
    reserveButton: "Reserve",
    note: "Reservations recommended 2–3 weeks ahead",
  },
  footer: {
    quote: '"Complex without being complicated."',
    instagramUrl: "https://www.instagram.com/tresrotterdam/",
    facebookUrl: "#",
    logoAlt: "Tres",
  },
  greenStar: {
    eyebrow: "",
    title: "The Green Star.",
    award: "Michelin Guide Netherlands, 2025",
    body:
      "In 2025, Tres was awarded the Green Michelin Star, a distinction that recognises restaurants committed to a more sustainable vision of gastronomy. For us, this was not a new direction. It was a recognition of how we have always worked.",
    body2:
      'The inspectors described us as "raw and pure, vintage and warm." We take that as the highest compliment.',
    pillars: [
      {
        id: "local",
        number: "30km",
        label: "radius",
        title: "Radically local",
        body: "Every ingredient is sourced within 30 kilometres of Rotterdam. The fields, the coast, the forests nearby are our entire pantry.",
      },
      {
        id: "waste",
        number: "0",
        label: "waste",
        title: "Root to leaf, nose to tail",
        body: "Nothing is discarded. What others see as scraps, our fermentation lab transforms into garums, misos and vinegars aged for months.",
      },
      {
        id: "salt",
        number: "0g",
        label: "salt",
        title: "No salt. Ever.",
        body: "Flavour comes from fermentation, pickling, dehydration and koji. Seaweed crystals and misos aged nine months replace what salt once did.",
      },
    ],
    ctaLabel: "Meet the people behind this",
  },
  livingMenuTransition: {
    eyebrow: "What follows",
    title: "The Living Menu",
    subtitle: "Eighteen movements, each a trace of a season already behind us.",
  },
  circleTransition: {
    eyebrow: "Our producers",
    title: "The Circle",
    subtitle: "Every name here has a shape — the shape of what you will taste.",
  },
  menus: defaultMenus,
  wines: { items: defaultWineItems },
};

export const defaultSiteTheme: SiteThemeTokens = {
  heroOverlay: "radial-gradient(ellipse at center, rgba(26,20,16,0.15) 0%, rgba(26,20,16,0.55) 60%, rgba(26,20,16,0.85) 100%)",
  conceptBackground: "hsl(24 24% 8%)",
  zoomBackground: "#F5EFE6",
  producersBackground: "#F5EFE6",
  reserveBackground: "#F5EFE6",
  footerBackground: "hsl(var(--season-darkest))",
  bandHeroToZoom:
    "linear-gradient(to bottom, hsl(24 24% 8%) 0%, hsl(24 24% 8%) 12%, hsl(48 13% 9%) 22%, hsl(33 25% 13%) 34%, hsl(24 29% 18%) 46%, hsl(26 21% 29%) 58%, hsl(38 13% 48%) 70%, hsl(36 20% 67%) 81%, hsl(38 25% 80%) 90%, hsl(36 33% 95%) 100%)",
  bandZoomToProducers:
    "linear-gradient(to bottom, #1A1410 0%, #1A1410 12%, #1B1A13 22%, #2A2218 34%, #3A2A20 46%, #5A4A3A 58%, #8A7D6A 70%, #B8AE9C 81%, #D8CFBE 90%, #F5EFE6 100%)",
};

export const defaultMediaLibrary: SiteMediaItem[] = [
  ...defaultHomeCmsContent.zoom.images.map((image, index) => ({
    file_path: image.src,
    title: `Zoom image ${index + 1}`,
    alt_text: image.alt,
    tags: ["zoom"],
    metadata: {},
  })),
  {
    file_path: defaultHomeCmsContent.concept.chefImage,
    title: "Chef",
    alt_text: defaultHomeCmsContent.concept.chefAlt,
    tags: ["concept"],
    metadata: {},
  },
  {
    file_path: defaultHomeCmsContent.concept.foundersImage,
    title: "Founders",
    alt_text: defaultHomeCmsContent.concept.foundersAlt,
    tags: ["concept"],
    metadata: {},
  },
  ...defaultHomeCmsContent.gallery.items.map((item) => ({
    file_path: item.mediaSrc,
    title: item.label ?? item.id,
    alt_text: item.alt,
    tags: ["gallery"],
    metadata: {},
  })),
  ...defaultHomeCmsContent.producers.items.map((item) => ({
    file_path: item.image,
    title: item.name,
    alt_text: item.name,
    tags: ["producers"],
    metadata: {},
  })),
  ...seasonOrder.flatMap((season) =>
    defaultHomeCmsContent.menus[season].items.map((dish, index) => ({
      file_path: dish.image,
      title: `${season} dish ${index + 1}: ${dish.name}`,
      alt_text: dish.name,
      tags: ["menus", season],
      metadata: {},
    })),
  ),
];
