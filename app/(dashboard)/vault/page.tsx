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

        console.log("Vault Data Loaded:", merchantPoints.length, "rows");

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

  const glassCard = "bg-[#003d33]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl h-full";

 return (
  <div className="min-h-screen bg-[#002d26] p-4 md:p-8 text-white font-sans">
    {/* ... rest of the code ... */}
  </div>
);
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-[#FFBF00] animate-pulse" />
            <p className="text-[#FFBF00] text-[10px] font-black uppercase tracking-[0.3em]">
              Vault Protocol Alpha
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            Global <span className="text-white/20 italic">Ledger</span>
          </h2>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
          <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1 text-right tracking-tighter">Liquidity Pool</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
      {/* MAIN GROWTH AREA CHART */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className={glassCard}>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white uppercase italic">Ecosystem Velocity</h3>
                <p className="text-[#4d8a80] text-[10px] font-black tracking-[0.2em] mt-1 italic">ACTIVE CAPITAL FLOW</p>
              </div>
            </div>
            
            <div style={{ width: '100%', height: 350, position: 'relative' }}>
              {mounted && data?.merchantData?.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={data.merchantData} 
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFBF00" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#FFBF00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    {/* If 'date' is undefined, this can hide the chart. We'll use index if needed */}
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#002d26', border: '2px solid #FFBF00', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#FFBF00', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netValue" 
                      stroke="#FFBF00" 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#colorNet)" 
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {/* FALLBACK IF DATA IS EMPTY */}
              {mounted && (!data?.merchantData || data.merchantData.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 font-black text-xs tracking-widest italic">
                  WAITING FOR DATA LINK...
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* REWARDS ARM PIE CHART */}
        <FadeIn delay={400}>
          <div className={`${glassCard} flex flex-col justify-between`}>
            <h3 className="text-xl font-bold mb-2 text-white">Rewards Arm</h3>
            
            {/* FIXED HEIGHT WRAPPER */}
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
            
            <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 mt-4">
              <p className="text-3xl font-black text-white tracking-tighter italic">50 <span className="text-[#FFBF00]">/</span> 50</p>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Steward Ratio</p>
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
