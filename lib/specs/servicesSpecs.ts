import { FieldSpec } from "@/types/FieldSpec";

export const servicesSpecs: Record<string, FieldSpec> = {
  title: {
    label: "Title",
    type: "text",
    required: true,
    placeholder: "e.g., Plumbing Repair, Math Tutoring, Hair Styling",
    filter: "text",
  },

  description: {
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the service clearly...",
  },

  price: {
    label: "Fixed Price",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
  },

  hourlyRate: {
    label: "Hourly Rate",
    type: "number",
    required: false,
    min: 0,
    filter: "range",
  },

  serviceType: {
    label: "Service Type",
    type: "select",
    required: true,
    options: [
      "Home Services",
      "Skilled Trades",
      "Professional Services",
      "Lessons & Coaching",
      "Beauty & Wellness",
      "Event Services",
      "Automotive Services",
      "Tech Services",
      "Pet Services",
      "Misc Services",
    ],
    filter: "select",
  },

  location: {
    label: "Location",
    type: "text",
    required: true,
    placeholder: "City or service area",
  },

  mobileService: {
    label: "Mobile Service",
    type: "boolean",
    required: false,
  },

  availability: {
    label: "Availability",
    type: "text",
    required: false,
    placeholder: "e.g., Weekdays 9am–5pm",
  },

  licenseNumber: {
    label: "License Number",
    type: "text",
    required: false,
    showIf: { serviceType: ["Skilled Trades"] },
  },

  insured: {
    label: "Insured",
    type: "boolean",
    required: false,
    showIf: { serviceType: ["Skilled Trades"] },
  },

  certification: {
    label: "Certification",
    type: "text",
    required: false,
    placeholder: "e.g., CPA, Personal Trainer Certification",
    showIf: { serviceType: ["Professional Services"] },
  },

  skillLevel: {
    label: "Skill Level",
    type: "select",
    required: false,
    options: ["Beginner", "Intermediate", "Advanced"],
    showIf: { serviceType: ["Lessons & Coaching"] },
  },

  durationMinutes: {
    label: "Duration (Minutes)",
    type: "number",
    required: false,
    min: 0,
    showIf: { serviceType: ["Beauty & Wellness"] },
  },

  eventType: {
    label: "Event Type",
    type: "text",
    required: false,
    placeholder: "e.g., Wedding, Corporate Event",
    showIf: { serviceType: ["Event Services"] },
  },

  vehicleSpecialty: {
    label: "Vehicle Specialty",
    type: "text",
    required: false,
    placeholder: "e.g., BMW, Trucks, Motorcycles",
    showIf: { serviceType: ["Automotive Services"] },
  },

  platformSpecialty: {
    label: "Platform Specialty",
    type: "text",
    required: false,
    placeholder: "e.g., Windows, iOS, Shopify",
    showIf: { serviceType: ["Tech Services"] },
  },

  petSpecialty: {
    label: "Pet Specialty",
    type: "text",
    required: false,
    placeholder: "e.g., Dogs, Cats, Birds",
    showIf: { serviceType: ["Pet Services"] },
  },

  images: {
    label: "Images",
    type: "image-upload",
    required: false,
    max: 20,
  },
};
