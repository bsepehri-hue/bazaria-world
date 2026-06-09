// 📁 lib/marketTaxonomy.ts
// THE CENTRAL TAXONOMY ENGINE FOR BAZARIA GLOBAL REGISTRIES

export const BAZARIA_REGISTRIES = {
  HOMES: "homes",
  PROPERTY: "property",
  LAND: "land",
  CARIBBEAN: "caribbean",
  RENTALS: "rentals",
  ROOMS: "rooms",
  TIMESHARE: "timeshare",
  GENERAL: "general",
  MOBILITY: "mobility",
  CARS: "cars",
  MARINE: "marine"
};

export interface ListingDataShape {
  title?: string;
  category: string;
  subCategory: string;
  location?: string;
  city?: string;
  make?: string;
  model?: string;
  isPropertyAsset?: boolean;
  isLandAsset?: boolean;
  isSanctuaryAsset?: boolean;
  isMarineAsset?: boolean;
}

export function isListingInRegistry(listing: ListingDataShape, activeTab: string): boolean {
  const cat = (listing.category || "").toLowerCase().trim();
  const sub = (listing.subCategory || "").toLowerCase().trim();
  const loc = (listing.location || "").toLowerCase().trim();
  const city = (listing.city || "").toLowerCase().trim();
  const tab = activeTab.toLowerCase().trim();

  // 1. Caribbean Sanctuary Verification
  if (loc.includes("dominican") || loc.includes("caribbean") || city.includes("dominican") || !!listing.isSanctuaryAsset) {
    if (tab === "caribbean") return true;
    // Don't let Caribbean items flood standard categories if they belong in the sanctuary view
    if (["homes", "property", "rentals", "land"].includes(tab)) return false;
  }
  if (tab === "caribbean") return false;

  // 2. STRICT EXPLICIT EVALUATION ROUTER
  switch (tab) {
    case "all":
      return true;

    case "cars":
    case "mobility":
    case "vehicles":
      // Explicitly allow consumer cars, sedans, coupes, and passenger vehicles
      return ["cars", "car", "sedan", "coupe", "convertible", "luxury", "exotic", "ev", "mobility"].includes(cat) || 
             ["cars", "car", "sedan", "coupe", "convertible", "luxury", "exotic", "ev", "mobility"].includes(sub);

    case "trucks":
    case "truck":
      // Direct database matching for commercial fleets and pickup trucks
      return ["trucks", "truck", "commercial", "fleet", "commercial fleet"].includes(cat) || 
             ["trucks", "truck", "commercial", "fleet", "commercial fleet", "pickup"].includes(sub);

    case "rvs":
    case "rv":
      return ["rv", "rvs", "camper", "trailer", "travel trailer", "motorhome"].includes(cat) || 
             ["rv", "rvs", "camper", "trailer", "travel trailer", "motorhome"].includes(sub);

    case "motorcycles":
    case "motorcycle":
      // Fixes the missing scooters, mopeds, and offroad bikes completely
      return ["motorcycles", "motorcycle", "moto", "bike", "scooter", "moped", "atv", "utv", "offroad"].includes(cat) || 
             ["motorcycles", "motorcycle", "moto", "bike", "scooter", "moped", "atv", "utv", "offroad", "dirt bike"].includes(sub);

    case "suvs":
    case "suv":
      return cat === "suv" || cat === "suvs" || sub === "suv" || sub === "suvs";

    case "marine":
    case "watercraft":
      return ["marine", "boat", "boats", "yacht", "yachts", "watercraft", "vessel", "jet ski"].includes(cat) || 
             ["marine", "boat", "boats", "yacht", "yachts", "watercraft", "vessel", "jet ski"].includes(sub) || 
             !!listing.isMarineAsset;

    case "art":
      // Match ONLY the direct core tag string "art" to prevent painting/sculpture mixups
      return cat === "art" || sub === "art";

    case "services":
    case "service":
      return ["services", "service", "cleaning", "maintenance", "contractor"].includes(cat) || 
             ["services", "service", "cleaning", "maintenance", "contractor"].includes(sub);

    case "homes":
    case "property":
      return ["homes", "property", "residential", "house", "villa", "villas", "apartment", "apartments"].includes(cat) || 
             ["homes", "property", "residential", "house", "villa", "villas", "apartment", "apartments"].includes(sub) || 
             !!listing.isPropertyAsset;

    case "land":
      return cat === "land" || sub === "land" || !!listing.isLandAsset;

    case "rentals":
      return cat === "rentals" || sub === "rentals" || cat === "lease" || sub === "lease";

    case "rooms":
      return cat === "rooms" || sub === "room" || sub.includes("share");

    case "timeshare":
      return cat === "timeshare" || sub === "timeshare";

    default:
      // Fallback matching exactly against the custom tag name
      return cat === tab || sub === tab;
  }
}
