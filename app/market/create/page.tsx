"use client";

import { useRouter } from "next/navigation";
import { Home, Car, ShieldCheck, Package, ArrowRight } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
    {
      id: "sanctuary",
      title: "Caribbean Sanctuary Portfolio",
      description: "Elite Real Estate, Land, and Timeshares. Mandatory Audit Required.",
      icon: Home,
      path: "/listings/properties/new",
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
      description: "Art, Animals, Electronics, and other Living Economy assets.",
      icon: Package,
      path: "/market/create/general",
      isElite: false,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-slate-50 p-8">
      <div className="w-full max-w-xl flex flex-col gap-8">
        
        <div className="mb-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Economic Intake</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Select Asset Deployment Sector</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className="group w-full flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-teal-500"
              style={{ textAlign: 'left' }}
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-[#034241] text-white shadow-lg shrink-0">
                  <engine.icon size={24} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">{engine.title}</span>
                    {engine.isElite && <ShieldCheck size={16} className="text-teal-600" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium leading-tight max-w-[240px]">
                    {engine.description}
                  </p>
                </div>
              </div>

              <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-teal-500 group-hover:text-white transition-all shrink-0">
                <ArrowRight size={18} />
              </div>
            </button>
          ))}
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 text-center mt-12">
          Bazaria Authority Protocol v1.02
        </p>
      </div>
    </div>
  );
}
