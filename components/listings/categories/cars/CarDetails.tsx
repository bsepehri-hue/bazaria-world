export default function CarDetails({ listingId }: { listingId: string }) {
  return (
    <div className="text-white">
      Car details page for listing: {listingId}
    </div>
  );
}
