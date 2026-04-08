"use client";

import { useRouter } from "next/navigation";
import { Home, Car, Building2, ShieldCheck, ChevronRight, Package } from "lucide-react";

export default function CreateListingGateway() {
  const router = useRouter();

  const engines = [
    {
      id: "sanctuary",
      title: "Caribbean Sanctuary Portfolio",
      description: "Elite Real Estate, Land, Rooms, and Timeshares. Mandatory Audit Required.",
      icon: Home,
      path: "/listings/properties/new",
      color: "bg-[#034241]",
      isElite: true,
    },
    {
      id: "mobility",
      title: "Mobility & Logistics",
      description: "Cars, Trucks, Motorcycles, RVs, and Heavy Machinery.",
      icon: Car,
      path: "/market/create/mobility", // We will create this next
      color: "bg-slate-700",
      isElite: false,
    },
    {
      id: "general",
      title: "General Marketplace",
      description: "Art, Services, Electronics, and other Living Economy goods.",
      icon: Package,
      path: "/market/create/general",
      color: "bg-slate-700",
      isElite: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Create Listing</h1>
          <p className="text-slate-500 font-medium italic">Select your sector within the Bazaria Economy.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className={`group relative overflow-hidden text-left p-8 rounded-3xl border-2 transition-all hover:scale-[1.01] shadow-sm ${
                engine.isElite 
                  ? "bg-[#034241] border-teal-400 text-white" 
                  : "bg-white border-slate-200 text-slate-900 hover:border-teal-600/30"
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl ${engine.isElite ? 'bg-teal-400/20' : 'bg-slate-100'}`}>
                    <engine.icon className={engine.isElite ? 'text-teal-400' : 'text-teal-700'} size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black uppercase tracking-tight">{engine.title}</h2>
                      {engine.isElite && <ShieldCheck size={18} className="text-teal-400" />}
                    </div>
                    <p className={`text-sm mt-1 max-w-md ${engine.isElite ? 'text-teal-100/60' : 'text-slate-500'}`}>
                      {engine.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={engine.isElite ? 'text-teal-400' : 'text-slate-300'} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
