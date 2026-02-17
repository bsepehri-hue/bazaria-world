// bazaria-world/lib/categories/index.ts

// Temporary placeholder icon component.
// Replace with real icons later.
const Placeholder = () => null;

export const MARKET_CATEGORIES = [
  { id: "cars", label: "Cars" },
  { id: "trucks", label: "Trucks" },
  { id: "motorcycles", label: "Motorcycles" },
  { id: "rvs", label: "RVs" },
  { id: "homes", label: "Homes" },
  { id: "land", label: "Land" },
  { id: "rentals", label: "Rentals" },
  { id: "rooms", label: "Rooms" },
  { id: "timeshare", label: "Timeshare" },
  { id: "general", label: "General" },
  { id: "services", label: "Services" },

  // ⭐ Restore missing categories
  { id: "pets", label: "Pets" },
  { id: "art", label: "Art" },
];

export const CategoryIcons = {
  cars: { active: Placeholder, default: Placeholder },
  trucks: { active: Placeholder, default: Placeholder },
  motorcycles: { active: Placeholder, default: Placeholder },
  rvs: { active: Placeholder, default: Placeholder },
  homes: { active: Placeholder, default: Placeholder },
  land: { active: Placeholder, default: Placeholder },
  rentals: { active: Placeholder, default: Placeholder },
  rooms: { active: Placeholder, default: Placeholder },
  timeshare: { active: Placeholder, default: Placeholder },
  general: { active: Placeholder, default: Placeholder },
  services: { active: Placeholder, default: Placeholder },

  // ⭐ Add icons for restored categories
  pets: { active: Placeholder, default: Placeholder },
  art: { active: Placeholder, default: Placeholder },
};
