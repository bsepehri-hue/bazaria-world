// lib/categories/index.ts

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
} from "@phosphor-icons/react/dist/ssr";

// 1) ICON REGISTRY (Phosphor, thin-line, premium)
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
};

// 2) CATEGORY REGISTRY (13 categories, each with subcategories)
export const MARKET_CATEGORIES = [
  {
    id: "art",
    label: "Art",
    icon: CategoryIcons.art,
    sub: [
      { id: "paintings", label: "Paintings" },
      { id: "sculptures", label: "Sculptures" },
      { id: "prints", label: "Prints" },
    ],
  },
  {
    id: "cars",
    label: "Cars",
    icon: CategoryIcons.cars,
    sub: [
      { id: "sedan", label: "Sedan" },
      { id: "suv", label: "SUV" },
      { id: "coupe", label: "Coupe" },
    ],
  },
  {
    id: "trucks",
    label: "Trucks",
    icon: CategoryIcons.trucks,
    sub: [
      { id: "pickup", label: "Pickup" },
      { id: "commercial", label: "Commercial" },
    ],
  },
  {
    id: "rvs",
    label: "RVs",
    icon: CategoryIcons.rvs,
    sub: [
      { id: "classa", label: "Class A" },
      { id: "classc", label: "Class C" },
    ],
  },
  {
    id: "pets",
    label: "Pets",
    icon: CategoryIcons.pets,
    sub: [
      { id: "dogs", label: "Dogs" },
      { id: "cats", label: "Cats" },
      { id: "birds", label: "Birds" },
    ],
  },
  {
    id: "rentals",
    label: "Rentals",
    icon: CategoryIcons.rentals,
    sub: [
      { id: "shortterm", label: "Short Term" },
      { id: "longterm", label: "Long Term" },
    ],
  },
  {
    id: "homes",
    label: "Homes",
    icon: CategoryIcons.homes,
    sub: [
      { id: "forsale", label: "For Sale" },
      { id: "forrent", label: "For Rent" },
    ],
  },
  {
    id: "land",
    label: "Land",
    icon: CategoryIcons.land,
    sub: [
      { id: "residential", label: "Residential" },
      { id: "commercial", label: "Commercial" },
    ],
  },
  {
    id: "motorcycles",
    label: "Motorcycles",
    icon: CategoryIcons.motorcycles,
    sub: [
      { id: "sport", label: "Sport" },
      { id: "cruiser", label: "Cruiser" },
    ],
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: CategoryIcons.rooms,
    sub: [
      { id: "private", label: "Private Rooms" },
      { id: "shared", label: "Shared Rooms" },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: CategoryIcons.services,
    sub: [
      { id: "home", label: "Home Services" },
      { id: "auto", label: "Auto Services" },
    ],
  },
  {
    id: "timeshare",
    label: "Timeshare",
    icon: CategoryIcons.timeshare,
    sub: [
      { id: "rent", label: "Rent" },
      { id: "sell", label: "Sell" },
    ],
  },
  {
    id: "general",
    label: "General",
    icon: CategoryIcons.general,
    sub: [
      { id: "electronics", label: "Electronics" },
      { id: "furniture", label: "Furniture" },
      { id: "appliances", label: "Appliances" },
    ],
  },
];
