import { FormConfig } from "@/types/FormConfig";

export const vehiclesForm: FormConfig = {
  order: [
    "title",
    "description",
    "price",
    "make",
    "model",
    "year",
    "mileage",
    "condition",
    "fuelType",
    "transmission",
    "vin",
    "category",
    "images",
  ],

  sections: [
    {
      title: "Basic Information",
      fields: ["title", "description", "category"],
    },
    {
      title: "Vehicle Details",
      fields: ["make", "model", "year", "mileage", "condition"],
    },
    {
      title: "Specifications",
      fields: ["fuelType", "transmission", "vin"],
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
    fuelType: "Gasoline",
    transmission: "Automatic",
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
      max: 9999999,
    },
    year: {
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    mileage: {
      min: 0,
      max: 2000000,
    },
  },
};
