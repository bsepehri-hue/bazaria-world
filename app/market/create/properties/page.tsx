"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trees, Home, Map, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

export default function PropertySubGateway() {
  const router = useRouter();

  // 🛡️ THE SKY-LEVEL OVERRIDE
  useEffect(() => {
    const main = document.querySelector('main');
    const root = document.documentElement;

    if (main) {
      // We kill the padding that allows the green to show through as a "frame"
      main.style.setProperty('padding', '0px', 'important');
      main.style.setProperty('background-color', '#f8f8f5', 'important');
    }
    // We neutralize the global teal variable just for this view
    root.style.setProperty('--teal-primary', '#f8f8f5');

    return () => {
      if (main) {
        main.style.removeProperty('padding');
        main.style.removeProperty('background-color');
      }
      root.style.removeProperty('--teal-primary');
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
    /* 🛡️ THE BLEED CONTAINER: 
       By using negative margins, we stretch the white background OVER the parent's padding gaps.
    */
    <div 
      className="min-h-screen w-full !bg-[#f8f8f5]"
      style={{ 
        backgroundColor: '#f8f8f5',
        margin: '-40px', // Adjusted to common layout padding
        padding: '40px', 
        minHeight: '110vh'
      }}
    >
      <main className="relative z-10 max-w-4xl mx-auto pt-10 px-6">
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
              className="group flex items-center justify-between p-6 rounded-xl bg-white border border-slate-200 hover:shadow-2xl hover:border-cyan-100 transition-all cursor-pointer"
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
      </main>
    </div>
  );
}
