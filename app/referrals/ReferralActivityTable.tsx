"use client";

export default function ReferralActivityTable({ activity }: { activity: any[] }) {
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-gray-500 text-sm">Activity table placeholder</p>
      <pre className="text-xs mt-2">{JSON.stringify(activity, null, 2)}</pre>
    </div>
  );
}
