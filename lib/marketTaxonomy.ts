// 📁 lib/marketTaxonomy.ts
// THE CENTRAL STABILIZED ROUTER FOR BAZARIA GLOBAL REGISTRIES

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
  // Normalize live database properties cleanly to match category registry definitions
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
  // Enforce rigid containment rules: if an asset belongs to the Caribbean Sanctuary, don't let it drift into standard tabs
  if (isCaribbean && ["homes", "property", "rentals", "land", "cars", "general"].includes(tab)) {
    return false;
  }

  // Define hard sets mapping exactly to your category model to explicitly determine premium classification groups
  const premiumCategories = ["art", "cars", "trucks", "rvs", "motorcycles", "marine", "land", "homes", "pets", "rentals", "rooms", "services", "timeshare"];
  
  const premiumSubcategories = [
    "paintings", "sculptures", "prints", "digital", "other-art",
    "ev", "sedan", "suv", "coupe", "minivan", "convertible", "exotic",
    "pickup", "commercial", "semi-trailer", "box-truck", "dump-truck", "flatbed",
    "classa", "classc", "motorhome", "traveltrailer", "campervan",
    "sport", "cruiser", "offroad", "scooter",
    "center-console", "yacht", "catamaran", "jetski",
    "residential", "commercial-land", "lots", "acreage", "farm",
    "forsale", "forrent", "villas", "apartments", "sanctuary",
    "dogs", "cats", "birds", "horses", "other-pets",
    "shortterm", "longterm", "vacation",
    "private", "shared",
    "home-services", "auto-services", "tech", "concierge",
    "rent", "sell"
  ];

  // Check if an item is explicitly classified under a premium group
  const isPremiumAsset = premiumCategories.includes(cat) || premiumSubcategories.includes(sub) || 
                         !!listing.isPropertyAsset || !!listing.isLandAsset || !!listing.isMarineAsset;

  // 🕹️ 2. Pure Mechanical Routing Evaluation Matrix
  switch (tab) {
    case "all":
      return true;

    case "art":
      return cat === "art" || ["paintings", "sculptures", "prints", "digital", "other-art"].includes(sub);

    case "cars":
      return cat === "cars" || ["ev", "sedan", "suv", "coupe", "minivan", "convertible", "exotic"].includes(sub);

    case "trucks":
      return cat === "trucks" || ["pickup", "commercial", "semi-trailer", "box-truck", "dump-truck", "flatbed"].includes(sub);

    case "rvs":
      return cat === "rvs" || ["classa", "classc", "motorhome", "traveltrailer", "campervan"].includes(sub);

    case "motorcycles":
      return cat === "motorcycles" || ["sport", "cruiser", "offroad", "scooter"].includes(sub);

    case "marine":
      return cat === "marine" || ["center-console", "yacht", "catamaran", "jetski"].includes(sub) || !!listing.isMarineAsset;

    case "land":
      return cat === "land" || ["residential", "commercial-land", "lots", "acreage", "farm"].includes(sub) || !!listing.isLandAsset;

    case "homes":
      return cat === "homes" || ["forsale", "forrent", "villas", "apartments"].includes(sub) || !!listing.isPropertyAsset;

    case "pets":
      return cat === "pets" || ["dogs", "cats", "birds", "horses", "other-pets"].includes(sub);

    case "rentals":
      return cat === "rentals" || ["shortterm", "longterm", "vacation"].includes(sub);

    case "rooms":
      return cat === "rooms" || ["private", "shared"].includes(sub);

    case "services":
      return cat === "services" || ["home-services", "auto-services", "tech", "concierge"].includes(sub);

    case "timeshare":
      return cat === "timeshare" || ["rent", "sell"].includes(sub);

    // 📦 GENERAL MARKET CATCH-ALL PROTECTION:
    // If an asset belongs to a premium category group, it is forbidden from entering the General grid.
    case "general":
      if (isPremiumAsset || isCaribbean) return false;
      return true;

    // 🎯 SUBCATEGORY SUB-ROUTING GATEWAY:
    // If a user clicks an explicit subcategory item directly (like "scooter" or "yacht"),
    // verify the database field equals that ID string with zero room for error.
    default:
      return cat === tab || sub === tab;
  }
}
