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
    <div className="min-h-screen bg-slate-50 p-8 md:p-16 flex flex-col items-center">
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
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs mt-3">
            Select Asset Deployment Sector
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => router.push(engine.path)}
              className="group relative p-10 bg-white rounded-[3rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-6 border border-slate-100 overflow-hidden"
            >
              {/* Top Accent Bar */}
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

        <div className="mt-20 p-8 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-between gap-8 border-b-8 border-teal-500 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-teal-500 rounded-2xl shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-black uppercase tracking-tighter italic">Authority Protocol Active</h3>
              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1">
                All deployments are bound by the 3-day sovereign contract.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
