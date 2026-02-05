"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

interface StripeStatus {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingComplete: boolean;
}

interface Props {
  userId: string;
  email: string;
}

export const StripeConnectActions = ({ userId, email }: Props) => {
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStripeInfo = async () => {
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        const stripeId = data.stripeAccountId || null;
        setAccountId(stripeId);

        if (stripeId) {
          const res = await fetch("/api/stripe/account-status", {
            method: "POST",
            body: JSON.stringify({ userId, accountId: stripeId }),
          });

          const json = await res.json();
          setStatus(json);
        }
      }

      setLoading(false);
    };

    fetchStripeInfo();
  }, [userId]);

  const handleConnect = async () => {
    setLoading(true);

    let stripeId = accountId;

    if (!stripeId) {
      const res = await fetch("/api/stripe/create-account", {
        method: "POST",
        body: JSON.stringify({ userId, email }),
      });

      const json = await res.json();
      stripeId = json.accountId;
      setAccountId(stripeId);
    }

    const linkRes = await fetch("/api/stripe/onboarding-link", {
      method: "POST",
      body: JSON.stringify({ accountId: stripeId }),
    });

    const linkJson = await linkRes.json();
    router.push(linkJson.url);
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Checking Stripe status…</p>;
  }

  if (!accountId || !status?.onboardingComplete) {
    return (
      <button
        onClick={handleConnect}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md shadow"
      >
        Connect Stripe
      </button>
    );
  }

  return (
    <a
      href={`https://dashboard.stripe.com/${accountId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow"
    >
      Open Stripe Dashboard
    </a>
  );
};
