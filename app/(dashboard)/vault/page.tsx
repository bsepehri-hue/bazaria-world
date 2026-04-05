That "Expected </" error is almost always a tag mismatch. It’s like a puzzle piece where one <div> or <FadeIn> was opened but either never closed or closed in the wrong order, causing the compiler to get lost in the "JSX text."

Let’s get the Vault Command back online. I have meticulously cleaned the tags in this version to ensure every FadeIn and div is perfectly balanced.

🛠️ The Cleaned & Corrected app/(dashboard)/vault/page.tsx
TypeScript
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

  const glassCard = "bg-[#003d33]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl";

  return (
    <div className="min-h-screen bg-[#002d26] p-8 text-white font-sans selection:bg-[#FFBF00] selection:text-[#002d26]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-[#FFBF00] animate-pulse" />
            <p className="text-[#FFBF00] text-[10px] font-black uppercase tracking-[0.3em]">
              Vault Protocol Alpha
            </p>
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-white">
            Global <span className="text-white/20 italic">Ledger</span>
          </h2>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
          <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1 text-right">Liquidity Pool</p>
          <p className="text-xl font-mono font-bold text-white tracking-tighter">
            {(data?.summary?.totalNetValue || 0).toLocaleString()} <span className="text-[#FFBF00] text-sm font-bold">LTB</span>
          </p>
        </div>
      </div>

      {/* SUMMARY TILES */}
      <FadeIn>
        <div className="mb-12">
          <VaultSummaryCards summary={data.summary} />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN GROWTH AREA CHART */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className={glassCard}>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Ecosystem Velocity</h3>
                <p className="text-white/40 text-xs mt-1 font-medium">Net value processed across all license holders</p>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-[10px] border border-white/10 cursor-pointer font-bold tracking-tighter">7D</div>
                <div className="h-9 w-9 rounded-xl bg-[#FFBF00] flex items-center justify-center text-[10px] text-[#002d26] font-black border border-[#FFBF00] shadow-lg shadow-[#FFBF00]/20 tracking-tighter">30D</div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.merchantData}>
                    <defs>
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFBF00" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#FFBF00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={15}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#002d26', border: '1px solid #FFBF00', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', color: '#fff' }}
                      itemStyle={{ color: '#FFBF00', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netValue" 
                      stroke="#FFBF00" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorNet)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </FadeIn>

        {/* REWARDS ARM PIE CHART */}
        <FadeIn delay={400}>
          <div className={`${glassCard} flex flex-col justify-between h-full`}>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white">Rewards Arm</h3>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Internal Distribution</p>
            </div>
            
            <div className="h-[280px] w-full flex justify-center items-center py-4">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.referralData}
                      innerRadius="75%"
                      outerRadius="95%"
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                      animationBegin={500}
                      animationDuration={1200}
                    >
                      {data.referralData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#FFBF00" : "rgba(255,255,255,0.05)"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5">
              <p className="text-3xl font-black text-white tracking-tighter">50 <span className="text-[#FFBF00]">/</span> 50</p>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Partner Profit Share</p>
            </div>
          </div>
        </FadeIn>

        {/* TRANSACTION LEDGER */}
        <FadeIn delay={600} className="lg:col-span-3">
          <div className={glassCard}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">Ledger.log</h3>
                <p className="text-[#4d8a80] text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time audit trail</p>
              </div>
              <button className="w-full md:w-auto text-[10px] font-black text-[#FFBF00] border-2 border-[#FFBF00]/20 px-8 py-4 rounded-2xl hover:bg-[#FFBF00] hover:text-[#002d26] hover:border-[#FFBF00] transition-all duration-300 tracking-widest uppercase">
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
