import { DetailConfig } from "@/types/DetailConfig";

export const realEstateDetails: DetailConfig = {
  layout: [
    {
      title: "Overview",
      fields: [
        "title",
        "price",
        "propertyType",
        "address",
        "city",
        "state",
        "zipCode",
      ],
    },
    {
      title: "Description",
      fields: ["description"],
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
      title: "Photos",
      fields: ["images"],
    },
  ],

  display: {
    title: {
      variant: "heading",
    },
    price: {
      variant: "price",
      prefix: "$",
    },
    propertyType: {
      variant: "badge",
      colorMap: {
        Homes: "teal",
        Rentals: "emerald",
        Rooms: "amber",
        Land: "teal",
        Timeshare: "burgundy",
      },
    },
    address: {
      variant: "text",
    },
    city: {
      variant: "text",
    },
    state: {
      variant: "text",
    },
    zipCode: {
      variant: "text",
    },
    description: {
      variant: "paragraph",
    },
    bedrooms: {
      variant: "text",
      suffix: " bd",
      emptyState: "—",
    },
    bathrooms: {
      variant: "text",
      suffix: " ba",
      emptyState: "—",
    },
    squareFeet: {
      variant: "text",
      suffix: " sq ft",
      emptyState: "—",
    },
    lotSize: {
      variant: "text",
      suffix: " sq ft",
      emptyState: "—",
    },
    yearBuilt: {
      variant: "text",
      emptyState: "—",
    },
    leaseTerm: {
      variant: "text",
      emptyState: "—",
    },
    deposit: {
      variant: "price",
      prefix: "$",
      emptyState: "—",
    },
    utilitiesIncluded: {
      variant: "boolean",
      trueLabel: "Yes",
      falseLabel: "No",
      emptyState: "—",
    },
    roomType: {
      variant: "text",
      emptyState: "—",
    },
    bathroomAccess: {
      variant: "text",
      emptyState: "—",
    },
    acreage: {
      variant: "text",
      suffix: " acres",
      emptyState: "—",
    },
    zoning: {
      variant: "text",
      emptyState: "—",
    },
    weekNumber: {
      variant: "text",
      prefix: "Week ",
      emptyState: "—",
    },
    maintenanceFee: {
      variant: "price",
      prefix: "$",
      emptyState: "—",
    },
    images: {
      variant: "gallery",
    },
  },
};
