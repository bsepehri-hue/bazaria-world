import { loadCategoryDetails } from "@/lib/categories/pets/loader";
import { PETS_DETAILS } from "@/lib/categories/pets/details";
import { PETS_SPECS } from "@/lib/categories/pets/specs";

export default async function PetsDetailsPage({ params }) {
  const listing = await loadCategoryDetails(params.listingId);

  return (
    <ListingDetails
      listing={listing}
      details={PETS_DETAILS}
      specs={PETS_SPECS}
    />
  );
}
