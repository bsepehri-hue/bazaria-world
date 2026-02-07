import { DetailConfig } from "@/types/DetailConfig";

export const vehiclesDetails: DetailConfig = {
  layout: [
    {
      title: "Overview",
      fields: ["title", "price", "make", "model", "year", "mileage", "condition", "category"],
    },
    {
      title: "Description",
      fields: ["description"],
    },
    {
      title: "Specifications",
      fields: ["fuelType", "transmission", "vin"],
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
    make: {
      variant: "text",
    },
    model: {
      variant: "text",
    },
    year: {
      variant: "text",
    },
    mileage: {
      variant: "text",
      suffix: " miles",
    },
    condition: {
      variant: "badge",
      colorMap: {
        "New": "emerald",
        "Like New": "emerald",
        "Excellent": "teal",
        "Good": "teal",
        "Fair": "amber",
        "Needs Work": "burgundy",
      },
    },
    category: {
      variant: "text",
    },
    description: {
      variant: "paragraph",
    },
    fuelType: {
      variant: "text",
    },
    transmission: {
      variant: "text",
    },
    vin: {
      variant: "text",
      emptyState: "No VIN provided",
    },
    images: {
      variant: "gallery",
    },
  },
};
