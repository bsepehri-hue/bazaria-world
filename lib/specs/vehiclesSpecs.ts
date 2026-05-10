import { FieldSpec } from "@/types/FieldSpec";

export const vehiclesSpecs: Record<string, FieldSpec> = {
  title: {
    label: "Title",
    type: "text",
    required: true,
    placeholder: "e.g., 2018 Honda Civic LX",
    filter: "text",
  },

  description: {
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the vehicle clearly...",
  },

  price: {
    label: "Price",
    type: "number",
    required: true,
    min: 0,
    filter: "range",
  },

  make: {
    label: "Make",
    type: "text",
    required: true,
    placeholder: "e.g., Toyota, Ford, BMW",
    filter: "text",
  },

  model: {
    label: "Model",
    type: "text",
    required: true,
    placeholder: "e.g., Camry, F-150, 3 Series",
    filter: "text",
  },

  year: {
    label: "Year",
    type: "number",
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
    filter: "range",
  },

  mileage: {
    label: "Mileage",
    type: "number",
    required: true,
    min: 0,
    filter: "range",
  },

  condition: {
    label: "Condition",
    type: "select",
    required: true,
    options: [
      "New",
      "Like New",
      "Excellent",
      "Good",
      "Fair",
      "Needs Work",
    ],
    filter: "select",
  },

  fuelType: {
    label: "Fuel Type",
    type: "select",
    required: true,
    options: [
      "Gasoline",
      "Diesel",
      "Hybrid",
      "Electric",
      "Other",
    ],
    filter: "select",
  },

  transmission: {
    label: "Transmission",
    type: "select",
    required: true,
    options: [
      "Automatic",
      "Manual",
      "CVT",
      "Other",
    ],
    filter: "select",
  },

  vin: {
    label: "VIN",
    type: "text",
    required: false,
    placeholder: "Vehicle Identification Number (optional)",
  },

  category: {
    label: "Category",
    type: "select",
    required: true,
    options: [
      "Cars",
      "Trucks",
      "Motorcycles",
      "RVs",
    ],
    filter: "select",
  },

  images: {
    label: "Images",
    type: "image-upload",
    required: false,
    max: 20,
  },
};
