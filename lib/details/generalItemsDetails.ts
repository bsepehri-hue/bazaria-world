import { DetailConfig } from "@/types/DetailConfig";

export const generalItemsDetails: DetailConfig = {
  layout: [
    {
      title: "Overview",
      fields: ["title", "price", "condition", "category"],
    },
    {
      title: "Description",
      fields: ["description"],
    },
    {
      title: "Item Details",
      fields: ["brand"],
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
    condition: {
      variant: "badge",
      colorMap: {
        "New": "emerald",
        "Like New": "emerald",
        "Good": "teal",
        "Fair": "amber",
        "Poor": "burgundy",
      },
    },
    category: {
      variant: "text",
    },
    description: {
      variant: "paragraph",
    },
    brand: {
      variant: "text",
      emptyState: "No brand specified",
    },
    images: {
      variant: "gallery",
    },
  },
};
