import { Suspense } from "react";
import ProfileClient from "./ProfileClient";
import { getProfile } from "@/actions/profile";

export default async function Page() {
  const raw = await getProfile("user-123");

  const normalized =
    Array.isArray(raw)
      ? raw[0] // or throw an error if this should never happen
      : raw;

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
        <ProfileClient profile={profile} />
      </Suspense>
    </div>
  );
}
