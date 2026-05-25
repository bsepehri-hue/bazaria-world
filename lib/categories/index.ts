import {
  PaintBrush,
  CarSimple,
  SquaresFour,
  House,
  MapTrifold,
  Motorcycle,
  PawPrint,
  Building,
  Bed,
  Van,
  Wrench,
  Calendar,
  Truck,
  Watch,
  HardHat,
  DiamondsFour,
  Anchor // ⚓ EXTENSION: Native Phosphor Anchor Icon for Marine Registry
} from "@phosphor-icons/react/dist/ssr";

// 1) ICON REGISTRY
export const CategoryIcons = {
  art: PaintBrush,
  cars: CarSimple,
  general: SquaresFour,
  homes: House,
  land: MapTrifold,
  motorcycles: Motorcycle,
  pets: PawPrint,
  rentals: Building,
  rooms: Bed,
  rvs: Van,
  services: Wrench,
  timeshare: Calendar,
  trucks: Truck,
  watches: Watch,
  jewelry: DiamondsFour,
  industrial: HardHat,
  marine: Anchor, // ⚓ EXTENSION: Linked to the marine token
};

// 2) CATEGORY REGISTRY
export const MARKET_CATEGORIES = [
  {
    id: "art",
    label: "Art",
    icon: CategoryIcons.art,
    subcategories: [
      { id: "paintings", label: "Paintings" },
      { id: "sculptures", label: "Sculptures" },
      { id: "prints", label: "Prints" },
      { id: "digital", label: "Digital Art - NFTs" },
      { id: "other-art", label: "Other - Unique Art" },
    ],
  },
  {
    id: "cars",
    label: "Cars",
    icon: CategoryIcons.cars,
    subcategories: [
      { id: "ev", label: "Electric Vehicles (EV)" },
      { id: "sedan", label: "Sedan" },
      { id: "suv", label: "SUV" },
      { id: "coupe", label: "Coupe" },
      { id: "minivan", label: "Minivan" },
      { id: "convertible", label: "Convertible" },
      { id: "exotic", label: "Exotic - Luxury" },
    ],
  },
  {
    id: "trucks",
    label: "Trucks",
    icon: CategoryIcons.trucks,
    subcategories: [
      { id: "pickup", label: "Pickup" },
      { id: "commercial", label: "Commercial - Fleet" },
      { id: "semi-trailer", label: "Semi-Trailer" },
      { id: "box-truck", label: "Box Truck" },
      { id: "dump-truck", label: "Dump Truck" },
      { id: "flatbed", label: "Flatbed" },
    ],
  },
  {
    id: "rvs",
    label: "RVs",
    icon: CategoryIcons.rvs,
    subcategories: [
      { id: "classa", label: "Class A" },
      { id: "classc", label: "Class C" },
      { id: "motorhome", label: "Motorhome" },
      { id: "traveltrailer", label: "Travel Trailer" },
      { id: "campervan", label: "Camper Van" },
    ],
  },
  {
    id: "motorcycles",
    label: "Motorcycles",
    icon: CategoryIcons.motorcycles,
    subcategories: [
      { id: "sport", label: "Sport" },
      { id: "cruiser", label: "Cruiser" },
      { id: "offroad", label: "Off-Road" },
      { id: "scooter", label: "Scooter - Moped" },
    ],
  },
  // ⚓ EXTENSION: NEW MARINE & WATERCRAFT VERTICAL INJECTED NATIVELY INTO FLOW
  {
    id: "marine",
    label: "Watercraft",
    icon: CategoryIcons.marine,
    subcategories: [
      { id: "center-console", label: "Center Console" },
      { id: "yacht", label: "Luxury Yacht" },
      { id: "catamaran", label: "Catamaran / Sail" },
      { id: "jetski", label: "Jet Ski / PWC" },
      { id: "cruiser", label: "Express Cruiser" },
    ],
  },
  {
    id: "land",
    label: "Land",
    icon: CategoryIcons.land,
    subcategories: [
      { id: "residential", label: "Residential" },
      { id: "commercial-land", label: "Commercial Land" },
      { id: "lots", label: "Lots - Land" },
      { id: "acreage", label: "Acreage" },
      { id: "farm", label: "Farm - Ranch" },
    ],
  },
  {
    id: "homes",
    label: "Homes",
    icon: CategoryIcons.homes,
    subcategories: [
      { id: "forsale", label: "For Sale" },
      { id: "forrent", label: "For Rent" },
      { id: "villas", label: "Villas" },
      { id: "apartments", label: "Apartments" },
      { id: "sanctuary", label: "Caribbean Sanctuary" },
    ],
  },
  {
    id: "pets",
    label: "Pets",
    icon: CategoryIcons.pets,
    subcategories: [
      { id: "dogs", label: "Dogs" },
      { id: "cats", label: "Cats" },
      { id: "birds", label: "Birds" },
      { id: "horses", label: "Horses" },
      { id: "other-pets", label: "Other - Rare Pets" },
    ],
  },
  {
    id: "rentals",
    label: "Rentals",
    icon: CategoryIcons.rentals,
    subcategories: [
      { id: "shortterm", label: "Short Term" },
      { id: "longterm", label: "Long Term" },
      { id: "vacation", label: "Vacation" },
    ],
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: CategoryIcons.rooms,
    subcategories: [
      { id: "private", label: "Private Rooms" },
      { id: "shared", label: "Shared Rooms" },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: CategoryIcons.services,
    subcategories: [
      { id: "home-services", label: "Home Services" },
      { id: "auto-services", label: "Auto Services" },
      { id: "tech", label: "Technical Services" },
      { id: "concierge", label: "Elite Concierge" },
    ],
  },
  {
    id: "timeshare",
    label: "Timeshare",
    icon: CategoryIcons.timeshare,
    subcategories: [
      { id: "rent", label: "Rent" },
      { id: "sell", label: "Sell" },
    ],
  },
  {
    id: "general",
    label: "General Market",
    icon: CategoryIcons.general,
    subcategories: [
      { id: "electronics", label: "Electronics" },
      { id: "furniture", label: "Furniture" },
      { id: "appliances", label: "Appliances" },
      { id: "watches", label: "Luxury Watches" },
      { id: "jewelry", label: "Fine Jewelry" },
      { id: "other-general", label: "Other - Miscellaneous" },
    ],
  },
];
