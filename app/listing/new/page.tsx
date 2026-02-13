import ListingForm from "./ListingForm";

export default function NewListingPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create a Listing</h1>
      <ListingForm />
    </div>
  );
}
