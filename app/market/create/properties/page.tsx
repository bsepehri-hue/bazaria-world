"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trees, Home, Map, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

export default function PropertySubGateway() {
  const router = useRouter();

  useEffect(() => {
    // 🛡️ THE GLOBAL OVERRIDE
    // This creates a "CSS Virus" that kills the green and forces everything to the front.
    const style = document.createElement('style');
    style.innerHTML = `
      /* 1. Target the actual containers holding the green */
      body, main, .page-shell, .page-body, section {
        background-color: #f8f8f5 !important;
        background: #f8f8f5 !important;
        padding: 0 !important;
      }

      /* 2. Force the CSS variable to be white at the root */
      :root {
        --teal-primary: #f8f8f5 !important;
      }

      /* 3. Ensure your specific portal content is on top of EVERYTHING */
      #sovereign-portal {
        position: relative !important;
        z-index: 999999 !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
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
    <div id="sovereign-portal" className="w-full min-h-screen bg-[#f8f8f5] py-12 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        
        <button 
          onClick={() => router.push("/market/create")} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-black uppercase text-[10px] tracking-widest bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="mb-12 border-l-4 border-cyan-500 pl-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2 font-black uppercase text-[9px] tracking-[0.3em]">
            <ShieldCheck size={12} className="text-cyan-600" />
            Sovereign Intake: Sanctuary
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Property Portal
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propertyTiers.map((tier) => (
            <button 
              key={tier.id} 
              onClick={() => router.push(tier.path)} 
              className="group bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all flex flex-col overflow-hidden text-center cursor-pointer min-h-[400px]"
            >
              {/* Card Header - Hardcoded Colors */}
              <div className={`${tier.accent} p-6 flex flex-col items-center justify-center gap-2`}>
                <tier.icon size={24} className="text-white" />
                <h2 className="text-[12px] font-black text-white uppercase tracking-widest">
                  {tier.title}
                </h2>
              </div>
              
              {/* Card Body - Hardcoded White */}
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

        <div className="mt-32 text-center opacity-20">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-900">
            Bazaria Authority Protocol
          </p>
        </div>
      </div>
    </div>
  );
}
