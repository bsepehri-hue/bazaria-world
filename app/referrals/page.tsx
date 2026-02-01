import React, { Suspense } from 'react';
import { Award, Loader2, AlertTriangle, Link } from 'lucide-react';
import { ReferralStats, ReferralActivity } from '@/lib/mockData/referrals';
import { getReferralStats, getReferralActivity } from "@/lib/mockData/referrals";

// Component to handle the async fetching logic and rendering
async function ReferralFetcher() {
  let stats: ReferralStats;
  let activity: ReferralActivity[];
  let error: string | null = null;

  try {
    stats = await getReferralStats("steward-123");
    activity = await getReferralActivity("steward-123");
  } catch (e) {
    console.error("Failed to load referral data:", e);
    error = "Failed to load referral data.";

    // Fallback to empty mock data structure if the action fails
    stats = {
      totalReferrals: 0,
      totalEarnings: BigInt(0),
      pendingEarnings: BigInt(0),
      paidEarnings: BigInt(0),
    };
    activity = [];
  }

  return (
    <div className="space-y-10">
      {/* Link Generator (Client Component) */}
      <ReferralLinkGenerator />

      {/* Stats Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-teal-600" /> Earnings Overview
        </h2>
        <ReferralStatsCards stats={stats} />
      </section>

      {/* Activity Table */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Link className="w-5 h-5 mr-2 text-teal-600" /> Recent Referrals
        </h2>
        <ReferralActivityTable activity={activity} />
      </section>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-3 mt-8">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error} Showing mock data.</p>
        </div>
      )}
    </div>
  );
}

export default function ReferralDashboardPage() {
  
  return (
    <div className="space-y-8">
      
      {/* Header and Title */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Award className="w-7 h-7 mr-3 text-red-600" />
          Agent & Referral Dashboard
        </h1>
        <p className="text-gray-500 text-sm hidden sm:block">Earn passive commissions by referring users.</p>
      </div>

      {/* Main Content (Server Fetching) */}
      <Suspense fallback={<ReferralLoadingSkeleton />}>
        <ReferralFetcher />
      </Suspense>

    </div>
  );
}

function ReferralLoadingSkeleton() {
    return (
        <div className="space-y-10 p-4 animate-pulse">
            {/* Link Generator Skeleton */}
            <div className="h-20 bg-gray-200 rounded-xl shadow-lg"></div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl shadow-lg"></div>
                ))}
            </div>
            
            {/* Activity Table Skeleton */}
            <div className="h-96 bg-gray-200 rounded-xl shadow-lg"></div>
        </div>
    );
}
