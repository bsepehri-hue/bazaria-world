import { z } from "zod";

export const realEstateSchema = z.object({
  // Universal fields
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(5000),
  price: z.number().min(0),
  propertyType: z.enum([
    "Homes",
    "Rentals",
    "Rooms",
    "Land",
    "Timeshare",
  ]),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3),
  images: z.array(z.string()).optional(),

  // 🛡️ THE SOVEREIGN TOGGLE
  // This flag unlocks the "Sanctuary" mandates and triggers the Ocean-Glow UI
  isCaribbeanFacilitation: z.boolean().default(false),

  // 🏛️ MANDATORY ITEMIZATION (The "Sanctuary" Standard)
  // These become mandatory in the UI when isCaribbeanFacilitation is true
  energyRedundancy: z.enum(["None", "Partial Solar", "Full Solar", "Generator", "Solar + Generator"]).optional(),
  securityTier: z.enum(["Standard", "Perimeter Fence", "Gated 24/7", "Elite Armed Patrol"]).optional(),
  internetGrade: z.enum(["Satellite", "Standard Cable", "Dedicated Fiber Optic"]).optional(),
  confoturStatus: z.enum(["Not Applicable", "Pending", "Verified Active"]).optional(),
  waterSystem: z.enum(["Municipal", "Well", "Purified/Filtered System"]).optional(),

  // Conditional fields (Standard)
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFeet: z.number().min(0).optional(),
  lotSize: z.number().min(0).optional(),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear() + 1).optional(),

  // Rentals
  leaseTerm: z.string().optional(),
  deposit: z.number().min(0).optional(),
  utilitiesIncluded: z.boolean().optional(),

  // Rooms
  roomType: z.enum(["Private", "Shared"]).optional(),
  bathroomAccess: z.enum(["Private", "Shared"]).optional(),

  // Land
  acreage: z.number().min(0).optional(),
  zoning: z.string().optional(),

  // Timeshare
  weekNumber: z.number().min(1).max(52).optional(),
  maintenanceFee: z.number().min(0).optional(),

}).superRefine((data, ctx) => {
  // 🛡️ ENFORCEMENT LOGIC:
  // If this is a Caribbean Facilitation, the "Optional" fields become REQUIRED.
  if (data.isCaribbeanFacilitation) {
    const mandatoryFields = [
      'energyRedundancy', 
      'securityTier', 
      'internetGrade', 
      'confoturStatus'
    ] as const;

    mandatoryFields.forEach((field) => {
      if (!data[field] || data[field] === "None" || data[field] === "Standard") {
        // We don't necessarily block "Standard", but we ensure the data exists.
        if (!data[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field} is mandatory for Caribbean Facilitation`,
            path: [field],
          });
        }
      }
    });
  }
});
