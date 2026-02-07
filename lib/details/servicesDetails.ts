import { DetailConfig } from "@/types/DetailConfig";

export const servicesDetails: DetailConfig = {
  layout: [
    {
      title: "Overview",
      fields: ["title", "price", "hourlyRate", "serviceType", "location", "mobileService"],
    },
    {
      title: "Description",
      fields: ["description"],
    },
    {
      title: "Availability",
      fields: ["availability"],
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

  display: {
    title: {
      variant: "heading",
    },
    price: {
      variant: "price",
      prefix: "$",
      emptyState: "—",
    },
    hourlyRate: {
      variant: "price",
      prefix: "$/hr",
      emptyState: "—",
    },
    serviceType: {
      variant: "badge",
      colorMap: {
        "Home Services": "teal",
        "Skilled Trades": "emerald",
        "Professional Services": "amber",
        "Lessons & Coaching": "teal",
        "Beauty & Wellness": "burgundy",
        "Event Services": "amber",
        "Automotive Services": "teal",
        "Tech Services": "emerald",
        "Pet Services": "amber",
        "Misc Services": "teal",
      },
    },
    location: {
      variant: "text",
    },
    mobileService: {
      variant: "boolean",
      trueLabel: "Yes",
      falseLabel: "No",
      emptyState: "—",
    },
    description: {
      variant: "paragraph",
    },
    availability: {
      variant: "text",
      emptyState: "—",
    },
    licenseNumber: {
      variant: "text",
      emptyState: "—",
    },
    insured: {
      variant: "boolean",
      trueLabel: "Yes",
      falseLabel: "No",
      emptyState: "—",
    },
    certification: {
      variant: "text",
      emptyState: "—",
    },
    skillLevel: {
      variant: "text",
      emptyState: "—",
    },
    durationMinutes: {
      variant: "text",
      suffix: " min",
      emptyState: "—",
    },
    eventType: {
      variant: "text",
      emptyState: "—",
    },
    vehicleSpecialty: {
      variant: "text",
      emptyState: "—",
    },
    platformSpecialty: {
      variant: "text",
      emptyState: "—",
    },
    petSpecialty: {
      variant: "text",
      emptyState: "—",
    },
    images: {
      variant: "gallery",
    },
  },
};
