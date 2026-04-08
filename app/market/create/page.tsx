"use client";

import { useRouter } from "next/navigation";
import { Home, Car, ShieldCheck, ChevronRight, Package } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
    {
      id: "sanctuary",
      title: "Caribbean Sanctuary Portfolio",
      description: "Elite Real Estate, Land, Rooms, and Timeshares. Mandatory Sanctuary Audit Required.",
      icon: Home,
      path: "/listings/properties/new",
      isElite: true,
    },
    {
      id: "mobility",
      title: "Mobility & Logistics",
      description: "Cars, Trucks, Motorcycles, RVs, and Heavy Machinery. Includes Fleet tracking.",
      icon: Car,
      path: "/market/create/mobility",
      isElite: false,
    },
    {
      id: "general",
      title: "General Marketplace",
      description: "Art, Animals, Electronics, Services, and other Living Economy goods.",
      icon: Package,
      path: "/market/create/general",
      isElite: false,
    },
  ];

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center py-12 px-6" 
      style={{ backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}
    >
      <div className="w-full max-w-xl flex flex-col gap-8">
        
        {/* Simple Header */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Create New Listing</h1>
          <p className="text-slate-500 text-sm font-medium">Select the sector for your new asset.</p>
        </div>

        {/* Vertical List - Forced Column */}
        <div className="flex flex-col gap-4 w-full" style={{ display: 'flex', flexDirection: 'column' }}>
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className={`w-full flex flex-row items-center justify-between p-6 rounded-2xl border transition-all hover:shadow-lg group ${
                engine.isElite 
                  ? 'bg-white border-teal-500 ring-1 ring-teal-500/10' 
                  : 'bg-white border-slate-200'
              }`}
              style={{ backgroundColor: 'white', display: 'flex' }}
            >
              <div className="flex flex-row items-center gap-5 text-left">
                {/* Icon Circle */}
                <div className={`p-3 rounded-xl shrink-0 ${engine.isElite ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-600'}`}>
                  <engine.icon size={28} />
                </div>

                {/* Text Block */}
                <div className="flex flex-col max-w-sm">
                  <div className="flex flex-row items-center gap-2">
                    <span className="font-black text-slate-900 uppercase tracking-tight text-base leading-none">{engine.title}</span>
                    {engine.isElite && <ShieldCheck size={16} className="text-teal-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                    {engine.description}
                  </p>
                </div>
              </div>

              <ChevronRight size={20} className="text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
            Bazaria Authority Protocol v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
