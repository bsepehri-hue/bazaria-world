"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { createPaymentIntent } from "@/lib/payments/createPaymentIntent";
import { loadStripe } from "@stripe/stripe-js";
import MessageButton from "@/components/MessageButton";

export default function ServiceDetailPage() {
  const params = useParams();
const category = params?.category as string;
const id = params?.serviceId as string;

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);

  const userId = "TEMP_USER_ID";
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

  async function handleBookService() {
    const paymentId = await createPaymentIntent({
      buyerId: userId,
      sellerId: service.providerId,
      amount: service.price,
      platformFee: service.price * 0.05,
      processingFee: service.price * 0.03,
      referralFee: 0,
      shippingFee: 0,
      type: "service",
      contextId: id,
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
    const loadService = async () => {
      const ref = doc(db, "services", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) setService(snap.data());
      setLoading(false);
    };

    loadService();
  }, [category, id]);

  if (loading) return <p className="text-gray-600">Loading service…</p>;
  if (!service) return <p className="text-gray-600">Service not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>

      <p className="text-3xl font-semibold text-gray-900">${service.price}</p>

      <button
        onClick={handleBookService}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        Book Service
      </button>

      <MessageButton
        sellerId={service.providerId}
        buyerId={userId}
        contextType="service"
        contextId={id}
        label="Message Provider"
      />
    </div>
  );
}
