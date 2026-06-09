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
}

export function isListingInRegistry(listing: ListingDataShape, activeTab: string): boolean {
  // Normalize live database properties cleanly to lowercase trimmed formats
  const cat = (listing.category || "").toLowerCase().trim();
  const sub = (listing.subCategory || "").toLowerCase().trim();
  const loc = (listing.location || "").toLowerCase().trim();
  const city = (listing.city || "").toLowerCase().trim();
  const tab = activeTab.toLowerCase().trim();

  // 🛡️ 1. Absolute Caribbean Sanctuary Domain Protection
  const isCaribbean = loc.includes("dominican") || loc.includes("caribbean") || city.includes("dominican") || !!listing.isSanctuaryAsset || sub === "sanctuary";
  if (tab === "caribbean" || tab === "sanctuary") {
    return isCaribbean;
  }
  // Enforce rigid containment: if an asset belongs to the Caribbean Sanctuary, hold it exclusively there
  if (isCaribbean && ["homes", "property", "rentals", "land", "cars", "general"].includes(tab)) {
    return false;
  }

  // --- DETERMINISTIC PREMIUM GROUP CLASSIFIERS ---
  const isArtDomain = ["art"].includes(cat) || ["paintings", "sculptures", "prints", "digital", "other-art"].includes(sub);
  
  const isCarsDomain = ["cars", "car", "mobility", "vehicles"].includes(cat) || ["ev", "sedan", "suv", "coupe", "minivan", "convertible", "exotic"].includes(sub);
  
  const isTrucksDomain = ["trucks", "truck"].includes(cat) || ["pickup", "commercial", "semi-trailer", "box-truck", "dump-truck", "flatbed", "fleet"].includes(sub);
  
  const isRvsDomain = ["rvs", "rv"].includes(cat) || sub.includes("class") || ["motorhome", "traveltrailer", "travel trailer", "campervan"].some(v => sub.includes(v));
  
  // 🏍️ FIX: Added multi-word containing variations ("scooter - moped", "off-road") directly to domain classifier
  const isMotorcyclesDomain = ["motorcycles", "motorcycle"].includes(cat) || 
    ["sport", "cruiser", "offroad", "off-road", "scooter", "moped", "bike", "moto"].some(v => sub.includes(v));
  
  const isMarineDomain = ["marine", "watercraft"].includes(cat) || ["center-console", "center console", "yacht", "catamaran", "jetski", "jet ski", "cruiser"].some(v => sub.includes(v)) || !!listing.isMarineAsset;
  
  const isLandDomain = ["land"].includes(cat) || ["residential", "commercial-land", "lots", "acreage", "farm"].includes(sub) || !!listing.isLandAsset;
  
  const isHomesDomain = ["homes", "property"].includes(cat) || ["forsale", "forrent", "villas", "apartments", "sanctuary"].includes(sub) || !!listing.isPropertyAsset;
  
  const isPetsDomain = ["pets", "pet"].includes(cat) || ["dogs", "cats", "birds", "horses", "other-pets"].includes(sub);
  
  const isRentalsDomain = ["rentals", "rental"].includes(cat) || ["shortterm", "longterm", "vacation"].includes(sub);
  
  const isRoomsDomain = ["rooms", "room"].includes(cat) || ["private", "shared"].includes(sub);
  
  const isServicesDomain = ["services", "service"].includes(cat) || ["home-services", "auto-services", "tech", "concierge"].includes(sub);
  
  const isTimeshareDomain = ["timeshare"].includes(cat) || ["rent", "sell"].includes(sub);

  const isPremiumAsset = isArtDomain || isCarsDomain || isTrucksDomain || isRvsDomain || isMotorcyclesDomain || 
                         isMarineDomain || isLandDomain || isHomesDomain || isPetsDomain || isRentalsDomain || 
                         isRoomsDomain || isServicesDomain || isTimeshareDomain;

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
    case "digital":
    case "other-art":
      return isArtDomain && sub === tab;

    // 🚗 CARS BLOCK
    case "cars":
    case "mobility":
      return isCarsDomain;
    case "ev":
    case "sedan":
    case "suv":
    case "coupe":
    case "minivan":
    case "convertible":
    case "exotic":
      return isCarsDomain && sub === tab;

    // 🛻 TRUCKS BLOCK
    case "trucks":
      return isTrucksDomain;
    case "pickup":
    case "commercial":
    case "semi-trailer":
    case "box-truck":
    case "dump-truck":
    case "flatbed":
      return isTrucksDomain && (sub === tab || (tab === "commercial" && (sub === "commercial" || sub === "fleet")));

    // 🚐 RVS BLOCK
    case "rvs":
      return isRvsDomain;
    case "classa":
    case "classc":
    case "motorhome":
    case "traveltrailer":
    case "campervan":
      return isRvsDomain && (sub === tab || (tab === "traveltrailer" && (sub === "traveltrailer" || sub === "travel trailer")));

    // 🏍️ MOTORCYCLES BLOCK
    case "motorcycles":
      return isMotorcyclesDomain;
    case "sport":
    case "cruiser":
    case "offroad":
    case "scooter":
      return isMotorcyclesDomain && (
        sub === tab || 
        // 🏍️ FIXES: Catch variations like "off-road" or "scooter - moped" matching cleanly to the URL tab keywords
        (tab === "offroad" && (sub === "offroad" || sub === "off-road")) ||
        (tab === "scooter" && (sub.includes("scooter") || sub.includes("moped")))
      );

    // ⚓ WATERCRAFT BLOCK
    case "marine":
    case "watercraft":
      return isMarineDomain;
    case "center-console":
    case "yacht":
    case "catamaran":
    case "jetski":
      return isMarineDomain && (
        sub === tab || 
        (tab === "center-console" && (sub === "center-console" || sub === "center console")) ||
        (tab === "jetski" && (sub === "jetski" || sub === "jet ski"))
      );

    // 🗺️ LAND BLOCK
    case "land":
      return isLandDomain;
    case "commercial-land":
    case "lots":
    case "acreage":
    case "farm":
      return isLandDomain && sub === tab;

    // 🏠 HOMES BLOCK
    case "homes":
    case "property":
      return isHomesDomain;
    case "forsale":
    case "forrent":
    case "villas":
    case "apartments":
      return isHomesDomain && sub === tab;

    // 🐾 PETS BLOCK
    case "pets":
      return isPetsDomain;
    case "dogs":
    case "cats":
      return isPetsDomain && sub === tab;
    case "other-pets":
      return isPetsDomain && sub === "other-pets";

    // 🏢 RENTALS BLOCK
    case "rentals":
      return isRentalsDomain;
    case "shortterm":
    case "longterm":
    case "vacation":
      return isRentalsDomain && sub === tab;

    // 🛏️ ROOMS BLOCK
    case "rooms":
      return isRoomsDomain;
    case "private":
    case "shared":
      return isRoomsDomain && sub === tab;

    // 🪛 SERVICES BLOCK
    case "services":
      return isServicesDomain;
    case "home-services":
    case "auto-services":
    case "tech":
    case "concierge":
      return isServicesDomain && sub === tab;

    // 📅 TIMESHARE BLOCK
    case "timeshare":
      return isTimeshareDomain;
    case "rent":
    case "sell":
      return isTimeshareDomain && sub === tab;

    // 📦 GENERAL MARKET CATCH-ALL
    case "general":
      if (isPremiumAsset || isCaribbean) return false;
      return true;

    // Specific General subcategories mapping
    case "electronics":
    case "furniture":
    case "appliances":
    case "watches":
    case "jewelry":
    case "other-general":
      return !isPremiumAsset && (sub === tab || (tab === "watches" && cat === "watches") || (tab === "jewelry" && cat === "jewelry"));

    default:
      return cat === tab || sub === tab || sub.includes(tab);
  }
}
