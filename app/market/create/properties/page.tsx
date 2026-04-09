"use client";

import { useRouter } from "next/navigation";
import { Trees, Home, Map, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

export default function PropertySubGateway() {
  const router = useRouter();

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
    /* 🛡️ THE CONTAINER: No complex absolute positioning. 
       We use a massive box-shadow to bleed color outward into the parent's padding. 
    */
    <div className="relative w-full min-h-screen">
      
      {/* 🛡️ THE BACKGROUND PLUG: 
          Instead of 'fixed', we use 'absolute inset-0' with a huge spread shadow. 
      */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundColor: '#f8f8f5', 
          boxShadow: '0 0 0 1000px #f8f8f5', // Drowns the green layout in white ink
          zIndex: 1 
        }} 
      />

      {/* 🏗️ THE CONTENT: 
          Forced to Z-10 to stay ABOVE the white ink.
      */}
      <div className="relative z-10 p-8 md:p-16 max-w-4xl mx-auto">
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
              className="group flex items-center justify-between p-6 rounded-xl bg-white border border-slate-200 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-20">
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
              <div className="relative z-20 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-cyan-50 transition-colors">
                <ChevronRight size={20} className="text-slate-300 group-hover:text-cyan-600 transition-all transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
            Bazaria Authority Protocol
          </p>
        </div>
      </div>
    </div>
  );
}
