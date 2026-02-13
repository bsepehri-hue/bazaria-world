"use client";

import DashboardListingHeader from "../../_components/DashboardListingHeader";
import { useRouter } from "next/navigation";
import { openOrCreateThread } from "@/lib/messaging/openOrCreateThread";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function DashboardListingPage({ params }) {
  const router = useRouter();

  // listing + user already loaded in your real file

  return (
    <div className="p-8">
      <DashboardListingHeader listing={listing} />

      {/* ⭐ Delete Listing */}
      <button
        onClick={async () => {
          const confirmed = confirm("Are you sure you want to delete this listing?");
          if (!confirmed) return;

          await updateDoc(doc(db, "listings", listing.id), {
            deleted: true,
            deletedAt: Date.now(),
          });

          router.push("/dashboard/listings");
        }}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mr-4"
      >
        Delete Listing
      </button>

      {/* ⭐ Message Seller */}
      <button
        onClick={async () => {
          await openOrCreateThread({
            buyerId: user.uid,
            buyerName: user.displayName || "Buyer",
            sellerId: listing.sellerId,
            storeId: listing.storeId,
            listingId: listing.id,
            listingTitle: listing.title,
            storeName: listing.storeName,
            router
          });
        }}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg"
      >
        Message Seller
      </button>
    </div>
  );
}
