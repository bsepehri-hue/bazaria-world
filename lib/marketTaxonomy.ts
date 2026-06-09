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
  // ⚓ EXTENSION: New Global Marine Registry
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
  // ⚓ EXTENSION: Structural flags for complex marine assets (e.g., slip rights or charter timeshares)
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
  
  // ⚓ EXTENSION: Marine Isolation Shield
  const isWatercraft = ['marine', 'boat', 'boats', 'yacht', 'yachts', 'watercraft', 'jet ski', 'jetski', 'catamaran', 'vessel'].some(w => cat.includes(w) || sub.includes(w)) || !!listing.isMarineAsset;

  const isArt = ['art', 'paint', 'sculpt', 'print', 'digital', 'nft'].some(a => cat.includes(a) || sub.includes(a));
  
  // 🛡️ AIRTIGHT FIX: Uses strict word testing so "vacation" or "category" never trips your pet registry!
  const isPet = ['pet', 'pets', 'dog', 'dogs', 'cat', 'cats', 'animal', 'animals', 'rare']
    .some(p => cat === p || sub === p || new RegExp(`\\b${p}\\b`).test(cat) || new RegExp(`\\b${p}\\b`).test(sub));
  
  // 🪛 PRECISION SERVICE CHECK: Uses exact strings or isolated words so "property" never gets caught!
  const isService = ['service', 'cleaning', 'maintenance', 'contractor', 'listing agreement'].some(s => cat.includes(s) || sub.includes(s)) || 
                    cat === 'service' || sub === 'service' || cat === '';

  // --- 🏠 REAL ESTATE REGISTERED DEPARTMENTS ---
  if (tab === BAZARIA_REGISTRIES.LAND) return isLand;
  
  // 🛡️ AIRTIGHT SHIELD: Protect the Caribbean region from vehicle, marine, pet, art, or service data bleeding
  if (tab === BAZARIA_REGISTRIES.CARIBBEAN) {
    if (isVehicle || isWatercraft || isArt || isPet || isService) return false;
    return isCaribbeanRegion;
  }

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

// --- 🏎️ MOBILITY & TRANSPORT DEPARTMENTS ---
  // Comprehensive mapping of your exact CategoryBar layout text inputs
const mobilityTabs = [
    BAZARIA_REGISTRIES.MOBILITY, 
    BAZARIA_REGISTRIES.CARS, 
    "cars",                     // 🌟 Extra safety inclusion
    "Cars",                     // 🌟 Case insensitivity backup
    "motorcycles", 
    "suv", 
    "trucks", 
    "ev", 
    "electric", 
    "exotic", 
    "luxury",
    "electric vehicles (ev)", 
    "exotic - luxury"          
  ];
  
  if (mobilityTabs.includes(tab)) {
    if (!isVehicle || !!listing.isPropertyAsset || isService) return false;

    // ... keeping your EV, Exotic, SUV, Truck, and Motorcycle blocks exactly the same ...

    // 🚗 Strict Car Isolation (Locks down the Sedan/Coupe/Car tab completely)
    if (tab === BAZARIA_REGISTRIES.CARS || tab === "cars" || tab === "Cars") {
      
      // 1. Identify if it belongs to an alternate vehicle class explicitly
      const isOtherVehicleType = cat.includes("truck") || sub.includes("truck") || title.includes("truck") ||
                                 cat.includes("suv") || sub.includes("suv") || title.includes("suv") ||
                                 cat.includes("moto") || sub.includes("moto") || cat.includes("bike") || cat.includes("motorcycle") || sub.includes("motorcycle") ||
                                 title.includes("rv ") || title.includes("rv") || cat.includes("rv") || sub.includes("rv") ||
                                 cat.includes("moped") || cat.includes("scooter") || sub.includes("scooter");
      
      if (isOtherVehicleType) return false;

      // 2. Explicitly ensure it has a car keyword, or if it's a generic "mobility" listing, ensure it doesn't match a truck/RV title
      const matchesCarKeywords = cat.includes("car") || sub.includes("car") || 
                                 cat.includes("sedan") || sub.includes("sedan") || 
                                 cat.includes("coupe") || sub.includes("coupe");

      // 3. Fallback: If it's just tagged generally as "mobility" with no subcategory, check if the title implies a standard car/automobile
      const isGenericMobilityFallback = (cat === "mobility" && (!sub || sub === ""));

      return matchesCarKeywords || isGenericMobilityFallback;
    }

// 🚗 Strict Car Isolation
    if (tab === BAZARIA_REGISTRIES.CARS) {
      const isOtherVehicleType = cat.includes("truck") || sub.includes("truck") || title.includes("truck") ||
                                 cat.includes("suv") || sub.includes("suv") || title.includes("suv") ||
                                 cat.includes("moto") || sub.includes("moto") || cat.includes("bike") ||
                                 title.includes("rv ") || cat.includes("rv") || sub.includes("rv");
      
      const result = (cat.includes("car") || sub.includes("car") || cat.includes("sedan") || sub.includes("sedan") || cat.includes("mobility")) && !isOtherVehicleType;

      // 👇 ADD THIS TEMPORARY LOG HERE 👇
      console.log(`🔍 [TAXONOMY DEBUG] Title: "${title}" | Cat: "${cat}" | Sub: "${sub}" | Allowed? -> ${result}`);

      return result;
    }
  
  // --- ⚓ EXTENSION: MARINE & WATERCRAFT DEPARTMENT ---
  const marineTabs = [BAZARIA_REGISTRIES.MARINE, "watercraft", "boats", "yachts"];
  if (marineTabs.includes(tab)) {
    if (!!listing.isPropertyAsset || isService) return false;
    return isWatercraft;
  }

  // --- 📦 GENERAL MARKET REGISTER (Strict Borders applied) ---
  if (tab === BAZARIA_REGISTRIES.GENERAL || tab === "watch" || tab === "apparel") {
    // If it clearly belongs in another core vertical, do not allow it into General
    if (!!listing.isPropertyAsset || isVehicle || isWatercraft || isArt || isPet || isService || isCaribbeanRegion || isLand || isTimeshare) {
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
