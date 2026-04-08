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
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Create New Listing</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Select the sector for your new asset.</p>
        </div>

        {/* Vertical Stack */}
        <div className="space-y-4">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all hover:shadow-md group bg-white ${
                engine.isElite 
                  ? 'border-teal-500 shadow-sm' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-5 text-left">
                {/* Icon Circle */}
                <div className={`p-3 rounded-xl shrink-0 ${engine.isElite ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-600'}`}>
                  <engine.icon size={24} />
                </div>

                {/* Text Block */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 uppercase tracking-tight text-base leading-none">
                      {engine.title}
                    </span>
                    {engine.isElite && <ShieldCheck size={14} className="text-teal-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed max-w-md">
                    {engine.description}
                  </p>
                </div>
              </div>

              <ChevronRight size={20} className="text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Bazaria Authority Protocol v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
