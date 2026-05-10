export const dynamic = 'force-dynamic';

import StorefrontDashboardClient from "./StorefrontDashboardClient";
import Link from "next/link";

export default function StorefrontDashboardPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Storefronts
        </h1>

        <Link
          href="/storefronts/new"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Storefront
        </Link>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">$0.00</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Active Listings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Your Active Storefronts
        </h2>

        <StorefrontDashboardClient />
      </section>
    </div>
  );
}
