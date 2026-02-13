"use client";

import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import DashboardListingHeader from "../../_components/DashboardListingHeader";
import ReasonModal from "@/app/components/ReasonModal";
import { useRouter } from "next/navigation";

export default function DashboardListingPage({ params }) {
  const router = useRouter();

  // listing + user already loaded in your real file

  // ⭐ Modal state
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // ⭐ Modal submit handler
  async function handleReasonSubmit(reason) {
    setReasonModalOpen(false);

    // Perform the action
    if (pendingAction === "delete") {
      await updateDoc(doc(db, "listings", listing.id), {
        deleted: true,
        deletedAt: Date.now(),
      });
    }

    if (pendingAction === "restore") {
      await updateDoc(doc(db, "listings", listing.id), {
        deleted: false,
        deletedAt: null,
      });
    }

    if (pendingAction === "mark_sold") {
      await updateDoc(doc(db, "listings", listing.id), {
        status: "sold",
        soldAt: Date.now(),
      });
    }

    if (pendingAction === "mark_active") {
      await updateDoc(doc(db, "listings", listing.id), {
        status: "active",
        soldAt: null,
      });
    }

    // ⭐ Audit log with reason
    await addDoc(collection(db, "auditLogs"), {
      action: pendingAction,
      listingId: listing.id,
      listingTitle: listing.title,
      performedBy: user.uid,
      performedByEmail: user.email,
      reason,
      timestamp: Date.now(),
    });

    setPendingAction(null);
    router.refresh();
  }

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
        onClick={() => {
          setPendingAction("delete");
          setReasonModalOpen(true);
        }}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mr-4"
      >
        Delete Listing
      </button>

      {/* ⭐ Mark as Sold */}
      {listing.status !== "sold" && (
        <button
          onClick={() => {
            setPendingAction("mark_sold");
            setReasonModalOpen(true);
          }}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 mr-4"
        >
          Mark as Sold
        </button>
      )}

      {/* ⭐ Mark as Active */}
      {listing.status === "sold" && (
        <button
          onClick={() => {
            setPendingAction("mark_active");
            setReasonModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mr-4"
        >
          Mark as Active
        </button>
      )}

      {/* ⭐ Restore Deleted Listing (Admin Only) */}
      {isAdmin && listing.deleted && (
        <button
          onClick={() => {
            setPendingAction("restore");
            setReasonModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
        >
          Restore Listing
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
            router,
          });
        }}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg"
      >
        Message Seller
      </button>

      {/* ⭐ Reason Modal */}
      <ReasonModal
        open={reasonModalOpen}
        onClose={() => setReasonModalOpen(false)}
        onSubmit={handleReasonSubmit}
      />
    </div>
  );
}
