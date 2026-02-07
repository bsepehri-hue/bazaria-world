import { FieldSpec } from "@/types/FieldSpec";

export const realEstateSpecs: Record<string, FieldSpec> = {
  title: {
    label: "Title",
    type: "text",
    required: true,
    placeholder: "e.g., 3‑Bedroom Home in Glendale",
    filter: "text",
  },

  description: {
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the property clearly...",
  },

  price: {
    label: "Price",
    type: "number",
    required: true,
    min: 0,
    filter: "range",
  },

  propertyType: {
    label: "Property Type",
    type: "select",
    required: true,
    options: ["Homes", "Rentals", "Rooms", "Land", "Timeshare"],
    filter: "select",
  },

  address: {
    label: "Address",
    type: "text",
    required: true,
    placeholder: "Street address",
  },

  city: {
    label: "City",
    type: "text",
    required: true,
  },

  state: {
    label: "State",
    type: "text",
    required: true,
  },

  zipCode: {
    label: "ZIP Code",
    type: "text",
    required: true,
    filter: "text",
  },

  bedrooms: {
    label: "Bedrooms",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { propertyType: ["Homes", "Rentals", "Rooms"] },
  },

  bathrooms: {
    label: "Bathrooms",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { propertyType: ["Homes", "Rentals", "Rooms"] },
  },

  squareFeet: {
    label: "Square Feet",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { propertyType: ["Homes", "Rentals", "Rooms"] },
  },

  lotSize: {
    label: "Lot Size (sq ft)",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { propertyType: ["Homes", "Land"] },
  },

  yearBuilt: {
    label: "Year Built",
    type: "number",
    required: false,
    min: 1800,
    max: new Date().getFullYear() + 1,
    filter: "range",
    showIf: { propertyType: ["Homes"] },
  },

  leaseTerm: {
    label: "Lease Term",
    type: "text",
    required: false,
    placeholder: "e.g., 12 months",
    showIf: { propertyType: ["Rentals"] },
  },

  deposit: {
    label: "Deposit",
    type: "number",
    required: false,
    min: 0,
    showIf: { propertyType: ["Rentals"] },
  },

  utilitiesIncluded: {
    label: "Utilities Included",
    type: "boolean",
    required: false,
    showIf: { propertyType: ["Rentals"] },
  },

  roomType: {
    label: "Room Type",
    type: "select",
    required: false,
    options: ["Private", "Shared"],
    showIf: { propertyType: ["Rooms"] },
  },

  bathroomAccess: {
    label: "Bathroom Access",
    type: "select",
    required: false,
    options: ["Private", "Shared"],
    showIf: { propertyType: ["Rooms"] },
  },

  acreage: {
    label: "Acreage",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
    showIf: { propertyType: ["Land"] },
  },

  zoning: {
    label: "Zoning",
    type: "text",
    required: false,
    showIf: { propertyType: ["Land"] },
  },

  weekNumber: {
    label: "Timeshare Week Number",
    type: "number",
    required: false,
    min: 1,
    max: 52,
    showIf: { propertyType: ["Timeshare"] },
  },

  maintenanceFee: {
    label: "Maintenance Fee",
    type: "number",
    required: false,
    min: 0,
    showIf: { propertyType: ["Timeshare"] },
  },

  images: {
    label: "Images",
    type: "image-upload",
    required: false,
    max: 20,
  },
};
