"use client";

import { useRouter } from "next/navigation";
import { Home, Car, Package, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
    {
      id: "sanctuary",
      title: "Sanctuary & Properties",
      description: "Villas, Land, and Hospitality Deployment.",
      icon: Home,
      path: "/market/create/properties", 
      isElite: true,
    },
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
      description: "Sovereign Goods, Art, Animals, and Electronics.",
      icon: Package,
      path: "/market/create/general",
      isElite: false,
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 🛡️ THE GREEN KILLER: Forces a clean background over the layout */}
      <div className="fixed inset-0 bg-slate-50 !bg-slate-50 -z-10" />

      <div className="relative z-10 p-8 md:p-16 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          
          <button 
            onClick={() => router.push("/market")} 
            className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-12 font-black uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Market
          </button>

          <div className="mb-16 border-l-8 border-[#034241] pl-8 text-left">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              Economic Intake
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs mt-3 text-left">
              Select Asset Deployment Sector
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engines.map((engine) => (
              <button
                key={engine.id}
                onClick={() => router.push(engine.path)}
                className="group relative p-10 bg-white rounded-[3rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-6 border border-slate-100"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 ${engine.isElite ? 'bg-cyan-500' : 'bg-[#034241]'}`} />
                <div className={`p-6 rounded-[2rem] ${engine.isElite ? 'bg-cyan-500 shadow-cyan-200' : 'bg-[#034241] shadow-teal-200'} text-white shadow-2xl group-hover:scale-110 transition-transform`}>
                  <engine.icon size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="font-black uppercase tracking-tighter text-2xl text-slate-900 leading-tight">
                    {engine.title}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed px-4">
                    {engine.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[#034241] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Begin Intake <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
