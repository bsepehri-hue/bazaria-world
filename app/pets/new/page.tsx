"use client";

import { PetsForm } from "@/lib/categories/pets/form";
import BaseListingForm from "@/components/listings/BaseListingForm";

console.log("AUTH:", auth.currentUser);

export default function NewPetListingPage() {
  return <BaseListingForm category="pets" form={PetsForm} />;
}
