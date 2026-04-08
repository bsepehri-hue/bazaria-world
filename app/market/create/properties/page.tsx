"use client";

import { useRouter } from "next/navigation";
import { Home, Map, ArrowLeft, ChevronRight, Trees } from "lucide-react";

export default function SanctuarySubGateway() {
  const router = useRouter();

  const propertyTiers = [
    {
      id: "caribbean",
      title: "Caribbean Portfolio 🌴",
      description: "Elite Vacation Properties & International Estates.",
      icon: Trees, 
      path: "/market/create/properties/hospitality",
      color: "bg-cyan-500",
      featured: true
    },
    {
      id: "homes",
      title: "Residential Homes",
      description: "Standard Housing, Apartments, and Condos.",
      icon: Home,
      path: "/market/create/properties/home",
      color: "bg-[#034241]",
      featured: false
    },
    {
      id: "land",
      title: "Land & Soil",
      description: "Development plots, Acreage, and Agricultural land.",
      icon: Map,
      path: "/market/create/properties/land",
      color: "bg-amber-700",
      featured: false
    }
  ];

 return (
  /* - 'fixed inset-0' creates a background layer that ignores parent padding/margins.
     - '!bg-[#f8fafc]' (Slate-50) is the forced light gray.
  */
  <main className="relative min-h-screen w-full overflow-y-auto">
    
    {/* 🛡️ BACKGROUND OVERRIDE LAYER */}
    <div 
      className="fixed inset-0 !bg-[#f8fafc] -z-10" 
      style={{ backgroundColor: '#f8fafc', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }} 
    />

    {/* 🏗️ CONTENT LAYER */}
    <div className="relative z-10 p-8 md:p-16 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* ... Rest of your Gateway / Sub-Gateway content goes here ... */}
      </div>
    </div>
  </main>
);
          
          <button 
            onClick={() => router.push("/market/create")} 
            className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-10 font-black uppercase text-[10px] tracking-widest border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft size={16} /> Main Gateway
          </button>

          <div className="mb-12 border-l-4 border-cyan-500 pl-6">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              Property Portal
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
              Choose your deployment sector
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {propertyTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => router.push(tier.path)}
                className={`group flex items-center justify-between p-6 rounded-[2rem] bg-white border transition-all hover:shadow-xl cursor-pointer ${
                  tier.featured ? 'border-cyan-200 ring-4 ring-cyan-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-6 text-left">
                  <div className={`p-4 rounded-2xl ${tier.color} text-white shadow-lg shrink-0`}>
                    <tier.icon size={24} />
                  </div>
                  <div className="text-left">
                    <h2 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">
                      {tier.title}
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase italic tracking-tight">
                      {tier.description}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
