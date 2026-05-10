import { FormConfig } from "@/types/FormConfig";

export const generalItemsForm: FormConfig = {
  order: [
    "title",
    "description",
    "price",
    "condition",
    "brand",
    "category",
    "images",
  ],

  sections: [
    {
      title: "Basic Information",
      fields: ["title", "description",      "category"],
    },
    {
      title: "Item Details",
      fields: ["condition", "brand"],
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
    condition: "Good",
    brand: "",
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
      max: 999999,
    },
  },
};
