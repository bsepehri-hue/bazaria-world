import React from "react";
import BaseListingForm from "@/components/listings/BaseListingForm";
import PetsForm from "@/components/listings/categories/PetsForm";

export default function NewPetsListingPage() {
  return (
    <BaseListingForm category="pets">
      <PetsForm />
    </BaseListingForm>
  );
}
