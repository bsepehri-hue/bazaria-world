import { Suspense } from "react";
import ProfileClient from "./ProfileClient";
import { getProfile } from "@/actions/profile";
import { mockRecentActivity } from "@/lib/mockData/profile";

export default async function Page() {
  const raw = await getProfile("user-123");
  const normalized = Array.isArray(raw) ? raw[0] : raw;
  const normalizedActivity = mockRecentActivity;

  const profile = {
    ...normalized,
    joinDate: normalized.joinDate ? new Date(normalized.joinDate) : new Date(),
    createdAt: normalized.createdAt ? new Date(normalized.createdAt) : new Date(),
    updatedAt: normalized.updatedAt ? new Date(normalized.updatedAt) : new Date(),
    lastLogin: normalized.lastLogin ? new Date(normalized.lastLogin) : new Date(),
    memberSince: normalized.memberSince ? new Date(normalized.memberSince) : new Date(),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          My Profile & Settings
        </h1>
      </div>

      {/* 🎯 This isolated Suspense boundary protects the useSearchParams hook from throwing layout exceptions */}
      <Suspense fallback={<div className="p-8 text-center text-gray-500 font-medium">Loading profile views...</div>}>
        <ProfileClient profile={profile} />
      </Suspense>
    </div>
  );
}
