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

  // Conditional fields
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
});
