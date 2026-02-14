"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { VaultSummaryCards } from "../../components/vault/VaultSummaryCards";
import FadeIn from "../../components/ui/FadeIn";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import { useTheme } from "../../../hooks/useTheme";
import { VaultDashboardData } from "@/lib/vault/types";
import { mockVaultDashboardData } from "@/lib/vault/mockData";
import { collection, getDocs } from "firebase/firestore";

export default function VaultDashboard() {
  const { isDark } = useTheme();

  const [data, setData] = useState<VaultDashboardData>(mockVaultDashboardData);
  const [loading, setLoading] = useState(true);

  

useEffect(() => {
  const fetchSummary = async () => {
    try {
      const txnRef = collection(db, "transactions_001");
      const txnSnapshot = await getDocs(txnRef);

      const merchantPoints = txnSnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          date: d.createdAt?.toDate().toLocaleDateString(),
          netValue: Number(d.netValue),
        };
      });

      setData({
        ...mockVaultDashboardData,
        merchantData: merchantPoints,
      });
    } catch (err) {
      setData(mockVaultDashboardData);
    } finally {
      setLoading(false);
    }
  };

  fetchSummary();
}, []);

  if (loading) return <DashboardSkeleton />;

  return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">
      Vault Dashboard
    </h2>

    {/* Summary Cards */}
    <FadeIn>
      <VaultSummaryCards summary={data.summary} />
    </FadeIn>

    {/* Charts Section */}
    <FadeIn delay={200}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Merchant Net Value */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Merchant Net Value
          </h3>
          <LineChart width={500} height={300} data={data.merchantData}>
            <CartesianGrid stroke={isDark ? "#444" : "#ccc"} />
            <XAxis dataKey="date" stroke={isDark ? "#aaa" : "#000"} />
            <YAxis stroke={isDark ? "#aaa" : "#000"} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#222" : "#fff",
                color: isDark ? "#fff" : "#000",
              }}
            />
            <Line
              type="monotone"
              dataKey="netValue"
              stroke={isDark ? "#14b8a6" : "#8884d8"}
            />
          </LineChart>
        </div>

        {/* Referral Discounts */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Referral Discounts
          </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={data.referralData}
              cx={200}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              fill="#82ca9d"
              dataKey="value"
              label
            >
              {data.referralData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#f59e0b" : "#14b8a6"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#222" : "#fff",
                color: isDark ? "#fff" : "#000",
              }}
            />
          </PieChart>
        </div>
      </div>
    </FadeIn>

    {/* Vault Balances */}
    <FadeIn delay={400}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Vault Balances
        </h3>
        <BarChart width={600} height={300} data={data.vaultData}>
          <CartesianGrid stroke={isDark ? "#444" : "#ccc"} />
          <XAxis dataKey="vaultId" stroke={isDark ? "#aaa" : "#000"} />
          <YAxis stroke={isDark ? "#aaa" : "#000"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#222" : "#fff",
              color: isDark ? "#fff" : "#000",
            }}
          />
          <Bar dataKey="amount" fill={isDark ? "#14b8a6" : "#82ca9d"} />
        </BarChart>
      </div>
    </FadeIn>

    {/* Transaction Ledger */}
    <FadeIn delay={600}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Transaction Ledger
        </h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.transactions.map((txn) => (
            <TransactionRow key={txn.id} transaction={txn} />
          ))}
        </div>
      </div>
    </FadeIn>
  </div>
);
}
