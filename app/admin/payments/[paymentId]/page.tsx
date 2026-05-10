"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AdminPaymentDetailPage() {
  const params = useParams<{ paymentId: string }>();

  if (!params) {
    return <p className="p-6 text-gray-600">Loading…</p>;
  }

  const { paymentId } = params;

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  useEffect(() => {
    const loadPayment = async () => {
      const ref = doc(db, "paymentIntents", paymentId as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPayment(snap.data());
      }

      setLoading(false);
    };

    loadPayment();
  }, [paymentId]);

  if (loading) return <p className="text-gray-600">Loading payment…</p>;
  if (!payment) return <p className="text-gray-600">Payment not found.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Payment #{paymentId}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>

        <p className="text-gray-700">
          Buyer: <span className="font-semibold">{payment.buyerId}</span>
        </p>

        <p className="text-gray-700">
          Seller: <span className="font-semibold">{payment.sellerId}</span>
        </p>

        <p className="text-gray-700">
          Type:{" "}
          <span className="font-semibold capitalize">{payment.type}</span>
        </p>

        <p className="text-gray-700">
          Context ID:{" "}
          <span className="font-semibold">{payment.contextId}</span>
        </p>

        <p className="text-gray-700">
          Status:{" "}
          <span className="font-semibold text-emerald-700">
            {payment.status}
          </span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Amounts</h2>

        <p className="text-gray-700">
          Amount: <span className="font-semibold">${payment.amount}</span>
        </p>

        <p className="text-gray-700">
          Platform Fee:{" "}
          <span className="font-semibold">${payment.platformFee}</span>
        </p>

        <p className="text-gray-700">
          Processing Fee:{" "}
          <span className="font-semibold">${payment.processingFee}</span>
        </p>

        <p className="text-gray-700">
          Referral Fee:{" "}
          <span className="font-semibold">${payment.referralFee}</span>
        </p>

        <p className="text-gray-700">
          Shipping Fee:{" "}
          <span className="font-semibold">${payment.shippingFee}</span>
        </p>

        <p className="text-gray-700">
          Total Charged:{" "}
          <span className="font-semibold">${payment.total}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Stripe</h2>

        <p className="text-gray-700">
          PaymentIntent ID:{" "}
          <span className="font-semibold">{payment.paymentIntentId || "—"}</span>
        </p>

        <p className="text-gray-700">
          Charge ID:{" "}
          <span className="font-semibold">{payment.chargeId || "—"}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Vault & Payout</h2>

        <p className="text-gray-700">
          Vault Entry:{" "}
          <span className="font-semibold">{payment.vaultEntryId || "—"}</span>
        </p>

        <p className="text-gray-700">
          Payout ID:{" "}
          <span className="font-semibold">{payment.payoutId || "—"}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Timestamps</h2>

        <p className="text-gray-700">
          Created:{" "}
          <span className="font-semibold">
            {payment.createdAt?.toDate?.().toLocaleString() || "—"}
          </span>
        </p>

        <p className="text-gray-700">
          Updated:{" "}
          <span className="font-semibold">
            {payment.updatedAt?.toDate?.().toLocaleString() || "—"}
          </span>
        </p>
      </div>
    </div>
  );
}
