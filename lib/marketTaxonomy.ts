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
  CARS: "cars",
  MARINE: "marine"
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
  isMarineAsset?: boolean;
}

export function isListingInRegistry(listing: ListingDataShape, activeTab: string): boolean {
  const title = (listing.title || "").toLowerCase();
  const cat = (listing.category || "").toLowerCase().trim();
  const sub = (listing.subCategory || "").toLowerCase().trim();
  const loc = (listing.location || "").toLowerCase().trim();
  const city = (listing.city || "").toLowerCase().trim();
  const make = (listing.make || "").toLowerCase().trim();
  const model = (listing.model || "").toLowerCase().trim();
  
  const tab = activeTab.toLowerCase().trim();

  // Helper function for strict whole-word boundary matching (stops "rv" matching "service")
  const containsStrictWord = (sourceText: string, targetWord: string) => {
    if (!sourceText) return false;
    const regex = new RegExp(`\\b${targetWord}\\b`, 'i');
    return regex.test(sourceText);
  };

  // 🛑 MASTER ANTI-COLLISION CLASSIFIERS (Strict Whole-Word and Direct String Matching)
  const isCaribbeanRegion = loc.includes("dominican") || loc.includes("caribbean") || 
                            city.includes("dominican") || city.includes("caribbean") ||
                            sub.includes("caribbean") || cat.includes("caribbean") ||
                            !!listing.isSanctuaryAsset;

  const isLand = cat === "land" || sub === "land" || !!listing.isLandAsset;
  const isTimeshare = cat === "timeshare" || sub === "timeshare";
  
  // Strict check for vehicles to prevent "rv" bleeding into "service"
  const isVehicle = ['cars', 'trucks', 'vehicles', 'mobility'].includes(cat) || 
                    ['cars', 'trucks', 'vehicles', 'mobility'].includes(sub) ||
                    containsStrictWord(cat, "motorcycle") || containsStrictWord(sub, "motorcycle") ||
                    containsStrictWord(cat, "rv") || containsStrictWord(sub, "rv") ||
                    containsStrictWord(cat, "suv") || containsStrictWord(sub, "suv") ||
                    containsStrictWord(cat, "scooter") || containsStrictWord(sub, "scooter") ||
                    !!make;
  
  const isWatercraft = ['marine', 'boat', 'boats', 'yacht', 'yachts', 'watercraft', 'vessel'].some(w => cat === w || sub === w) || 
                       containsStrictWord(title, "boat") || containsStrictWord(title, "yacht") || !!listing.isMarineAsset;

  // Strict check for Art to prevent matching "heart"
  const isArt = cat === "art" || sub === "art" || 
                (cat !== "services" && (containsStrictWord(cat, "art") || containsStrictWord(sub, "art")));
  
  const isPet = ['pet', 'pets', 'dog', 'dogs', 'cat', 'cats', 'animal', 'animals'].some(p => cat === p || sub === p);
  
  const isService = cat === 'services' || cat === 'service' || sub === 'services' || sub === 'service' ||
                    containsStrictWord(cat, "maintenance") || containsStrictWord(sub, "maintenance") ||
                    containsStrictWord(cat, "contractor") || containsStrictWord(sub, "contractor");

  // --- 🏠 REAL ESTATE REGISTERED DEPARTMENTS ---
  if (tab === BAZARIA_REGISTRIES.LAND) return isLand;
  
  if (tab === BAZARIA_REGISTRIES.CARIBBEAN) {
    if (isVehicle || isWatercraft || isArt || isPet || isService) return false;
    return isCaribbeanRegion;
  }

  if (tab === BAZARIA_REGISTRIES.APARTMENTS || tab === "apartment") {
    if (isCaribbeanRegion || isTimeshare || isLand) return false;
    return cat === "apartments" || cat === "apartment" || sub === "apartment" || sub === "apartments";
  }

  if (tab === BAZARIA_REGISTRIES.VILLAS || tab === "villa") {
    if (isTimeshare || isLand) return false;
    return cat === "villas" || cat === "villa" || sub === "villa" || sub === "villas";
  }

  if (tab === BAZARIA_REGISTRIES.ROOMS || tab === "room") {
    return cat === "rooms" || cat === "room" || sub === "room" || sub === "rooms" || sub.includes("share");
  }

  if (tab === BAZARIA_REGISTRIES.HOMES || tab === BAZARIA_REGISTRIES.PROPERTY) {
    const isBaseProperty = ["property", "homes", "residential", "rentals", "apartment", "apartments", "villas", "villa"].includes(cat) || 
                           ["property", "homes", "residential", "rentals", "apartment", "apartments", "villas", "villa"].includes(sub) ||
                           !!listing.isPropertyAsset;
                           
    return isBaseProperty && !isCaribbeanRegion && !isLand && !isTimeshare && cat !== "rooms" && cat !== "room";
  }

  // --- 🏎️ MOBILITY & TRANSPORT DEPARTMENTS ---
  if (tab === BAZARIA_REGISTRIES.MOBILITY || tab === "mobility" || tab === BAZARIA_REGISTRIES.CARS || tab === "cars" || tab === "rvs" || tab === "trucks" || tab === "motorcycles") {
    if (!isVehicle || !!listing.isPropertyAsset || isService) return false;

    // Explicit tab matching to avoid fallthrough mixups
    if (tab === "trucks") return cat === "trucks" || cat === "truck" || sub === "truck" || containsStrictWord(title, "truck");
    if (tab === "rvs") return cat === "rvs" || cat === "rv" || sub === "rv" || containsStrictWord(title, "rv") || containsStrictWord(title, "trailer");
    if (tab === "motorcycles") return cat === "motorcycles" || cat === "motorcycle" || sub === "motorcycle" || containsStrictWord(title, "motorcycle") || containsStrictWord(title, "moto");

    // Pure Car / Passenger View Selection
    const isHeavyFleet = cat === "trucks" || sub === "truck" || containsStrictWord(title, "truck") ||
                         cat === "rvs" || containsStrictWord(title, "rv") || containsStrictWord(title, "trailer") ||
                         containsStrictWord(title, "motorcycle");

    if (tab === "cars" || tab === BAZARIA_REGISTRIES.CARS || tab === "mobility") {
      if (isHeavyFleet && !containsStrictWord(title, "suv")) return false;
      return true;
    }
    return true;
  }
  
  // --- ⚓ MARINE & WATERCRAFT DEPARTMENT ---
  if (tab === BAZARIA_REGISTRIES.MARINE || tab === "watercraft") {
    if (!!listing.isPropertyAsset || isService) return false;
    return isWatercraft;
  }

  // --- 🎨 ART REGISTERED DEPARTMENT ---
  if (tab === "art" || tab === "other-art") {
    if (!!listing.isPropertyAsset || isVehicle || isWatercraft || isService || isCaribbeanRegion) return false;
    return isArt;
  }

  // --- 🐾 PETS REGISTERED DEPARTMENT ---
  if (tab === "pets" || tab === "pet") {
    if (!!listing.isPropertyAsset || isVehicle || isWatercraft || isService || isCaribbeanRegion) return false;
    return isPet;
  }

  // --- 🛠️ SERVICES REGISTERED DEPARTMENT ---
  if (tab === "services" || tab === "service") {
    return isService && !isVehicle && !isWatercraft && !listing.isPropertyAsset;
  }

  // --- 📦 GENERAL MARKET REGISTER ---
  if (tab === BAZARIA_REGISTRIES.GENERAL) {
    if (!!listing.isPropertyAsset || isVehicle || isWatercraft || isArt || isPet || isService || isCaribbeanRegion || isLand || isTimeshare) {
      return false;
    }
    return true;
  }

  // Fallback direct match route for any unmapped miscellaneous tags
  return cat === tab || sub === tab;
}
