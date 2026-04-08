"use client";

import { useRouter } from "next/navigation";
import { Home, Map, BedDouble, CalendarClock, ArrowLeft, ChevronRight } from "lucide-react";

export default function SanctuarySubGateway() {
  const router = useRouter();

  const propertyTiers = [
    {
      id: "homes",
      title: "Villas & Estates",
      description: "Houses, Penthouses, and Luxury Condominiums.",
      icon: Home,
      path: "/market/create/properties/home",
      color: "bg-[#034241]",
    },
    {
      id: "land",
      title: "Land & Development",
      description: "Coastal Plots, Acreage, and Commercial Zoned Land.",
      icon: Map,
      path: "/market/create/properties/land",
      color: "bg-teal-700",
    },
    {
      id: "rooms",
      title: "Rooms & Rentals",
      description: "Boutique Suites and Short-term Resident stays.",
      icon: BedDouble,
      path: "/market/create/properties/room",
      color: "bg-slate-700",
    },
    {
      id: "timeshare",
      title: "Timeshare Certificates",
      description: "Guaranteed Weekly access and Fractional ownership.",
      icon: CalendarClock,
      path: "/market/create/properties/timeshare",
      color: "bg-slate-800",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <button onClick={() => router.push("/market/create")} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-10 font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Main Gateway
        </button>

        <div className="mb-12 border-l-4 border-[#034241] pl-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Sanctuary Selection
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            Asset Class Deployment
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {propertyTiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => router.push(tier.path)}
              className="group flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center gap-6 text-left">
                <div className={`p-4 rounded-2xl ${tier.color} text-white shadow-lg shrink-0`}>
                  <tier.icon size={24} />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">
                    {tier.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    {tier.description}
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-200 group-hover:text-teal-500 group-hover:bg-teal-50 transition-all">
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
