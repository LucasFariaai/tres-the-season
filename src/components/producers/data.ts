import producer01 from "@/assets/producers/producer-01.jpg";
import producer02 from "@/assets/producers/producer-02.jpg";
import producer03 from "@/assets/producers/producer-03.jpg";
import producer04 from "@/assets/producers/producer-04.jpg";
import producer05 from "@/assets/producers/producer-05.jpg";
import producer06 from "@/assets/producers/producer-06.jpg";
import type { Producer } from "./types";

export const TRES_LOCATION = { lat: 51.9000, lng: 4.4950 };
export const RADIUS_KM = 30;

export const producers: Producer[] = [
  {
    name: "Willem de Boer",
    specialty: "Heritage lamb, Hoeksche Waard",
    distance: "18km",
    image: producer01,
    region: "Hoeksche Waard",
    lat: 51.7500,
    lng: 4.3500,
    quote: "Willem's lambs graze on heritage salt marshes, giving the meat a natural mineral depth.",
  },
  {
    name: "Anneke Visser",
    specialty: "Raw milk cheese, Alblasserwaard",
    distance: "24km",
    image: producer02,
    region: "Alblasserwaard",
    lat: 51.8600,
    lng: 4.6800,
    quote: "Anneke ages her wheels in a centuries-old cellar beneath the family farmhouse.",
  },
  {
    name: "Joris van Dijk",
    specialty: "Line-caught fish, North Sea",
    distance: "28km",
    image: producer03,
    region: "North Sea",
    lat: 51.9700,
    lng: 4.2000,
    quote: "Joris fishes with hook and line — each catch is chosen, never trawled.",
  },
  {
    name: "Marieke Bos",
    specialty: "Wild herbs & foraging, Biesbosch",
    distance: "15km",
    image: producer04,
    region: "Biesbosch",
    lat: 51.8100,
    lng: 4.7200,
    quote: "Marieke forages before dawn, when the oils in wild herbs are at their peak.",
  },
  {
    name: "Pieter Hendriks",
    specialty: "Heritage vegetables, Westland",
    distance: "12km",
    image: producer05,
    region: "Westland",
    lat: 52.0200,
    lng: 4.2900,
    quote: "Pieter grows forgotten Dutch varieties — seeds saved across five generations.",
  },
  {
    name: "Sanne de Groot",
    specialty: "Honeycomb & beeswax, Ridderkerk",
    distance: "8km",
    image: producer06,
    region: "Ridderkerk",
    lat: 51.8700,
    lng: 4.5900,
    quote: "Sanne's bees pollinate the orchards that supply half the region's fruit.",
  },
];
