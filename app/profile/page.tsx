import { Suspense } from "react";
import ProfileClient from "./ProfileClient";
import { getProfile } from "@/actions/profile";
import { mockRecentActivity } from "@/lib/mockData/profile";

export default function ProfileClient({ profile, activities }) {
  return (
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
        <ActivityList activities={activities} />
      </div>
    </div>
  );
}
