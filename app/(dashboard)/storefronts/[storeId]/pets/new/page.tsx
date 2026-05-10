import { PetsForm } from "@/lib/categories/pets/form";
import BaseListingForm from "@/components/listings/BaseListingForm";

export default function NewPetsListingPage() {
  return (
    <BaseListingForm category="pets" form={PetsForm} />
  );
}
