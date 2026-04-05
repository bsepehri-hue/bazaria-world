"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { VaultSummaryCards } from "../../components/vault/VaultSummaryCards";
import FadeIn from "../../components/ui/FadeIn";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { VaultDashboardData } from "@/lib/vault/types";
import { mockVaultDashboardData } from "@/lib/vault/mockData";
import { collection, getDocs } from "firebase/firestore";
import DashboardSkeleton from "../../components/ui/DashboardSkeleton";
import { TransactionRow } from "../../components/vault/TransactionRow";

export default function VaultDashboard() {
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

  // --- 32nd FLOOR STYLES ---
  const glassCard = "bg-[#003d33]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl";

  return (
    <div className="min-h-screen bg-[#002d26] p-8 text-white font-sans">
      {/* Header Area */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-[#FFBF00] text-xs font-black uppercase tracking-[0.2em] mb-2">
            The Living Economy
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-white">
            Vault <span className="text-white/30">Command</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">System Status</p>
          <p className="text-[#10b981] text-sm font-bold">● SECURE / LIVE</p>
        </div>
      </div>

      {/* Summary Cards - We keep your component but wrap it in the new vibe */}
      <FadeIn>
        <div className="mb-10">
          <VaultSummaryCards summary={data.summary} />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Growth Chart - AreaChart looks more "Premium" than LineChart */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className={glassCard}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold tracking-tight">Marketplace Velocity</h3>
              <span className="text-[10px] bg-[#FFBF00]/10 text-[#FFBF00] px-3 py-1 rounded-full font-bold">NET VOLUME</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.merchantData}>
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFBF00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFBF00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#4d8a80" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#003d33', border: '1px solid #FFBF00', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#FFBF00' }}
                  />
                  <Area type="monotone" dataKey="netValue" stroke="#FFBF00" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        {/* Ecosystem Rewards (Pie) */}
        <FadeIn delay={400}>
          <div className={glassCard}>
            <h3 className="text-lg font-bold mb-8">LTB Allocation</h3>
            <div className="h-[250px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.referralData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {data.referralData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#FFBF00" : "#ffffff10"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-black">50/50</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Steward Split Ratio</p>
            </div>
          </div>
        </FadeIn>

        {/* Transaction Ledger */}
        <FadeIn delay={600} className="lg:col-span-3">
          <div className={glassCard}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic tracking-tighter">LEDGER_ALPHA</h3>
              <button className="text-[10px] font-bold text-[#FFBF00] border border-[#FFBF00]/30 px-4 py-2 rounded-xl hover:bg-[#FFBF00] hover:text-[#002d26] transition-all">
                EXPORT CSV
              </button>
            </div>
            <div className="space-y-2">
              {data.transactions.map((txn) => (
                <TransactionRow key={txn.id} transaction={txn} />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
