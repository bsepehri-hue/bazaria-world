import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

import ImageGallery from "@/components/detail/ImageGallery";
import SpecsPanel from "@/components/detail/SpecsPanel";

export default async function ListingPage({ params }) {
  const { listingId } = params;

  const ref = doc(db, "listings", listingId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return notFound();
  }

  const listing = snap.data();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">{listing.title}</h1>

      <ImageGallery images={listing.images || []} />

      <div className="bg-white p-8 rounded-xl shadow border">
        <SpecsPanel listing={listing} />
      </div>
    </div>
  );
}
