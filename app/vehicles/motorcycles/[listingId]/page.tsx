"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createPaymentIntent } from "@/lib/payments/createPaymentIntent";
import { loadStripe } from "@stripe/stripe-js";
import MessageButton from "@/components/MessageButton";

export default function PublicMotorcycleDetailPage() {
 const params = useParams();
const listingId = params?.listingId as string;


  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  const userId = "TEMP_USER_ID";
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

  async function handleBuyNow() {
    const paymentId = await createPaymentIntent({
      buyerId: userId,
      sellerId: listing.sellerId,
      amount: listing.price,
      platformFee: listing.price * 0.05,
      processingFee: listing.price * 0.03,
      referralFee: 0,
      shippingFee: 0,
      type: "listing",
      contextId: listingId,
    });

    const res = await fetch("/api/payments/create", {
      method: "POST",
      body: JSON.stringify({ paymentId }),
    });

    const { clientSecret } = await res.json();

    const stripe = await stripePromise;
if (!stripe) return;

await stripe.confirmCardPayment(clientSecret);
  }

  useEffect(() => {
    const loadListing = async () => {
      const ref = doc(db, "listings", listingId as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setListing(data);

        if (data.imageUrls?.length > 0) {
          setActiveImage(data.imageUrls[0]);
        }
      }

      setLoading(false);
    };

    loadListing();
  }, [listingId]);

  if (loading) return <p className="text-gray-600">Loading motorcycle…</p>;
  if (!listing) return <p className="text-gray-600">Motorcycle not found.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

      {activeImage && (
        <img
          src={activeImage}
          className="w-full max-w-3xl rounded-xl border object-cover"
        />
      )}

      {listing.imageUrls?.length > 1 && (
        <div className="flex gap-3 mt-4">
          {listing.imageUrls.map((url: string, i: number) => (
            <img
              key={i}
              src={url}
              onClick={() => setActiveImage(url)}
              className={`w-24 h-24 object-cover rounded-lg border cursor-pointer ${
                activeImage === url ? "ring-2 ring-teal-600" : ""
              }`}
            />
          ))}
        </div>
      )}

      <p className="text-3xl font-semibold text-gray-900">${listing.price}</p>

      <button
        onClick={handleBuyNow}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        Buy Now
      </button>

      <MessageButton
        sellerId={listing.sellerId}
        buyerId={userId}
        contextType="listing"
        contextId={listingId}
        label="Message Seller"
      />

      <p className="text-lg text-gray-700 max-w-2xl">{listing.description}</p>
    </div>
  );
}
