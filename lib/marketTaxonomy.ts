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
  const isCaribbean = loc.includes("dominican") || loc.includes("caribbean") || city.includes("dominican") || !!listing.isSanctuaryAsset || sub === "sanctuary" || sub.includes("sanctuary");
  if (tab === "caribbean" || tab === "sanctuary") {
    return isCaribbean;
  }
  // Enforce rigid containment: if an asset belongs to the Caribbean Sanctuary, hold it exclusively there
  if (isCaribbean && ["homes", "property", "rentals", "land", "cars", "general"].includes(tab)) {
    return false;
  }

  // --- DETERMINISTIC PREMIUM GROUP CLASSIFIERS (CATCHES BOTH NATIVE IDS AND DISPLAY LABELS) ---
  const isArtDomain = ["art"].includes(cat) || 
    ["paintings", "sculptures", "prints", "digital", "other-art"].some(v => sub.includes(v)) || sub.includes("art") || sub.includes("nfts");
  
  const isCarsDomain = ["cars", "car", "mobility", "vehicles"].includes(cat) || 
    ["ev", "sedan", "suv", "coupe", "minivan", "convertible", "exotic", "electric", "luxury"].some(v => sub.includes(v));
  
  const isTrucksDomain = ["trucks", "truck"].includes(cat) || 
    ["pickup", "commercial", "semi-trailer", "box-truck", "dump-truck", "flatbed", "fleet"].some(v => sub.includes(v)) || sub.includes("truck");
  
  const isRvsDomain = ["rvs", "rv"].includes(cat) || 
    ["classa", "classc", "motorhome", "traveltrailer", "travel trailer", "campervan", "camper van", "class a", "class c"].some(v => sub.includes(v));
  
  const isMotorcyclesDomain = ["motorcycles", "motorcycle"].includes(cat) || 
    ["sport", "cruiser", "offroad", "off-road", "scooter", "moped", "bike", "moto"].some(v => sub.includes(v));
  
  const isMarineDomain = ["marine", "watercraft"].includes(cat) || 
    ["center-console", "center console", "yacht", "catamaran", "jetski", "jet ski", "cruiser", "pwc", "sail"].some(v => sub.includes(v)) || !!listing.isMarineAsset;
  
  const isLandDomain = ["land"].includes(cat) || 
    ["residential", "commercial-land", "commercial land", "lots", "acreage", "farm", "ranch"].some(v => sub.includes(v)) || !!listing.isLandAsset;
  
  const isHomesDomain = ["homes", "property"].includes(cat) || 
    ["forsale", "forrent", "villas", "apartments", "sanctuary", "for sale", "for rent"].some(v => sub.includes(v)) || !!listing.isPropertyAsset;
  
  const isPetsDomain = ["pets", "pet"].includes(cat) || 
    ["dogs", "cats", "birds", "horses", "other-pets", "rare pets"].some(v => sub.includes(v));
  
  const isRentalsDomain = ["rentals", "rental"].includes(cat) || 
    ["shortterm", "longterm", "vacation", "short term", "long term"].some(v => sub.includes(v));
  
  const isRoomsDomain = ["rooms", "room"].includes(cat) || 
    ["private", "shared"].some(v => sub.includes(v));
  
  const isServicesDomain = ["services", "service"].includes(cat) || 
    ["home-services", "auto-services", "home services", "auto services", "tech", "concierge", "elite"].some(v => sub.includes(v));
  
  const isTimeshareDomain = ["timeshare"].includes(cat) || 
    ["rent", "sell"].some(v => sub.includes(v));

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
      return isArtDomain && sub.includes(tab);
    case "digital":
      return isArtDomain && (sub.includes("digital") || sub.includes("nft"));
    case "other-art":
      return isArtDomain && (sub.includes("other") || sub.includes("unique"));

    // 🚗 CARS BLOCK
    case "cars":
    case "mobility":
      return isCarsDomain;
    case "ev":
      return isCarsDomain && (sub.includes("ev") || sub.includes("electric"));
    case "sedan":
    case "suv":
    case "coupe":
    case "minivan":
    case "convertible":
      return isCarsDomain && sub.includes(tab);
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
      // Re-normalize layout strings to catch hyphens vs spaces cleanly
      return isTrucksDomain && (sub.includes(tab) || sub.includes(tab.replace("-", " ")) || sub.includes(tab.replace(" ", "-")));
    case "commercial":
      return isTrucksDomain && (sub.includes("commercial") || sub.includes("fleet"));

    // 🚐 RVS BLOCK
    case "rvs":
      return isRvsDomain;
    case "classa":
      return isRvsDomain && (sub.includes("classa") || sub.includes("class a"));
    case "classc":
      return isRvsDomain && (sub.includes("classc") || sub.includes("class c"));
    case "motorhome":
    case "campervan":
      return isRvsDomain && (sub.includes(tab) || sub.includes(tab.replace("van", " van")));
    case "traveltrailer":
      return isRvsDomain && (sub.includes("traveltrailer") || sub.includes("travel trailer"));

    // 🏍️ MOTORCYCLES BLOCK
    case "motorcycles":
      return isMotorcyclesDomain;
    case "sport":
    case "cruiser":
      return isMotorcyclesDomain && sub.includes(tab);
    case "offroad":
      return isMotorcyclesDomain && (sub.includes("offroad") || sub.includes("off-road"));
    case "scooter":
      return isMotorcyclesDomain && (sub.includes("scooter") || sub.includes("moped"));

    // ⚓ WATERCRAFT BLOCK
    case "marine":
    case "watercraft":
      return isMarineDomain;
    case "center-console":
      return isMarineDomain && (sub.includes("center-console") || sub.includes("center console"));
    case "yacht":
      return isMarineDomain && sub.includes("yacht");
    case "catamaran":
      return isMarineDomain && (sub.includes("catamaran") || sub.includes("sail"));
    case "jetski":
      return isMarineDomain && (sub.includes("jetski") || sub.includes("jet ski") || sub.includes("pwc"));
    case "cruiser":
      return isMarineDomain && sub.includes("cruiser");

    // 🗺️ LAND BLOCK
    case "land":
      return isLandDomain;
    case "residential":
    case "lots":
    case "acreage":
      return isLandDomain && sub.includes(tab);
    case "commercial-land":
      return isLandDomain && (sub.includes("commercial-land") || sub.includes("commercial land"));
    case "farm":
      return isLandDomain && (sub.includes("farm") || sub.includes("ranch"));

    // 🏠 HOMES BLOCK
    case "homes":
    case "property":
      return isHomesDomain;
    case "forsale":
      return isHomesDomain && (sub.includes("forsale") || sub.includes("for sale"));
    case "forrent":
      return isHomesDomain && (sub.includes("forrent") || sub.includes("for rent"));
    case "villas":
    case "apartments":
      return isHomesDomain && sub.includes(tab);

    // 🐾 PETS BLOCK
    case "pets":
      return isPetsDomain;
    case "dogs":
    case "cats":
    case "birds":
    case "horses":
      return isPetsDomain && sub.includes(tab);
    case "other-pets":
      return isPetsDomain && (sub.includes("other") || sub.includes("rare"));

    // 🏢 RENTALS BLOCK
    case "rentals":
      return isRentalsDomain;
    case "shortterm":
      return isRentalsDomain && (sub.includes("shortterm") || sub.includes("short term"));
    case "longterm":
      return isRentalsDomain && (sub.includes("longterm") || sub.includes("long term"));
    case "vacation":
      return isRentalsDomain && sub.includes(tab);

    // 🛏️ ROOMS BLOCK
    case "rooms":
      return isRoomsDomain;
    case "private":
    case "shared":
      return isRoomsDomain && sub.includes(tab);

    // 🪛 SERVICES BLOCK
    case "services":
      return isServicesDomain;
    case "home-services":
      return isServicesDomain && (sub.includes("home-services") || sub.includes("home services"));
    case "auto-services":
      return isServicesDomain && (sub.includes("auto-services") || sub.includes("auto services"));
    case "tech":
      return isServicesDomain && (sub.includes("tech") || sub.includes("technical"));
    case "concierge":
      return isServicesDomain && (sub.includes("concierge") || sub.includes("elite"));

    // 📅 TIMESHARE BLOCK
    case "timeshare":
      return isTimeshareDomain;
    case "rent":
    case "sell":
      return isTimeshareDomain && sub.includes(tab);

    // 📦 GENERAL MARKET CATCH-ALL
    case "general":
      if (isPremiumAsset || isCaribbean) return false;
      return true;

    // Specific General subcategories mapping
    case "electronics":
    case "furniture":
    case "appliances":
      return !isPremiumAsset && sub.includes(tab);
    case "watches":
      return !isPremiumAsset && (sub.includes("watches") || sub.includes("luxury") || cat === "watches");
    case "jewelry":
      return !isPremiumAsset && (sub.includes("jewelry") || sub.includes("fine") || cat === "jewelry");
    case "other-general":
      return !isPremiumAsset && (sub.includes("other") || sub.includes("miscellaneous"));

    default:
      return cat === tab || sub === tab || sub.includes(tab);
  }
}
