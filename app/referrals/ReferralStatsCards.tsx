"use client";

export default function ReferralStatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-lg">
        <h3 className="text-sm text-gray-500">Total Referrals</h3>
        <p className="text-xl font-semibold">{stats.totalReferrals}</p>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="text-sm text-gray-500">Total Earnings</h3>
        <p className="text-xl font-semibold">{stats.totalEarnings.toString()}</p>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="text-sm text-gray-500">Pending Earnings</h3>
        <p className="text-xl font-semibold">{stats.pendingEarnings.toString()}</p>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="text-sm text-gray-500">Paid Earnings</h3>
        <p className="text-xl font-semibold">{stats.paidEarnings.toString()}</p>
      </div>
    </div>
  );
}
