import { FormConfig } from "@/types/FormConfig";

export const servicesForm: FormConfig = {
  order: [
    "title",
    "description",
    "price",
    "hourlyRate",
    "serviceType",
    "location",
    "mobileService",
    "availability",
    "licenseNumber",
    "insured",
    "certification",
    "skillLevel",
    "durationMinutes",
    "eventType",
    "vehicleSpecialty",
    "platformSpecialty",
    "petSpecialty",
    "images",
  ],

  sections: [
    {
      title: "Basic Information",
      fields: ["title", "description", "serviceType"],
    },
    {
      title: "Pricing",
      fields: ["price", "hourlyRate"],
    },
    {
      title: "Location",
      fields: ["location", "mobileService", "availability"],
    },
    {
      title: "Skilled Trades",
      fields: ["licenseNumber", "insured"],
    },
    {
      title: "Professional Services",
      fields: ["certification"],
    },
    {
      title: "Lessons & Coaching",
      fields: ["skillLevel"],
    },
    {
      title: "Beauty & Wellness",
      fields: ["durationMinutes"],
    },
    {
      title: "Event Services",
      fields: ["eventType"],
    },
    {
      title: "Automotive Services",
      fields: ["vehicleSpecialty"],
    },
    {
      title: "Tech Services",
      fields: ["platformSpecialty"],
    },
    {
      title: "Pet Services",
      fields: ["petSpecialty"],
    },
    {
      title: "Photos",
      fields: ["images"],
    },
  ],

  defaults: {
    mobileService: false,
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
    hourlyRate: {
      min: 0,
      max: 9999,
    },
    durationMinutes: {
      min: 0,
      max: 10000,
    },
  },
};
