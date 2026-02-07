import { FormConfig } from "@/types/FormConfig";

export const realEstateForm: FormConfig = {
  order: [
    "title",
    "description",
    "price",
    "propertyType",
    "address",
    "city",
    "state",
    "zipCode",
    "bedrooms",
    "bathrooms",
    "squareFeet",
    "lotSize",
    "yearBuilt",
    "leaseTerm",
    "deposit",
    "utilitiesIncluded",
    "roomType",
    "bathroomAccess",
    "acreage",
    "zoning",
    "weekNumber",
    "maintenanceFee",
    "images",
  ],

  sections: [
    {
      title: "Basic Information",
      fields: ["title", "description", "propertyType"],
    },
    {
      title: "Location",
      fields: ["address", "city", "state", "zipCode"],
    },
    {
      title: "Property Details",
      fields: [
        "bedrooms",
        "bathrooms",
        "squareFeet",
        "lotSize",
        "yearBuilt",
        "acreage",
        "zoning",
      ],
    },
    {
      title: "Rental Details",
      fields: ["leaseTerm", "deposit", "utilitiesIncluded"],
    },
    {
      title: "Room Details",
      fields: ["roomType", "bathroomAccess"],
    },
    {
      title: "Timeshare Details",
      fields: ["weekNumber", "maintenanceFee"],
    },
    {
      title: "Pricing",
      fields: ["price"],
    },
    {
      title: "Photos",
      fields: ["images"],
    },
  ],

  defaults: {
    utilitiesIncluded: false,
  },

  validation: {
    title: {
      minLength: 3,
      maxLength: 120,
    },
    description: {
      minLength: 10,
      maxLength: 5000,
    },
    price: {
      min: 0,
      max: 999999999,
    },
    bedrooms: {
      min: 0,
      max: 50,
    },
    bathrooms: {
      min: 0,
      max: 50,
    },
    squareFeet: {
      min: 0,
      max: 200000,
    },
    lotSize: {
      min: 0,
      max: 10000000,
    },
    yearBuilt: {
      min: 1800,
      max: new Date().getFullYear() + 1,
    },
    acreage: {
      min: 0,
      max: 1000000,
    },
    weekNumber: {
      min: 1,
      max: 52,
    },
    maintenanceFee: {
      min: 0,
      max: 100000,
    },
  },
};
