"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation"; // 🛰️ Import both tracking hooks
import { Shield, Briefcase, Calendar, Wallet, Trophy, Eye } from "lucide-react";
import { UserProfile } from "@/lib/profile";
import ProfileForm from "@/components/profile/ProfileForm";
import { ActivityList } from "@/components/profile/RecentActivityList";
import { shortenAddress } from "@/lib/utils";

import { db } from "@/lib/firebase/client";
import { collection, query, where, limit, getDocs } from "firebase/firestore";

export default function ProfileClient({
  profile,
}: {
  profile: UserProfile;
}) {
  const [activities, setActivities] = useState<any[]>([]);
  
  // 🛰️ Hook directly into Next.js reactive address bar listeners
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  
  const [activeTab, setActiveTab] = useState<string>("general");

  // Force synchronization whenever the URL path or search parameters update, even over LAN IPs
  useEffect(() => {
    const tabParam = searchParams.get("tab") || "general";
    setActiveTab(tabParam);
  }, [searchParams, pathname]); 

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;

      const q = query(
        collection(db, "activity"),
        where("userId", "==", profile.id),
        limit(20)
      );

      try {
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(data);
      } catch (err) {
        console.error("Firestore error:", err);
      }
    };

    load();
  }, [profile?.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <ProfileInfoCard profile={profile} />

        {/* 📊 STRICT EVALUATION SWITCH BLOCK */}
        {activeTab === "general" ? (
          <>
            <ProfileForm profile={profile} />

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-teal-600" /> Security & Preferences
              </h3>
              <p className="mt-2 text-gray-600">
                Placeholder for toggling email notifications, connecting social accounts, or enabling 2FA.
              </p>
            </div>
          </>
        ) : activeTab === "bids" ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center border-b pb-3">
              <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Active Marketplace Bids
            </h3>
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-sm">
              🛰️ <strong>1 Active Auction Stream Tracked:</strong> Your live bid activity feed for items like your <strong>2024 Ducati Panigale V4 S</strong> is loading here.
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center border-b pb-3">
              <Eye className="w-5 h-5 mr-2 text-teal-600" /> Live Watchlist & Saved Items
            </h3>
            <p className="text-sm text-gray-600">
              You aren't tracking any external marketplace listings on your personal watch profile yet.
            </p>
          </div>
        )}
      </div>

      <div className="lg:col-span-1 space-y-8">
        <ActivityList activities={activities} />
      </div>
    </div>
  );
}

// Keep your existing ProfileInfoCard implementation here...
