"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CategoryIcons } from "../IconSet";

const categories = [
  {
    id: "cars",
    label: "Cars",
    sub: [
      { id: "sedan", label: "Sedans" },
      { id: "suv", label: "SUVs" },
      { id: "truck", label: "Pickup Trucks" },
      { id: "coupe", label: "Coupes" },
      { id: "convertible", label: "Convertibles" },
      { id: "wagon", label: "Wagons" },
      { id: "van", label: "Vans" },
      { id: "electric", label: "Electric Vehicles" },
      { id: "classic", label: "Classic Cars" }
    ],
  },

  {
    id: "homes",
    label: "Homes",
    sub: [
      { id: "house", label: "Houses" },
      { id: "apartment", label: "Apartments" },
      { id: "condo", label: "Condos" },
      { id: "townhouse", label: "Townhouses" },
      { id: "duplex", label: "Duplex / Triplex" },
      { id: "mobile", label: "Mobile Homes" },
      { id: "luxury", label: "Luxury Homes" }
    ],
  },

  {
    id: "pets",
    label: "Pets",
    sub: [
      { id: "dogs", label: "Dogs" },
      { id: "cats", label: "Cats" },
      { id: "birds", label: "Birds" },
      { id: "reptiles", label: "Reptiles" },
      { id: "small-animals", label: "Small Animals" },
      { id: "fish", label: "Fish & Aquatics" }
    ],
  },

  {
    id: "rentals",
    label: "Rentals",
    sub: [
      { id: "apartment", label: "Apartments" },
      { id: "house", label: "Houses" },
      { id: "condo", label: "Condos" },
      { id: "townhouse", label: "Townhouses" },
      { id: "duplex", label: "Duplex / Triplex" },
      { id: "mobile", label: "Mobile Homes" }
    ],
  },

  {
    id: "rooms",
    label: "Rooms",
    sub: [
      { id: "private-room", label: "Private Room" },
      { id: "shared-room", label: "Shared Room" },
      { id: "master-room", label: "Master Room" },
      { id: "studio", label: "Studio" },
      { id: "private-entrance", label: "Private Entrance" },
      { id: "private-bath", label: "Room with Private Bath" },
      { id: "shared-bath", label: "Room with Shared Bath" }
    ],
  },

  {
    id: "land",
    label: "Land",
    sub: [
      { id: "residential-lots", label: "Residential Lots" },
      { id: "acreage", label: "Acreage" },
      { id: "farmland", label: "Farmland" },
      { id: "rural-land", label: "Rural Land" },
      { id: "commercial-land", label: "Commercial Land" },
      { id: "mixed-use", label: "Mixed‑Use" },
      { id: "industrial-land", label: "Industrial Land" },
      { id: "recreational-land", label: "Recreational Land" }
    ],
  },

  {
    id: "motorcycles",
    label: "Motorcycles",
    sub: [
      { id: "sport", label: "Sport Bikes" },
      { id: "cruiser", label: "Cruisers" },
      { id: "touring", label: "Touring" },
      { id: "adventure", label: "Adventure / Dual‑Sport" },
      { id: "dirt", label: "Dirt Bikes" },
      { id: "scooter", label: "Scooters" },
      { id: "atv", label: "ATVs" },
      { id: "utv", label: "UTVs / Side‑by‑Sides" },
      { id: "three-wheel", label: "Three‑Wheelers" },
      { id: "electric", label: "Electric Motorcycles" }
    ],
  },

  {
    id: "rvs",
    label: "RVs",
    sub: [
      { id: "class-a", label: "Class A" },
      { id: "class-b", label: "Class B" },
      { id: "class-c", label: "Class C" },
      { id: "travel-trailer", label: "Travel Trailers" },
      { id: "fifth-wheel", label: "Fifth Wheels" },
      { id: "toy-hauler", label: "Toy Haulers" },
      { id: "pop-up", label: "Pop‑Up Campers" },
      { id: "truck-camper", label: "Truck Campers" },
      { id: "park-model", label: "Park Models" }
    ],
  },

  {
    id: "trucks",
    label: "Trucks",
    sub: [
      { id: "light-duty", label: "Light‑Duty Pickups" },
      { id: "heavy-duty", label: "Heavy‑Duty Pickups" },
      { id: "work-truck", label: "Work Trucks" },
      { id: "utility-truck", label: "Utility Trucks" },
      { id: "off-road", label: "Off‑Road Trucks" },
      { id: "diesel", label: "Diesel Trucks" },
      { id: "commercial", label: "Commercial Trucks" }
    ],
  },

  {
    id: "timeshare",
    label: "Timeshare",
    sub: [
      { id: "fixed-week", label: "Fixed Week" },
      { id: "floating-week", label: "Floating Week" },
      { id: "points", label: "Points" },
      { id: "fractional", label: "Fractional Ownership" },
      { id: "rtu", label: "Right‑to‑Use (RTU)" },
      { id: "vacation-club", label: "Vacation Clubs" },
      { id: "exchange-eligible", label: "Exchange‑Eligible" }
    ],
  },

  {
    id: "services",
    label: "Services",
    sub: [
      { id: "home-services", label: "Home Services" },
      { id: "skilled-trades", label: "Skilled Trades" },
      { id: "professional", label: "Professional Services" },
      { id: "lessons-coaching", label: "Lessons & Coaching" },
      { id: "beauty-wellness", label: "Beauty & Wellness" },
      { id: "events", label: "Event Services" },
      { id: "automotive", label: "Automotive Services" },
      { id: "tech", label: "Tech Services" },
      { id: "pet-services", label: "Pet Services" },
      { id: "misc", label: "Miscellaneous Services" }
    ],
  },

  {
    id: "general",
    label: "General",
    sub: [
      { id: "electronics", label: "Electronics" },
      { id: "furniture", label: "Furniture" },
      { id: "appliances", label: "Appliances" },
      { id: "clothing", label: "Clothing & Accessories" },
      { id: "sports", label: "Sports & Outdoors" },
      { id: "toys-games", label: "Toys & Games" },
      { id: "tools", label: "Tools & Equipment" },
      { id: "home-goods", label: "Home Goods" },
      { id: "garden", label: "Garden & Patio" },
      { id: "musical", label: "Musical Instruments" },
      { id: "collectibles", label: "Collectibles" },
      { id: "office", label: "Office & Supplies" },
      { id: "misc", label: "Miscellaneous" }
    ],
  },

  {
    id: "art",
    label: "Art",
    sub: [
      { id: "paintings", label: "Paintings" },
      { id: "prints", label: "Prints" },
      { id: "photography", label: "Photography" },
      { id: "drawings", label: "Drawings" },
      { id: "sculpture", label: "Sculpture" },
      { id: "digital-art", label: "Digital Art" },
      { id: "crafts", label: "Handmade Crafts" },
      { id: "decor", label: "Home Decor Art" },
      { id: "collectibles", label: "Art Collectibles" },

      {
        id: "antiques",
        label: "Antiques",
        sub: [
          { id: "furniture", label: "Antique Furniture" },
          { id: "decor", label: "Decorative Arts" },
          { id: "jewelry", label: "Antique Jewelry" },
          { id: "glass-ceramics", label: "Glass & Ceramics" },
          { id: "clocks", label: "Clocks & Timepieces" },
          { id: "maps-books", label: "Maps & Antique Books" },
          { id: "militaria", label: "Militaria & Historical" },
          { id: "religious", label: "Religious & Cultural Artifacts" },
          { id: "collectibles", label: "Vintage Collectibles" }
        ]
      }
    ],
  },
];

export default function CategoryMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const hoverTimeout = useRef<any>(null);

  const handleEnter = (id: string) => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpen(id), 80);
  };

  const handleLeave = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpen(null), 80);
  };

  return (
    <nav className="w-full border-b border-slate-800 bg-black">
      <ul className="flex items-center gap-8 px-8 py-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = CategoryIcons[cat.id];

          return (
            <li
              key={cat.id}
              className="relative group"
              onMouseEnter={() => handleEnter(cat.id)}
              onMouseLeave={handleLeave}
            >
              <Link
                href={`/market/${cat.id}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{cat.label}</span>
              </Link>

              {open === cat.id && cat.sub.length > 0 && (
                <div
                  className="
                    absolute left-0 mt-2 
                    bg-black border border-slate-800 rounded-lg shadow-lg 
                    p-3 space-y-2 z-50 
                    flex flex-col min-w-48
                    opacity-0 translate-y-2 
                    group-hover:opacity-100 group-hover:translate-y-0 
                    transition-all duration-150 ease-out
                  "
                >
                  {cat.sub.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/market/${cat.id}/${sub.id}`}
                      className="block text-slate-300 hover:text-white transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
