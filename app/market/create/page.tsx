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
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Simple Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Listing</h1>
          <p className="text-slate-500 text-sm">Select the sector for your new asset.</p>
        </div>

        {/* Vertical List - Simplified & Clean */}
        <div className="space-y-4">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border bg-white transition-all hover:border-teal-600 hover:shadow-md group ${
                engine.isElite ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                {/* Icon Circle */}
                <div className={`p-3 rounded-xl shrink-0 ${engine.isElite ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-600'}`}>
                  <engine.icon size={24} />
                </div>

                {/* Text Block */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 leading-none">{engine.title}</span>
                    {engine.isElite && <ShieldCheck size={14} className="text-teal-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[280px]">
                    {engine.description}
                  </p>
                </div>
              </div>

              <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer Authority Stamp */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
            Bazaria Authority Protocol v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
