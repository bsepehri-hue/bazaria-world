import { Suspense } from "react";
import ProfileClient from "./ProfileClient";
import { getProfile } from "@/actions/profile";
import { mockRecentActivity } from "@/lib/mockData/profile";

export default async function Page() {
  const raw = await getProfile("user-123");

  const normalized =
    Array.isArray(raw)
      ? raw[0]
      : raw;

  const normalizedActivity = mockRecentActivity.map(a => ({
    ...a,
    timestamp: a.timestamp ? new Date(a.timestamp) : new Date(),
  }));

  const profile = {
    ...normalized,
    joinDate: normalized.joinDate
      ? new Date(normalized.joinDate)
      : new Date(),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          My Profile & Settings
        </h1>
      </div>

      <Suspense fallback={<div>Loading…</div>}>
        <ProfileClient
          profile={profile}
          activities={normalizedActivity}
        />
      </Suspense>
    </div>
  );
}
