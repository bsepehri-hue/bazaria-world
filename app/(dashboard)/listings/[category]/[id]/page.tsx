import { useRouter } from "next/navigation";
import { openOrCreateThread } from "@/lib/messaging/openOrCreateThread";
import Link from "next/link";

const router = useRouter();

<h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

<Link
  href={`/listing/${listing.id}`}
  className="inline-block mb-6 text-teal-600 underline hover:text-teal-700"
>
  View Public Page
</Link>

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
