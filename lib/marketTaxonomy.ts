// 📁 lib/marketTaxonomy.ts
// THE CENTRAL MECHANIC ROUTER FOR BAZARIA GLOBAL REGISTRIES

export interface ListingDataShape {
  category: string;
  subCategory: string;
  location?: string;
  city?: string;
  isSanctuaryAsset?: boolean;
  isPropertyAsset?: boolean;
  isLandAsset?: boolean;
  isMarineAsset?: boolean;
  title?: string; // 🚗 Added title tracking to catch specific rogue auto listings
}

export function isListingInRegistry(listing: ListingDataShape, activeTab: string): boolean {
  // Normalize live database properties cleanly to lowercase trimmed formats
  const cat = (listing.category || "").toLowerCase().trim();
  const sub = (listing.subCategory || "").toLowerCase().trim();
  const loc = (listing.location || "").toLowerCase().trim();
  const city = (listing.city || "").toLowerCase().trim();
  const title = (listing.title || "").toLowerCase().trim();
  const tab = activeTab.toLowerCase().trim();

  // --- DETERMINISTIC PREMIUM GROUP CLASSIFIERS ---
  const isArtDomain = ["art"].includes(cat) || 
    ["paintings", "sculptures", "prints", "digital", "other-art", "digital art - nfts", "other - unique art"].includes(sub);
  
  const isTrucksDomain = ["trucks", "truck"].includes(cat) || 
    ["pickup", "commercial", "semi-trailer", "box-truck", "dump-truck", "flatbed", "fleet", "commercial - fleet"].includes(sub);
  
  const isRvsDomain = ["rvs", "rv"].includes(cat) || 
    ["classa", "classc", "motorhome", "traveltrailer", "campervan", "class a", "class c", "travel trailer", "camper van"].includes(sub);
  
  const isMotorcyclesDomain = ["motorcycles", "motorcycle"].includes(cat) || 
    ["sport", "cruiser", "offroad", "off-road", "scooter", "moped", "bike", "moto", "scooter - moped"].includes(sub) ||
    sub.includes("motorcycle") || sub.includes("moped") || sub.includes("scooter");

  // 🚗 CARS REGISTRY: Force matching for explicit auto text signatures (MV, DAFD, EVMOBILE, FIAT)
  const isCarsDomain = ["cars", "car", "mobility", "vehicles"].includes(cat) || 
    ["ev", "sedan", "suv", "coupe", "minivan", "convertible", "exotic", "electric vehicles (ev)", "exotic - luxury"].includes(sub) ||
    ["mv", "dafd", "evmobile", "fiat"].some(keyword => title.includes(keyword) || sub.includes(keyword) || cat.includes(keyword)) &&
    !isMotorcyclesDomain && !isTrucksDomain && !isRvsDomain;
  
  const isMarineDomain = ["marine", "watercraft"].includes(cat) || 
    ["center-console", "center console", "yacht", "luxury yacht", "catamaran", "catamaran / sail", "jetski", "jet ski / pwc", "cruiser", "express cruiser"].includes(sub) || !!listing.isMarineAsset;
  
  const isLandDomain = ["land"].includes(cat) || 
    ["residential", "commercial-land", "commercial land", "lots", "lots - land", "acreage", "farm", "ranch", "farm - ranch"].includes(sub) || 
    title.includes("sunnyfield") || !!listing.isLandAsset;
  
  const isHomesDomain = (["homes", "property"].includes(cat) && !["timeshare", "rooms", "rentals"].includes(cat)) || 
    ["forsale", "forrent", "villas", "apartments", "for sale", "for rent"].includes(sub) || 
    title.includes("studio 64") || !!listing.isPropertyAsset;
  
  const isPetsDomain = ["pets", "pet"].includes(cat) || 
    ["dogs", "cats", "birds", "horses", "other-pets", "other - rare pets"].includes(sub);
  
  const isRentalsDomain = ["rentals", "rental"].includes(cat) || 
    ["shortterm", "longterm", "vacation", "short term", "long term"].includes(sub);
  
  const isRoomsDomain = ["rooms", "room"].includes(cat) || 
    ["private", "shared", "private rooms", "shared rooms"].includes(sub);
  
  const isServicesDomain = ["services", "service"].includes(cat) || 
    ["home-services", "auto-services", "home services", "auto services", "tech", "technical services", "concierge", "elite concierge"].includes(sub);
  
  const isTimeshareDomain = ["timeshare"].includes(cat) || ["rent", "sell"].includes(sub) || sub.includes("timeshare");

// --- Add this new domain classifier ---
  const isDigitalDomain = ["digital assets (sovereign protocol)"].includes(cat) || 
    ["nft art & media", "domain names & ens", "virtual real estate", "governance / utility tokens"].includes(sub);

  const isPremiumAsset = isArtDomain || isDigitalDomain || isCarsDomain || isTrucksDomain || isRvsDomain || 
                         isMotorcyclesDomain || isMarineDomain || isLandDomain || isHomesDomain || 
                         isPetsDomain || isRentalsDomain || isRoomsDomain || isServicesDomain || 
                         isTimeshareDomain;

  // 🛡️ 1. Caribbean Sanctuary Verification Layer
  // Ensure we check that the item is a PROPERTY asset class so local pets/cars/art with a local address string never bleed in
  const isCaribbean = !!listing.isSanctuaryAsset || sub === "sanctuary" || sub.includes("sanctuary") || 
    ((loc.includes("dominican") || loc.includes("caribbean") || city.includes("dominican")) && (isHomesDomain || isLandDomain || ["homes", "land", "property"].includes(cat)));

  if (tab === "caribbean" || tab === "sanctuary") {
    return isCaribbean;
  }
  if (isCaribbean && ["homes", "property", "rentals", "land", "cars", "general"].includes(tab)) {
    return false;
  }

  // 🕹️ 2. Pure Mechanical Parent-Child Isolation Routing Matrix
  switch (tab) {
    case "all":
      return true;

   // 🎨 ART BLOCK
    case "art":
      return isArtDomain;
    case "paintings":
    case "sculptures":
    case "prints":
      return isArtDomain && sub === tab;
    case "other-art":
      return isArtDomain && ["other-art", "other - unique art"].includes(sub);

    // ⚡ DIGITAL BLOCK (Standalone)
    case "digital":
      return isDigitalDomain;

    // 🚗 CARS BLOCK
    case "cars":
    case "mobility":
      return isCarsDomain;
    case "ev": // Fixes EV matching string properties precisely
      return isCarsDomain && (sub.includes("ev") || sub.includes("electric"));
    case "sedan":
    case "suv":
    case "coupe":
    case "minivan":
    case "convertible":
      return isCarsDomain && sub === tab;
    case "exotic":
      return isCarsDomain && (sub.includes("exotic") || sub.includes("luxury"));

    // 🛻 TRUCKS BLOCK
    case "trucks":
      return isTrucksDomain;
    case "pickup":
    case "semi-trailer":
    case "box-truck":
    case "dump-truck":
    case "flatbed":
      return isTrucksDomain && sub === tab;
    case "commercial":
      return isTrucksDomain && ["commercial", "fleet", "commercial - fleet"].includes(sub);

    // 🚐 RVS BLOCK
    case "rvs":
      return isRvsDomain;
    case "classa":
      return isRvsDomain && ["classa", "class a"].includes(sub);
    case "classc":
      return isRvsDomain && ["classc", "class c"].includes(sub);
    case "motorhome":
    case "campervan":
      return isRvsDomain && [tab, "camper van"].includes(sub);
    case "traveltrailer":
      return isRvsDomain && ["traveltrailer", "travel trailer"].includes(sub);

    // 🏍️ MOTORCYCLES BLOCK
    case "motorcycles":
      return isMotorcyclesDomain;
    case "sport":
    case "cruiser":
      return isMotorcyclesDomain && sub === tab;
    case "offroad":
      return isMotorcyclesDomain && ["offroad", "off-road"].includes(sub);
    case "scooter":
      return isMotorcyclesDomain && ["scooter", "moped", "scooter - moped"].includes(sub);

    // ⚓ WATERCRAFT BLOCK
    case "marine":
    case "watercraft":
      return isMarineDomain;
    case "center-console":
      return isMarineDomain && ["center-console", "center console"].includes(sub);
    case "yacht":
      return isMarineDomain && ["yacht", "luxury yacht"].includes(sub);
    case "catamaran":
      return isMarineDomain && ["catamaran", "sail", "catamaran / sail"].includes(sub);
    case "jetski":
      return isMarineDomain && ["jetski", "jet ski", "pwc", "jet ski / pwc"].includes(sub);
    case "cruiser":
      return isMarineDomain && ["cruiser", "express cruiser"].includes(sub);

    // 🗺️ LAND BLOCK
    case "land":
      return isLandDomain;
    case "residential":
    case "lots":
    case "acreage":
      return isLandDomain && [tab, "lots - land"].includes(sub);
    case "commercial-land":
      return isLandDomain && ["commercial-land", "commercial land"].includes(sub);
    case "farm":
      return isLandDomain && ["farm", "ranch", "farm - ranch"].includes(sub);

    // 🏠 HOMES BLOCK
    case "homes":
    case "property":
      return isHomesDomain;
    case "forsale": // Fixes dynamic lookup without rigid cat string locks
      return isHomesDomain && ["forsale", "for sale"].includes(sub);
    case "forrent":
      return isHomesDomain && ["forrent", "for rent"].includes(sub);
    case "villas":
    case "apartments":
      return isHomesDomain && sub === tab;

    // 🐾 PETS BLOCK
    case "pets":
      return isPetsDomain;
    case "dogs":
    case "cats":
    case "birds":
    case "horses":
      return isPetsDomain && sub === tab;
    case "other-pets":
      return isPetsDomain && ["other-pets", "other - rare pets"].includes(sub);

    // 🏢 RENTALS BLOCK
    case "rentals":
      return isRentalsDomain;
    case "shortterm":
      return isRentalsDomain && ["shortterm", "short term"].includes(sub);
    case "longterm":
      return isRentalsDomain && ["longterm", "long term"].includes(sub);
    case "vacation":
      return isRentalsDomain && sub === tab;

    // 🛏️ ROOMS BLOCK
    case "rooms":
      return isRoomsDomain;
    case "private":
      return isRoomsDomain && ["private", "private rooms"].includes(sub);
    case "shared":
      return isRoomsDomain && ["shared", "shared rooms"].includes(sub);

    // 🪛 SERVICES BLOCK
    case "services":
      return isServicesDomain;
    case "home-services":
      return isServicesDomain && ["home-services", "home services"].includes(sub);
    case "auto-services":
      return isServicesDomain && ["auto-services", "auto services"].includes(sub);
    case "tech":
      return isServicesDomain && ["tech", "technical services"].includes(sub);
    case "concierge":
      return isServicesDomain && ["concierge", "elite concierge"].includes(sub);

   // 📅 TIMESHARE BLOCK
    case "timeshare":
      return isTimeshareDomain;
      
    case "rent":
      // Explicitly catch timeshares for rent vs homes/rooms for rent
      if (cat === "timeshare") {
        return ["rent", "for rent", "rentals"].includes(sub);
      }
      return isTimeshareDomain && sub === tab;
      
    case "sell":
      // Explicitly catch timeshares for sale vs homes for sale
      if (cat === "timeshare") {
        return ["sell", "for sale", "sale"].includes(sub);
      }
      return isTimeshareDomain && sub === tab;

    // 📦 GENERAL MARKET CATCH-ALL
    case "general":
      if (isPremiumAsset || isCaribbean) return false;
      return true;

    // Specific General subcategories mapping
    case "electronics":
    case "furniture":
    case "appliances":
      return !isPremiumAsset && sub === tab;
    case "watches":
      return ["watches", "luxury watches"].includes(sub) || cat === "watches";
    case "jewelry":
      return ["jewelry", "fine jewelry"].includes(sub) || cat === "jewelry";
    case "other-general":
      if (isPremiumAsset || isCaribbean) return false;
      return ["other-general", "other - miscellaneous", ""].includes(sub) || cat === "general" || cat === "general market";

    default:
      return cat === tab || sub === tab;
  }
}
