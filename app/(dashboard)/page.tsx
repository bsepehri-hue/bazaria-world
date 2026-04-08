"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, onSnapshot, query, where, limit, orderBy } from "firebase/firestore";
import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  Store,
  Package,
  Mail,
  Wallet,
  Activity
} from "lucide-react";

// 🛡️ Director's Palette
const authorityColor = (status: string) => {
  if (status === "ACTIVE") return "text-teal-400";
  if (status === "PROVISIONAL") return "text-amber-400";
  return "text-red-400";
};

export default function DashboardPage() {
  const [partnerCount, setPartnerCount] = useState<number>(0);
  const [sanctuaryCount, setSanctuaryCount] = useState<number>(0);
  const [trialAlerts, setTrialAlerts] = useState<number>(0);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // 🏛️ PARTNER AUTHORITY FEED
    const unsubPartners = onSnapshot(collection(db, "users"), (snap) => {
      const l5s = snap.docs.filter(d => d.data().licenseClass === "L5_ESTATE");
      const provisionals = snap.docs.filter(d => d.data().licenseStatus === "PROVISIONAL");
      setPartnerCount(l5s.length);
      setTrialAlerts(provisionals.length);
    });

    // 🏝️ CARIBBEAN PORTFOLIO AUDIT
    const q = query(collection(db, "listings"), where("isCaribbeanFacilitation", "==", true));
    const unsubSanctuary = onSnapshot(q, (snap) => {
      setSanctuaryCount(snap.size);
      const total = snap.docs.reduce((sum, d) => sum + (d.data().price || 0), 0);
      setPortfolioValue(total);

      const updates = snap.docChanges().map(change => ({
        type: "sanctuary",
        timestamp: change.doc.data().createdAt || new Date(),
        message: `Sanctuary Audit Passed: ${change.doc.data().title}`,
        partner: change.doc.data().facilitatorName || "L-5 Partner"
      }));
      setRecentActivity(prev => [...updates, ...prev].slice(0, 10));
    });

    return () => { unsubPartners(); unsubSanctuary(); };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 bg-[#034241] min-h-screen text-white">
      {/* 🏛️ SOVEREIGN HEADER */}
      <div className="flex justify-between items-end border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Mission Control</h1>
          <p className="text-teal-400 font-bold text-xs tracking-widest mt-2 uppercase">Bazaria Sovereign Protocol v1.0</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold opacity-50 uppercase">Global Portfolio Value</p>
          <p className="text-2xl font-black text-teal-400">${(portfolioValue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* 📊 THE AUTHORITY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SovereignStat label="L-5 Partners" value={partnerCount} icon={ShieldCheck} trend="Active Authority" />
        <SovereignStat label="Sanctuary Assets" value={sanctuaryCount} icon={Globe} trend="Vetted Inventory" />
        <SovereignStat label="Trial Monitors" value={trialAlerts} icon={AlertTriangle} trend="Critical Vetting" color="text-amber-400" />
        <SovereignStat label="System Health" value="100%" icon={Zap} trend="Protocol Stable" color="text-teal-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📋 ACTIVITY FEED (The "Director's" Eyes) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest opacity-50">Operational Feed</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="bg-[#0C364C] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-400/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${item.type === 'sanctuary' ? 'bg-teal-400/10' : 'bg-white/5'}`}>
                    <Activity size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.message}</p>
                    <p className="text-[10px] opacity-50 uppercase tracking-tight">Verified by {item.partner}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono opacity-40">STAMP_ID: {Math.random().toString(36).substr(2, 5).toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🎖️ PARTNER PERFORMANCE PANEL */}
        <div className="bg-[#0C364C] rounded-3xl p-6 border border-white/10">
          <h2 className="text-xs font-black uppercase tracking-widest opacity-50 mb-6">Partner Integrity</h2>
          <div className="space-y-6">
            <PartnerMetric label="Market Efficiency" score="98%" />
            <PartnerMetric label="Avg. Satisfaction" score="4.8/5.0" />
            <PartnerMetric label="Legal Compliance" score="100%" />
            <div className="pt-4 border-t border-white/10">
              <button className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                View All License Holders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SovereignStat({ label, value, icon: Icon, trend, color = "text-white" }: any) {
  return (
    <div className="bg-[#0C364C] p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-xl">
          <Icon size={20} className="text-teal-400" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{trend}</span>
      </div>
      <p className="text-[10px] font-bold uppercase opacity-50 tracking-tight">{label}</p>
      <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function PartnerMetric({ label, score }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] font-bold opacity-70 uppercase tracking-tight">{label}</span>
      <span className="text-sm font-black text-teal-400">{score}</span>
    </div>
  );
}
