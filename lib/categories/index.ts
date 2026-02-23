import * as pets from "./pets";
import * as art from "./art";

export const MARKET_CATEGORIES = [
  {
    id: "cars",
    label: "Cars",
    icon: "🚗",
  },
  {
    id: "trucks",
    label: "Trucks",
    icon: "🚚",
  },
  {
    id: "rvs",
    label: "RVs",
    icon: "🚐",
  },
  {
    id: "pets",
    label: "Pets",
    icon: "🐾",
    ...pets,
  },
  {
    id: "art",
    label: "Art",
    icon: "🎨",
    ...art,
  },
];
