import * as pets from "./pets";
import * as art from "./art";

export const MARKET_CATEGORIES = [
  {
    id: "cars",
    label: "Cars",
    icon: "🚗",
    subcategories: [
      { id: "sedan", label: "Sedan" },
      { id: "suv", label: "SUV" },
      { id: "coupe", label: "Coupe" },
      { id: "convertible", label: "Convertible" },
      { id: "truck", label: "Pickup Truck" },
      { id: "van", label: "Van" },
    ],
  },

  {
    id: "trucks",
    label: "Trucks",
    icon: "🚚",
    subcategories: [
      { id: "light-duty", label: "Light Duty" },
      { id: "heavy-duty", label: "Heavy Duty" },
      { id: "box-truck", label: "Box Truck" },
      { id: "flatbed", label: "Flatbed" },
      { id: "semi", label: "Semi Truck" },
    ],
  },

  {
    id: "rvs",
    label: "RVs",
    icon: "🚐",
    subcategories: [
      { id: "class-a", label: "Class A" },
      { id: "class-b", label: "Class B" },
      { id: "class-c", label: "Class C" },
      { id: "travel-trailer", label: "Travel Trailer" },
      { id: "fifth-wheel", label: "Fifth Wheel" },
    ],
  },

  {
    id: "motorcycles",
    label: "Motorcycles",
    icon: "🏍️",
    subcategories: [
      { id: "sport", label: "Sport Bike" },
      { id: "cruiser", label: "Cruiser" },
      { id: "touring", label: "Touring" },
      { id: "dirt", label: "Dirt Bike" },
      { id: "scooter", label: "Scooter" },
    ],
  },

  {
    id: "homes",
    label: "Homes",
    icon: "🏡",
    subcategories: [
      { id: "single-family", label: "Single Family" },
      { id: "condo", label: "Condo" },
      { id: "townhouse", label: "Townhouse" },
      { id: "multi-family", label: "Multi‑Family" },
      { id: "mobile-home", label: "Mobile Home" },
    ],
  },

  {
    id: "land",
    label: "Land",
    icon: "🌄",
    subcategories: [
      { id: "residential", label: "Residential Land" },
      { id: "commercial", label: "Commercial Land" },
      { id: "agricultural", label: "Agricultural Land" },
      { id: "industrial", label: "Industrial Land" },
      { id: "lots", label: "Lots & Parcels" },
    ],
  },

  {
    id: "rentals",
    label: "Rentals",
    icon: "🏘️",
    subcategories: [
      { id: "apartment", label: "Apartment" },
      { id: "house", label: "House" },
      { id: "condo", label: "Condo" },
      { id: "studio", label: "Studio" },
      { id: "shared", label: "Shared Housing" },
    ],
  },

  {
    id: "rooms",
    label: "Rooms",
    icon: "🚪",
    subcategories: [
      { id: "private-room", label: "Private Room" },
      { id: "shared-room", label: "Shared Room" },
      { id: "short-term", label: "Short‑Term" },
      { id: "long-term", label: "Long‑Term" },
    ],
  },

  {
    id: "timeshare",
    label: "Timeshare",
    icon: "⏳",
    subcategories: [
      { id: "for-sale", label: "For Sale" },
      { id: "for-rent", label: "For Rent" },
      { id: "weekly", label: "Weekly" },
      { id: "points", label: "Points‑Based" },
    ],
  },

  {
    id: "general",
    label: "General",
    icon: "📦",
    subcategories: [
      { id: "electronics", label: "Electronics" },
      { id: "furniture", label: "Furniture" },
      { id: "appliances", label: "Appliances" },
      { id: "clothing", label: "Clothing" },
      { id: "tools", label: "Tools" },
    ],
  },

  {
    id: "services",
    label: "Services",
    icon: "🛠️",
    subcategories: [
      { id: "home", label: "Home Services" },
      { id: "auto", label: "Auto Services" },
      { id: "lessons", label: "Lessons & Coaching" },
      { id: "events", label: "Event Services" },
      { id: "repair", label: "Repair Services" },
    ],
  },

  // Pets (already structured)
  {
    id: "pets",
    label: "Pets",
    icon: "🐾",
    ...pets,
  },

  // Art (already structured)
  {
    id: "art",
    label: "Art",
    icon: "🎨",
    ...art,
  },
];

export default MARKET_CATEGORIES;
