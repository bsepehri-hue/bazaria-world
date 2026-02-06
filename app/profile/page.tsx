import { Suspense } from "react";
import ProfileClient from "./ProfileClient";
import { getProfile } from "@/actions/profile";

export default async function Page() {
  const profile = await getProfile("user-123");

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
