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
  const cat = (listing.category || "").toLowerCase().trim();
  const sub = (listing.subCategory || "").toLowerCase().trim();
  const loc = (listing.location || "").toLowerCase().trim();
  const city = (listing.city || "").toLowerCase().trim();
  const tab = activeTab.toLowerCase().trim();

  // 1. Strict Caribbean Sanctuary Boundary Check
  const isCaribbean = loc.includes("dominican") || loc.includes("caribbean") || city.includes("dominican") || !!listing.isSanctuaryAsset;
  if (tab === "caribbean") {
    return isCaribbean;
  }
  if (isCaribbean && ["homes", "property", "rentals", "land", "cars", "trucks", "rvs", "motorcycles", "suvs"].includes(tab)) {
    return false; 
  }

  // Helper arrays to identify core business domains clearly
  const isRealEstate = ["homes", "property", "residential", "house", "villa", "villas", "apartment", "apartments", "land", "rentals", "rental", "rooms", "room", "timeshare"].includes(cat) || 
                       ["homes", "property", "residential", "house", "villa", "villas", "apartment", "apartments", "land", "rentals", "rental", "rooms", "room", "timeshare"].includes(sub) ||
                       !!listing.isPropertyAsset || !!listing.isLandAsset;

  const isVehicleDomain = ["cars", "car", "mobility", "vehicles", "vehicle", "trucks", "truck", "pickup", "commercial", "fleet", "rv", "rvs", "camper", "trailer", "motorhome", "motorcycles", "motorcycle", "moto", "bike", "scooter", "moped", "atv", "utv", "offroad", "suv", "suvs"].includes(cat) ||
                          ["cars", "car", "mobility", "vehicles", "vehicle", "trucks", "truck", "pickup", "commercial", "fleet", "rv", "rvs", "camper", "trailer", "motorhome", "motorcycles", "motorcycle", "moto", "bike", "scooter", "moped", "atv", "utv", "offroad", "suv", "suvs"].includes(sub);

  const isMarineDomain = ["marine", "watercraft", "boat", "boats", "yacht", "yachts", "vessel", "jet ski", "jetski"].includes(cat) ||
                         ["marine", "watercraft", "boat", "boats", "yacht", "yachts", "vessel", "jet ski", "jetski"].includes(sub) ||
                         !!listing.isMarineAsset;

  const isArtDomain = ["art", "painting", "sculpture", "nft", "digital art"].includes(cat) || ["art", "painting", "sculpture", "nft", "digital art"].includes(sub);
  const isPetDomain = ["pets", "pet", "dog", "dogs", "cat", "cats", "animal", "animals"].includes(cat) || ["pets", "pet", "dog", "dogs", "cat", "cats", "animal", "animals"].includes(sub);
  const isServiceDomain = ["services", "service", "cleaning", "maintenance", "contractor"].includes(cat) || ["services", "service", "cleaning", "maintenance", "contractor"].includes(sub);

  // 2. Pure Mechanical Routing Matrix
  switch (tab) {
    case "all":
      return true;

    case "cars":
    case "mobility":
    case "vehicles":
      return cat === "cars" || cat === "car" || cat === "mobility" || cat === "vehicles" ||
             sub === "cars" || sub === "car" || sub === "sedan" || sub === "coupe";

    case "trucks":
    case "truck":
      return cat === "trucks" || cat === "truck" || cat === "commercial" || 
             sub === "trucks" || sub === "truck" || sub === "pickup" || sub === "commercial fleet" || sub === "fleet";

    case "rvs":
    case "rv":
      return cat === "rvs" || cat === "rv" || cat === "camper" || 
             sub === "rvs" || sub === "rv" || sub === "camper" || sub === "travel trailer" || sub === "motorhome";

    case "motorcycles":
    case "motorcycle":
      return cat === "motorcycles" || cat === "motorcycle" || cat === "scooter" || cat === "moped" || cat === "bike" ||
             sub === "motorcycles" || sub === "motorcycle" || sub === "scooter" || sub === "moped" || sub === "bike" || sub === "atv" || sub === "utv" || sub === "offroad" || sub === "moto";

    case "suvs":
    case "suv":
      return cat === "suv" || cat === "suvs" || sub === "suv" || sub === "suvs";

    case "marine":
    case "watercraft":
      return isMarineDomain;

    case "art":
      return isArtDomain;

    case "pets":
    case "pet":
      return isPetDomain;

    case "services":
    case "service":
      return isServiceDomain;

    case "homes":
    case "property":
      return (cat === "homes" || cat === "property" || cat === "residential") || 
             (sub === "homes" || sub === "house" || sub === "villa" || sub === "apartment") || 
             (!!listing.isPropertyAsset && !isCaribbean);

    case "land":
      return cat === "land" || sub === "land" || !!listing.isLandAsset;

    case "rentals":
      return cat === "rentals" || cat === "rental" || sub === "rentals" || sub === "rental";

    case "rooms":
      return cat === "rooms" || cat === "room" || sub === "room" || sub === "rooms";

    case "timeshare":
      return cat === "timeshare" || sub === "timeshare";

    // 📦 GENERAL TAB CATCH-ALL PROTECTION:
    // If an asset does not belong to any premium vertical above, it populates here.
    case "general":
      if (isRealEstate || isVehicleDomain || isMarineDomain || isArtDomain || isPetDomain || isServiceDomain || isCaribbean) {
        return false;
      }
      return true;

    default:
      // Subcategory fallback engine: check if the tab directly matches either field exactly
      return cat === tab || sub === tab;
  }
}
