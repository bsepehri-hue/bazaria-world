import { FormConfig } from "@/types/FormConfig";

export const realEstateForm: FormConfig = {
  order: [
    "isCaribbeanFacilitation", // 🛡️ The Sovereign Switch
    "title",
    "description",
    "price",
    "propertyType",
    "address",
    "city",
    "state",
    "zipCode",
    // 🏛️ Sanctuary Audit Fields
    "energyRedundancy",
    "securityTier",
    "internetGrade",
    "confoturStatus",
    "waterSystem",
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
      title: "Portfolio Strategy",
      fields: ["isCaribbeanFacilitation"],
    },
    {
      title: "🏛️ Sanctuary Audit (Mandatory for Caribbean)",
      fields: [
        "energyRedundancy",
        "securityTier",
        "internetGrade",
        "confoturStatus",
        "waterSystem",
      ],
    },
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
    // ... remaining sections (Rental, Room, Timeshare, Pricing, Photos)
  ],

  defaults: {
    isCaribbeanFacilitation: false,
    utilitiesIncluded: false,
    energyRedundancy: "None",
    securityTier: "Standard",
    internetGrade: "Standard Cable",
    confoturStatus: "Not Applicable",
    waterSystem: "Municipal",
  },

  validation: {
    // Existing validation...
    title: { minLength: 3, maxLength: 120 },
    description: { minLength: 10, maxLength: 5000 },
    price: { min: 0, max: 999999999 },
    // Add logic in the UI component to check if these are required 
    // based on the isCaribbeanFacilitation toggle.
  },
};
