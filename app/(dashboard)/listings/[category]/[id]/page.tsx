import { useRouter } from "next/navigation";
import { openOrCreateThread } from "@/lib/messaging/openOrCreateThread";

const router = useRouter();



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


  className="px-4 py-2 bg-teal-600 text-white rounded-lg"
>
  Message Seller
</button>
