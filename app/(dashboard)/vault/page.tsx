"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { VaultSummaryCards } from "../../components/vault/VaultSummaryCards";
import FadeIn from "../../components/ui/FadeIn";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from "recharts";
import { VaultDashboardData } from "@/lib/vault/types";
import { mockVaultDashboardData } from "@/lib/vault/mockData";
import { collection, getDocs } from "firebase/firestore";
import DashboardSkeleton from "../../components/ui/DashboardSkeleton";
import { TransactionRow } from "../../components/vault/TransactionRow";

export default function VaultDashboard() {
  const [data, setData] = useState<VaultDashboardData>(mockVaultDashboardData);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchSummary = async () => {
      try {
        const txnRef = collection(db, "transactions_001");
        const txnSnapshot = await getDocs(txnRef);
        const merchantPoints = txnSnapshot.docs.map(doc => {
          const d = doc.data();
          return {
            date: d.createdAt?.toDate() ? d.createdAt.toDate().toLocaleDateString() : "Pending",
            netValue: Number(d.netValue) || 0,
          };
        });
        setData({
          ...mockVaultDashboardData,
          merchantData: merchantPoints.length > 0 ? merchantPoints : mockVaultDashboardData.merchantData,
        });
      } catch (err) {
        console.error("Vault Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <DashboardSkeleton />;

  // Clean White Card with Soft Shadow
  const whiteCard = "bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow duration-300 h-full";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            <p className="text-teal-600 text-[10px] font-black uppercase tracking-[0.3em]">
              Vault Protocol Alpha
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">
            Global <span className="text-gray-300 italic">Ledger</span>
          </h2>
        </div>
        <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm">
          <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-1 text-right">Liquidity Pool</p>
          <p className="text-xl font-mono font-bold text-gray-900 tracking-tighter">
            {(data?.summary?.totalNetValue || 0).toLocaleString()} <span className="text-amber-500 text-sm font-bold">LTB</span>
          </p>
        </div>
      </div>

      {/* SUMMARY TILES */}
      <FadeIn>
        <div className="mb-12">
          <VaultSummaryCards summary={data.summary} />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* MAIN GROWTH AREA CHART */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className={whiteCard}>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 uppercase italic">Ecosystem Velocity</h3>
                <p className="text-teal-600 text-[10px] font-black tracking-[0.2em] mt-1 italic">ACTIVE CAPITAL FLOW</p>
              </div>
            </div>
            
            <div style={{ width: '100%', height: 350, minHeight: 350 }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.merchantData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netValue" 
                      stroke="#f59e0b" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorNet)" 
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </FadeIn>

        {/* REWARDS ARM PIE CHART */}
        <FadeIn delay={400}>
          <div className={`${whiteCard} flex flex-col justify-between`}>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Rewards Arm</h3>
            
            <div style={{ width: '100%', height: 280, minHeight: 280 }} className="flex justify-center items-center">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
  data={data.referralData}
  innerRadius="70%"
  outerRadius="90%"
  paddingAngle={8}
  dataKey="value"
  stroke="none"
  // Add a slight start angle to make it look like a gauge
  startAngle={180}
  endAngle={-180}
>
  {data.referralData.map((entry, index) => (
    <Cell 
      key={`cell-${index}`} 
      // #f1f5f9 is Tailwind's Slate-100: The perfect "Track" color
      fill={index === 0 ? "#f59e0b" : "#f1f5f9"} 
      // Adding a subtle border to the track to define the edges
      stroke={index === 0 ? "none" : "#e2e8f0"}
      strokeWidth={1}
    />
  ))}
</Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100 mt-4">
              <p className="text-3xl font-black text-gray-900 tracking-tighter italic">50 <span className="text-amber-500">/</span> 50</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black mt-1">Steward Ratio</p>
            </div>
          </div>
        </FadeIn>

        {/* TRANSACTION LEDGER */}
        <FadeIn delay={600} className="lg:col-span-3">
          <div className={whiteCard}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-gray-900">Ledger.log</h3>
                <p className="text-teal-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time audit trail</p>
              </div>
              <button className="w-full md:w-auto text-[10px] font-black text-amber-500 border-2 border-amber-100 px-8 py-4 rounded-2xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 tracking-widest uppercase">
                EXPORT SYSTEM LOGS
              </button>
            </div>
            <div className="space-y-3">
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
