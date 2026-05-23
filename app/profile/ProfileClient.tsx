"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation"; 
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
  
  // 🛰️ Next.js URL compliance listeners
  const searchParams = useSearchParams();
  const pathname = usePathname(); 

  // 🎯 FORCE RAW BROWSER-LEVEL EXTRACTION ON EVERY RENDER LOOP
  let activeTab = "general"; 
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    activeTab = urlParams.get("tab") || "general";
  }

  // 🔄 Force a local component redraw the split-second the address bar updates
  const [_, forceUpdate] = useState(0);
  useEffect(() => {
    forceUpdate(prev => prev + 1);
  }, [searchParams, pathname]);

  // 📦 FIRESTORE ACTIVITY LOADER
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
      {/* LEFT & CENTER ROW CONTENT PANELS */}
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

      {/* RIGHT SIDEBAR PANEL */}
      <div className="lg:col-span-1 space-y-8">
        <ActivityList activities={activities} />
      </div>
    </div>
  );
}

// 🎯 RE-ADDED THE MISSING CARD COMPONENT DEFINITION HERE:
function ProfileInfoCard({ profile }: { profile: UserProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8 space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="relative w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
          {profile.displayName.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{profile.displayName}</h1>
          <p className="text-sm font-mono text-gray-500 mt-1">
            {profile.walletAddress ? shortenAddress(profile.walletAddress, 8) : "No wallet"}
          </p>
        </div>
      </div>

      <p className="text-gray-700 italic border-l-4 border-teal-500 pl-4">
        "{profile.bio}"
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <Wallet className="w-4 h-4 mr-2 text-teal-600" />
          <span className="ml-1 font-mono">
            {profile.walletAddress ? shortenAddress(profile.walletAddress, 4) : "No wallet"}
          </span>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4 mr-2 text-teal-600" />
          Joined:
          <span className="ml-1">{profile.joinDate.toLocaleDateString()}</span>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-700">
          <Briefcase className="w-4 h-4 mr-2 text-teal-600" />
          Storefront:
          {profile.storefrontId ? (
            <Link
              href={`/dashboard`}
              className="ml-1 text-blue-600 hover:underline font-semibold"
            >
              View Store #{profile.storefrontId}
            </Link>
          ) : (
            <span className="ml-1 text-red-500">None Linked</span>
          )}
        </div>

        <div className="flex items-center text-sm font-medium text-gray-700">
          <Shield className="w-4 h-4 mr-2 text-teal-600" />
          2FA Status:
          <span
            className={`ml-1 font-semibold ${
              profile.twoFactorEnabled ? "text-green-600" : "text-red-500"
            }`}
          >
            {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
}
