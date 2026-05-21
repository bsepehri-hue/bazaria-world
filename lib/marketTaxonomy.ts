// 📁 lib/marketTaxonomy.ts
// THE CENTRAL TAXONOMY ENGINE FOR BAZARIA GLOBAL REGISTRIES

export const BAZARIA_REGISTRIES = {
  HOMES: "homes",
  PROPERTY: "property",
  APARTMENTS: "apartments",
  VILLAS: "villas",
  LAND: "land",
  CARIBBEAN: "caribbean",
  RENTALS: "rentals",
  ROOMS: "rooms",
  TIMESHARE: "timeshare",
  GENERAL: "general",
  MOBILITY: "mobility",
  CARS: "cars"
};

export interface ListingDataShape {
  title?: string;
  category: string;
  subCategory: string;
  location?: string;
  city?: string;
  province?: string;
  make?: string;
  model?: string;
  year?: number | string;
  description?: string;
  isPropertyAsset?: boolean;
  isLandAsset?: boolean;
  isSanctuaryAsset?: boolean;
}

export function isListingInRegistry(listing: ListingDataShape, activeTab: string): boolean {
  const title = (listing.title || "").toLowerCase();
  const cat = (listing.category || "").toLowerCase().trim();
  const sub = (listing.subCategory || "").toLowerCase().trim();
  const loc = (listing.location || "").toLowerCase().trim();
  const city = (listing.city || "").toLowerCase().trim();
  const make = (listing.make || "").toLowerCase().trim();
  const model = (listing.model || "").toLowerCase().trim();
  const desc = (listing.description || "").toLowerCase();
  
  const tab = activeTab.toLowerCase().trim();

  // 🛑 MASTER ANTI-COLLISION CLASSIFIERS
  const isCaribbeanRegion = loc.includes("dominican") || loc.includes("caribbean") || 
                            city.includes("dominican") || city.includes("caribbean") ||
                            sub.includes("caribbean") || cat.includes("caribbean") ||
                            !!listing.isSanctuaryAsset;

  const isLand = cat === "land" || sub === "land" || !!listing.isLandAsset;
  const isTimeshare = cat === "timeshare" || sub === "timeshare";
  
  const isVehicle = ['cars', 'trucks', 'motorcycle', 'rv', 'ev', 'electric', 'mobility', 'suv', 'moped', 'scooter'].some(v => cat.includes(v) || sub.includes(v)) || !!make;
  
  const isArt = ['art', 'paint', 'sculpt', 'print', 'digital', 'nft'].some(a => cat.includes(a) || sub.includes(a));
  const isPet = ['pet', 'dog', 'cat', 'animal', 'rare'].some(p => cat.includes(p) || sub.includes(p));
  const isService = ['service', 'clean', 'pro', 'maintenance', 'listing'].some(s => cat.includes(s) || sub.includes(s)) || cat === '';

  // --- 🏠 REAL ESTATE REGISTERED DEPARTMENTS ---
  if (tab === BAZARIA_REGISTRIES.LAND) return isLand;
  if (tab === BAZARIA_REGISTRIES.CARIBBEAN) return isCaribbeanRegion;

  if (tab === BAZARIA_REGISTRIES.APARTMENTS || tab === "apartment") {
    if (isCaribbeanRegion || isTimeshare || isLand) return false;
    return sub.includes("apartment") || cat.includes("apartment");
  }

  if (tab === BAZARIA_REGISTRIES.VILLAS || tab === "villa") {
    if (isTimeshare || isLand) return false;
    return sub.includes("villa") || cat.includes("villa");
  }

  if (tab === BAZARIA_REGISTRIES.ROOMS || tab === "room") {
    return cat === "rooms" || sub.includes("room") || sub.includes("share");
  }

  if (tab === BAZARIA_REGISTRIES.HOMES || tab === BAZARIA_REGISTRIES.PROPERTY) {
    const isBaseProperty = ["property", "homes", "residential", "rentals", "apartment", "apartments", "villas", "villa"].includes(cat) || 
                           ["property", "homes", "residential", "rentals", "apartment", "apartments", "villas", "villa"].includes(sub) ||
                           !!listing.isPropertyAsset;
                           
    return isBaseProperty && !isCaribbeanRegion && !isLand && !isTimeshare && cat !== "rooms";
  }

  // --- 🏎️ MOBILITY & TRANSPORT DEPARTMENTS (Including EV and Exotic mapping) ---
  const mobilityTabs = [BAZARIA_REGISTRIES.MOBILITY, BAZARIA_REGISTRIES.CARS, "motorcycles", "suv", "trucks", "ev", "electric", "exotic", "luxury"];
  
  if (mobilityTabs.includes(tab)) {
    if (!isVehicle || !!listing.isPropertyAsset || isService) return false;

    // ⚡ EV / Electric sub-routing
    if (tab === "ev" || tab === "electric") {
      return cat.includes("ev") || cat.includes("electric") || sub.includes("ev") || sub.includes("electric") || title.includes("electric");
    }

    // 💎 Exotic / Luxury sub-routing (The place for Ferraris!)
    if (tab === "exotic" || tab === "luxury") {
      const exoticBrands = ['ferrari', 'lamborghini', 'porsche', 'mclaren', 'aston martin', 'bugatti', 'rolls royce', 'bentley'];
      return sub.includes("exotic") || sub.includes("luxury") || title.includes("luxury") || exoticBrands.includes(make);
    }

    if (tab === "suv") return sub.includes("suv") || model.includes("suv") || title.includes("suv");
    if (tab === "trucks") return cat.includes("truck") || sub.includes("truck");
    if (tab === "motorcycles") return cat.includes("moto") || sub.includes("moto") || cat.includes("scooter");

    // Parent main tabs display all valid vehicles
    return true;
  }

  // --- 📦 GENERAL MARKET REGISTER (Strict Borders applied) ---
  if (tab === BAZARIA_REGISTRIES.GENERAL || tab === "watch" || tab === "apparel") {
    // If it clearly belongs in another core vertical, do not allow it into General
    if (!!listing.isPropertyAsset || isVehicle || isArt || isPet || isService || isCaribbeanRegion || isLand || isTimeshare) {
      return false;
    }

    if (tab === "watch") return cat.includes("watch") || sub.includes("watch");
    if (tab === "apparel") return cat.includes("apparel") || sub.includes("clothing") || sub.includes("jacket");

    // General catches fallback items like furniture or appliances cleanly
    return true;
  }

  // Fallback direct match route for any unmapped miscellaneous tags
  return cat === tab || sub === tab;
}
