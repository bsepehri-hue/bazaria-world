"use client";

import { useRouter } from "next/navigation";
import { Trees, Home, Map, ArrowLeft, ChevronRight } from "lucide-react";

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
    <div className="relative min-h-screen w-full !bg-[#f8f8f5]" style={{ backgroundColor: '#f8f8f5' }}>
      <main className="relative z-10 p-8 md:p-16 max-w-4xl mx-auto">
        <button 
          onClick={() => router.push("/market/create")} 
          className="flex items-center gap-2 text-slate-400 hover:text-[#014d4e] transition-colors mb-12 font-black uppercase text-[10px] tracking-widest border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="mb-12 border-l-4 border-cyan-500 pl-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Property Portal</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 text-left">Sector: Sanctuary & Estates</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {propertyTiers.map((tier) => (
            <button key={tier.id} onClick={() => router.push(tier.path)} className="group flex items-center justify-between p-6 rounded-xl bg-white border border-slate-200 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-lg ${tier.color} text-white shadow-md`}><tier.icon size={24} /></div>
                <div className="text-left">
                  <h2 className="font-black text-slate-900 uppercase tracking-tight">{tier.title}</h2>
                  <p className="text-[11px] text-slate-400 font-bold uppercase italic">{tier.description}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
