"use client";

import DashboardListingHeader from "../../_components/DashboardListingHeader";
import { useRouter } from "next/navigation";
import { openOrCreateThread } from "@/lib/messaging/openOrCreateThread";

export default function DashboardListingPage({ params }) {
  const router = useRouter();

  // You already have these in your real file:
  // const listing = ...
  // const user = ...

  return (
    <div className="p-8">
      {/* ⭐ Shared Header */}
      <DashboardListingHeader listing={listing} />

      {/* ⭐ Message Seller Button */}
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
