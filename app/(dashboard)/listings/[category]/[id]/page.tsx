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

      {/* ⭐ Compact Image Strip */}
      {listing.images?.length > 0 && (
        <div className="flex gap-3 mb-8 overflow-x-auto">
          {listing.images.map((url) => (
            <div key={url} className="relative min-w-[120px]">
              <img
                src={url}
                className="rounded-lg object-cover w-[120px] h-[90px]"
              />

              {listing.status === "sold" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                  <span className="text-white text-sm font-bold tracking-widest rotate-[-15deg] opacity-90">
                    SOLD
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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

{/* ⭐ Mark as Sold */}
{listing.status !== "sold" && (
  <button
    onClick={async () => {
      const confirmed = confirm("Mark this listing as SOLD?");
      if (!confirmed) return;

      await updateDoc(doc(db, "listings", listing.id), {
        status: "sold",
        soldAt: Date.now(),
      });

      router.refresh();
    }}
    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 mr-4"
  >
    Mark as Sold
  </button>
)}

{/* ⭐ Mark as Active (Undo Sold) */}
{listing.status === "sold" && (
  <button
    onClick={async () => {
      const confirmed = confirm("Mark this listing as ACTIVE again?");
      if (!confirmed) return;

      await updateDoc(doc(db, "listings", listing.id), {
        status: "active",
        soldAt: null,
      });

      router.refresh();
    }}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mr-4"
  >
    Mark as Active
  </button>
)}

      
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
