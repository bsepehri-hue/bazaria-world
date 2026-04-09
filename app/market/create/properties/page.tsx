"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trees, Home, Map, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

export default function PropertySubGateway() {
  const router = useRouter();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* 🛡️ FORCE BACKGROUND TO THE BOTTOM */
      body, main, .page-shell, .page-body {
        background-color: #f8f8f5 !important;
        background-image: none !important;
        z-index: 0 !important;
      }
      /* 🛡️ KILL THE GREEN FRAME */
      main {
        padding: 0 !important;
      }
      /* 🛡️ ENSURE THE CONTENT CONTAINER IS ABOVE THE INJECTED WHITE */
      #property-portal-container {
        position: relative !important;
        z-index: 9999 !important;
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
      title: "Caribbean Portfolio 🌴",
      description: "Elite Vacation Properties & International Estates.",
      icon: Trees, 
      path: "/market/create/properties/hospitality",
      color: "bg-cyan-600"
    },
    {
      id: "homes",
      title: "Residential Homes",
      description: "Standard Housing, Apartments, and Condos.",
      icon: Home,
      path: "/market/create/properties/home",
      color: "bg-[#014d4e]"
    },
    {
      id: "land",
      title: "Land & Soil",
      description: "Development plots, Acreage, and Agricultural land.",
      icon: Map,
      path: "/market/create/properties/land",
      color: "bg-amber-700"
    }
  ];

  return (
    /* 🏗️ ID MATCHES THE INJECTED STYLE ABOVE */
    <div id="property-portal-container" className="w-full min-h-screen pt-12 pb-24 px-8 md:px-20">
      <main className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => router.push("/market/create")} 
          className="flex items-center gap-2 text-slate-400 hover:text-[#014d4e] transition-colors mb-12 font-black uppercase text-[10px] tracking-widest border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="mb-12 border-l-4 border-cyan-500 pl-6">
          <div className="flex items-center gap-2 text-cyan-600 mb-2 font-black uppercase text-[9px] tracking-[0.3em]">
            <ShieldCheck size={12} />
            Asset Sector: Sanctuary
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Property Portal
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {propertyTiers.map((tier) => (
            <button 
              key={tier.id} 
              onClick={() => router.push(tier.path)} 
              className="group flex items-center justify-between p-6 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-lg ${tier.color} text-white shadow-lg`}>
                  <tier.icon size={24} />
                </div>
                <div className="text-left">
                  <h2 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">
                    {tier.title}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-bold uppercase italic mt-2 tracking-tight">
                    {tier.description}
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-cyan-50 transition-colors">
                <ChevronRight size={20} className="text-slate-300 group-hover:text-cyan-600 transition-all transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
            Bazaria Authority Protocol v1.02
          </p>
        </div>
      </main>
    </div>
  );
}
