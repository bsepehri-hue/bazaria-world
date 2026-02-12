"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Store,
  Package,
  Mail,
  Wallet,
  Activity,
  Car,
  Home,
  Map,
  Building,
  Bed,
  Bike,
  Bus,
  Truck,
  Calendar,
} from "lucide-react";

const activityColor = (type: string) => {
  switch (type) {
    case "storefront":
      return "text-teal-600";
    case "listing":
      return "text-amber-600";
    case "message":
      return "text-emerald-600";
    case "payout":
      return "text-burgundy-600";
    default:
      return "text-gray-600";
  }
};

const activityBg = (type: string) => {
  switch (type) {
    case "storefront":
      return "bg-teal-50";
    case "listing":
      return "bg-amber-50";
    case "message":
      return "bg-emerald-50";
    case "payout":
      return "bg-red-50";
    default:
      return "bg-gray-50";
  }
};

const categoryIcon = (category: string) => {
  switch (category) {
    case "cars":
      return Car;
    case "homes":
      return Home;
    case "land":
      return Map;
    case "rentals":
      return Building;
    case "rooms":
      return Bed;
    case "motorcycles":
      return Bike;
    case "rvs":
      return Bus;
    case "trucks":
      return Truck;
    case "timeshare":
      return Calendar;
    default:
      return Package;
  }
};

const timeAgo = (timestamp: any) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default function DashboardPage() {
  const [storefrontCount, setStorefrontCount] = useState<number | null>(null);
  const [listingCount, setListingCount] = useState<number | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number | null>(null);
  const [pendingPayoutTotal, setPendingPayoutTotal] = useState<number | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // STOREFRONTS
    const unsubStorefronts = onSnapshot(collection(db, "storefronts"), (snap) => {
      setStorefrontCount(snap.size);

      const updates = snap.docChanges().map((change) => ({
        type: "storefront",
        timestamp: change.doc.data().createdAt || 0,
        message: `New storefront created: ${change.doc.data().name}`,
      }));

      if (updates.length > 0) {
        setRecentActivity((prev) => [...updates, ...prev].slice(0, 10));
      }
    });

    // LISTINGS
    const unsubListings = onSnapshot(collection(db, "listings"), (snap) => {
      setListingCount(snap.size);

      const updates = snap.docChanges().map((change) => ({
        type: "listing",
        timestamp: change.doc.data().createdAt || 0,
        message: `New listing: ${change.doc.data().title}`,
        category: change.doc.data().category,
        id: change.doc.id,
      }));

      if (updates.length > 0) {
        setRecentActivity((prev) => [...updates, ...prev].slice(0, 10));
      }
    });

    // MESSAGES
    const unsubMessages = onSnapshot(collection(db, "messages"), (snap) => {
      const unread = snap.docs.filter((doc) => doc.data().read === false).length;
      setUnreadMessages(unread);

      const updates = snap.docChanges().map((change) => ({
        type: "message",
        timestamp: change.doc.data().createdAt || 0,
        message: `New message received`,
      }));

      if (updates.length > 0) {
        setRecentActivity((prev) => [...updates, ...prev].slice(0, 10));
      }
    });

    // PAYOUTS
    const unsubPayouts = onSnapshot(collection(db, "payouts"), (snap) => {
      const pendingTotal = snap.docs
        .filter((doc) => doc.data().status === "pending")
        .reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

      setPendingPayoutTotal(pendingTotal);

      const updates = snap.docChanges().map((change) => ({
        type: "payout",
        timestamp: change.doc.data().createdAt || 0,
        message: `Payout ${change.doc.data().status}: $${change.doc.data().amount}`,
      }));

      if (updates.length > 0) {
        setRecentActivity((prev) => [...updates, ...prev].slice(0, 10));
      }
    });

    return () => {
      unsubStorefronts();
      unsubListings();
      unsubMessages();
      unsubPayouts();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your marketplace command center.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStat label="Active Storefronts" value={storefrontCount ?? "…"} icon={Store} />
        <DashboardStat label="Active Listings" value={listingCount ?? "…"} icon={Package} />
        <DashboardStat label="Unread Messages" value={unreadMessages ?? "…"} icon={Mail} />
        <DashboardStat
          label="Pending Payouts"
          value={pendingPayoutTotal === null ? "…" : `$${pendingPayoutTotal.toFixed(2)}`}
          icon={Wallet}
        />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-medium mb-3">Recent Activity</h2>

        <div className="space-y-2">
          {recentActivity.length === 0 && (
            <p className="text-gray-500 text-sm">No recent activity yet.</p>
          )}

          {recentActivity.map((item, index) => {
            const Icon = item.type === "listing" ? categoryIcon(item.category) : Activity;

            return (
              <div
                key={index}
                className={`fade-in p-3 border rounded-lg shadow-sm text-sm flex items-center justify-between ${activityBg(item.type)}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${activityColor(item.type)}`} />
                  <span className={activityColor(item.type)}>{item.message}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs">{timeAgo(item.timestamp)}</span>

                  {item.type === "listing" && (
                    <a
                      href={`/listings/${item.category}/${item.id}`}
                      className="text-xs text-teal-700 font-medium hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: any;
  icon: any;
}) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-md">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
}
