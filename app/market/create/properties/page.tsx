"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trees, Home, Map, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

export default function PropertySubGateway() {
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    const main = document.querySelector('main');
    
    // 1. Force the layout background to off-white and push it to the absolute bottom
    root.style.setProperty('--teal-primary', '#f8f8f5');
    if (main) {
      main.style.setProperty('background-color', '#f8f8f5', 'important');
      main.style.setProperty('z-index', '0', 'important');
      main.style.setProperty('position', 'relative', 'important');
    }

    return () => {
      root.style.removeProperty('--teal-primary');
      if (main) {
        main.style.removeProperty('background-color');
        main.style.removeProperty('z-index');
      }
    };
  }, []);

  const propertyTiers = [
    {
      id: "caribbean",
      title: "Caribbean Portfolio",
      description: "Elite Vacation Properties & International Estates.",
      icon: Trees, 
      path: "/market/create/properties/hospitality",
      accent: "bg-cyan-600"
    },
    {
      id: "homes",
      title: "Residential Homes",
      description: "Standard Housing, Apartments, and Condos.",
      icon: Home,
      path: "/market/create/properties/home",
      accent: "bg-[#014d4e]"
    },
    {
      id: "land",
      title: "Land & Soil",
      description: "Development plots, Acreage, and Agricultural land.",
      icon: Map,
      path: "/market/create/properties/land",
      accent: "bg-amber-700"
    }
  ];

  return (
    /* 🛡️ THE Z-INDEX HAMMER 
       We use z-[9999] and relative positioning to force this 
       ENTIRE block to sit on top of the parent layout.
    */
    <div className="relative z-[9999] w-full min-h-screen pt-12 pb-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        
        <button 
          onClick={() => router.push("/market/create")} 
          className="relative z-[10000] flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-black uppercase text-[10px] tracking-widest bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="mb-12 border-l-4 border-cyan-500 pl-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2 font-black uppercase text-[9px] tracking-[0.3em]">
            <ShieldCheck size={12} className="text-cyan-600" />
            Asset Sector: Sanctuary
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Property Portal
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {propertyTiers.map((tier) => (
            <button 
              key={tier.id} 
              onClick={() => router.push(tier.path)} 
              className="group relative z-[10000] bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all flex flex-col overflow-hidden text-center cursor-pointer min-h-[380px]"
            >
              {/* Header */}
              <div className={`${tier.accent} p-6 flex flex-col items-center justify-center gap-2`}>
                <tier.icon size={24} className="text-white" />
                <h2 className="text-[12px] font-black text-white uppercase tracking-widest">
                  {tier.title}
                </h2>
              </div>
              
              {/* Body */}
              <div className="p-10 flex flex-col items-center justify-between flex-1 bg-white">
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed px-4">
                  {tier.description}
                </p>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-[#014d4e] transition-all">
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-24 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-900">
            Bazaria Authority Protocol v1.02
          </p>
        </div>
      </div>
    </div>
  );
}
