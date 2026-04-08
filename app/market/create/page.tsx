"use client";

import { useRouter } from "next/navigation";
import { Home, Car, ShieldCheck, Package, ArrowRight } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
   {
  title: "Sanctuary & Properties",
  path: "/market/create/properties", // Point it HERE
  icon: Home,
  // ...
}
    {
      id: "mobility",
      title: "Mobility & Logistics",
      description: "Cars, Trucks, Motorcycles, and Heavy Machinery Tracking.",
      icon: Car,
      path: "/market/create/mobility",
      isElite: false,
    },
    {
      id: "general",
      title: "General Marketplace",
      description: "Art, Animals, Electronics, and other Living Economy assets.",
      icon: Package,
      path: "/market/create/general",
      isElite: false,
    },
  ];

  return (
    /* 🛡️ THE OVERRIDE: We force a white background and vertical stack using inline styles */
    <div 
      className="w-full min-h-screen flex flex-col items-center py-12 px-6" 
      style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div className="w-full max-w-xl flex flex-col gap-10">
        
        {/* Clean, High-Contrast Header */}
        <div className="text-left border-l-[6px] border-teal-600 pl-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none" style={{ color: '#0f172a' }}>
            Economic Intake
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            Select Asset Deployment Sector
          </p>
        </div>

        {/* The Stack - These cards are forced white */}
        <div className="flex flex-col gap-6 w-full">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className="group w-full flex items-center justify-between p-8 rounded-[2.5rem] border border-slate-200 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
            >
              <div className="flex items-center gap-8 text-left">
                {/* Brand-Heavy Icon Frame */}
                <div 
                   className="p-5 rounded-2xl shadow-xl shrink-0 text-white"
                   style={{ backgroundColor: '#034241' }}
                >
                  <engine.icon size={32} />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 uppercase tracking-tight text-xl leading-none" style={{ color: '#0f172a' }}>
                      {engine.title}
                    </span>
                    {engine.isElite && <ShieldCheck size={18} className="text-teal-600" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-3 font-bold uppercase tracking-widest opacity-60">
                    {engine.id === 'sanctuary' ? 'Sovereign Asset' : 'Market Utility'}
                  </p>
                  <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed max-w-[280px]" style={{ color: '#64748b' }}>
                    {engine.description}
                  </p>
                </div>
              </div>

              {/* High-End Action Circle */}
              <div className="h-12 w-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[#034241] group-hover:text-white group-hover:border-[#034241] transition-all shrink-0">
                <ArrowRight size={22} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer Authority Stamp */}
        <div className="pt-12 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
            Bazaria Authority Protocol v1.02
          </p>
        </div>
      </div>
    </div>
  );
}
