"use client";

import React from "react";
import Link from "next/link";
import { User, Shield, Briefcase, Calendar, Wallet } from "lucide-react";
import { UserProfile } from "@/lib/profile";
import ProfileForm from "@/components/profile/ProfileForm";
import { ActivityList } from "@/components/profile/RecentActivityList";
import { mockRecentActivity } from "@/lib/mockData/profile";
import { shortenAddress } from "@/lib/utils";

export default function ProfileClient({ profile, activities }) {
  return <ActivityList activities={activities} />;
}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <ProfileInfoCard profile={profile} />
        <ProfileForm profile={profile} />

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-teal-600" /> Security & Preferences
          </h3>
          <p className="mt-2 text-gray-600">
            Placeholder for toggling email notifications, connecting social accounts, or enabling 2FA.
          </p>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-8">
        <ActivityList activities={mockRecentActivity} />
      </div>
    </div>
  );
}

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
              href={`/dashboard/stores/${profile.storefrontId}`}
              className="ml-1 text-blue-600 hover:underline"
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
