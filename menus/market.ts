import {
  faCar,
  faHouse,
  faKey,
  faDoorOpen,
  faMountain,
  faMotorcycle,
  faCaravan,
  faTruck,
  faClock,
  faBriefcase,
  faBox,
  faPaw,
  faPalette
} from "@fortawesome/free-solid-svg-icons";

export const marketMenu = [
  {
    label: "Cars",
    icon: faCar,
    href: "/market/cars",
    children: [
      { label: "Sedans", href: "/market/cars/sedans" },
      { label: "SUVs", href: "/market/cars/suvs" },
      { label: "Trucks", href: "/market/cars/trucks" },
      { label: "Electric", href: "/market/cars/electric" },
      { label: "Luxury", href: "/market/cars/luxury" },
      { label: "Classics", href: "/market/cars/classics" }
    ]
  },

  {
    label: "Homes",
    icon: faHouse,
    href: "/market/homes",
    children: [
      { label: "For Sale", href: "/market/homes/for-sale" },
      { label: "For Rent", href: "/market/homes/for-rent" },
      { label: "Land", href: "/market/homes/land" },
      { label: "Commercial", href: "/market/homes/commercial" }
    ]
  },

  {
    label: "Rentals",
    icon: faKey,
    href: "/market/rentals",
    children: [
      { label: "Short Term", href: "/market/rentals/short-term" },
      { label: "Long Term", href: "/market/rentals/long-term" }
    ]
  },

  {
    label: "Rooms",
    icon: faDoorOpen,
    href: "/market/rooms",
    children: [
      { label: "Private Rooms", href: "/market/rooms/private" },
      { label: "Shared Rooms", href: "/market/rooms/shared" },
      { label: "Studios", href: "/market/rooms/studios" }
    ]
  },

  {
    label: "Land",
    icon: faMountain,
    href: "/market/land",
    children: [
      { label: "Residential Land", href: "/market/land/residential" },
      { label: "Commercial Land", href: "/market/land/commercial" },
      { label: "Agricultural", href: "/market/land/agricultural" }
    ]
  },

  {
    label: "Motorcycles",
    icon: faMotorcycle,
    href: "/market/motorcycles",
    children: [
      { label: "Sport", href: "/market/motorcycles/sport" },
      { label: "Cruiser", href: "/market/motorcycles/cruiser" },
      { label: "Touring", href: "/market/motorcycles/touring" }
    ]
  },

  {
    label: "RVs",
    icon: faCaravan,
    href: "/market/rvs",
    children: [
      { label: "Class A", href: "/market/rvs/class-a" },
      { label: "Class B", href: "/market/rvs/class-b" },
      { label: "Class C", href: "/market/rvs/class-c" }
    ]
  },

  {
    label: "Trucks",
    icon: faTruck,
    href: "/market/trucks",
    children: [
      { label: "Pickup Trucks", href: "/market/trucks/pickup" },
      { label: "Heavy Duty", href: "/market/trucks/heavy-duty" }
    ]
  },

  {
    label: "Timeshare",
    icon: faClock,
    href: "/market/timeshare",
    children: [
      { label: "For Sale", href: "/market/timeshare/for-sale" },
      { label: "For Rent", href: "/market/timeshare/for-rent" }
    ]
  },

  {
    label: "Services",
    icon: faBriefcase,
    href: "/market/services",
    children: [
      { label: "Home Services", href: "/market/services/home" },
      { label: "Auto Services", href: "/market/services/auto" },
      { label: "Business Services", href: "/market/services/business" }
    ]
  },

  {
    label: "General",
    icon: faBox,
    href: "/market/general",
    children: [
      { label: "Electronics", href: "/market/general/electronics" },
      { label: "Furniture", href: "/market/general/furniture" },
      { label: "Clothing", href: "/market/general/clothing" },
      { label: "Misc", href: "/market/general/misc" }
    ]
  },

  {
    label: "Pets",
    icon: faPaw,
    href: "/market/pets",
    children: [
      { label: "Dogs", href: "/market/pets/dogs" },
      { label: "Cats", href: "/market/pets/cats" },
      { label: "Birds", href: "/market/pets/birds" },
      { label: "Fish", href: "/market/pets/fish" }
    ]
  },

  {
    label: "Art",
    icon: faPalette,
    href: "/market/art",
    children: [
      { label: "Paintings", href: "/market/art/paintings" },
      { label: "Prints", href: "/market/art/prints" },
      { label: "Sculptures", href: "/market/art/sculptures" }
    ]
  }
];
