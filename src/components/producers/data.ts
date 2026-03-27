import detailFlowerWood from "@/assets/detail-flower-wood.jpg";
import detailFlowerLinen from "@/assets/detail-flower-linen.jpg";
import detailDishFoam from "@/assets/detail-dish-foam.jpg";
import detailPetitFours from "@/assets/detail-petit-fours.jpg";
import detailTomatoBowl from "@/assets/detail-tomato-bowl.jpg";
import detailVangoghFrame from "@/assets/detail-vangogh-frame.jpg";
import type { Producer } from "./types";

export const TRES_LOCATION = { lat: 51.9000, lng: 4.4950 };
export const RADIUS_KM = 30;

export const producers: Producer[] = [
  {
    name: "De Bloementuin",
    specialty: "Edible flowers & table floristry",
    distance: "12km",
    image: detailFlowerWood,
    region: "Ridderkerk",
    lat: 51.8700,
    lng: 4.5900,
    quote: "Each table receives a single stem arranged by hand — a living echo of what grows in the fields that week.",
  },
  {
    name: "Atelier Rosa",
    specialty: "Heritage rose varieties, Biesbosch",
    distance: "15km",
    image: detailFlowerLinen,
    region: "Biesbosch",
    lat: 51.8100,
    lng: 4.7200,
    quote: "Dried petals from Rosa's garden infuse our vinegars and garnish our desserts year-round.",
  },
  {
    name: "Joris van Dijk",
    specialty: "Line-caught fish, North Sea",
    distance: "28km",
    image: detailDishFoam,
    region: "North Sea",
    lat: 51.9700,
    lng: 4.2000,
    quote: "Joris fishes with hook and line — each catch is chosen, never trawled. The foam is made from the bones.",
  },
  {
    name: "Marieke Bos",
    specialty: "Wild herbs & ferments, Biesbosch",
    distance: "22km",
    image: detailPetitFours,
    region: "Hoeksche Waard",
    lat: 51.7500,
    lng: 4.3500,
    quote: "Marieke's lacto-fermented berries and bark extracts shape our petit fours each season.",
  },
  {
    name: "Pieter Hendriks",
    specialty: "Heritage vegetables, Westland",
    distance: "14km",
    image: detailTomatoBowl,
    region: "Westland",
    lat: 52.0200,
    lng: 4.2900,
    quote: "Pieter grows forgotten Dutch varieties — seeds saved across five generations, served raw at their peak.",
  },
  {
    name: "Anneke Visser",
    specialty: "Art & craft, Dutch tradition",
    distance: "8km",
    image: detailVangoghFrame,
    region: "Alblasserwaard",
    lat: 51.8600,
    lng: 4.6800,
    quote: "At Tres, even the presentation pays homage to Dutch mastery — the plate as canvas, the ingredient as paint.",
  },
];
