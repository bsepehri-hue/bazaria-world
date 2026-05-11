import React from 'react';
import { CreditCard, ArrowUpRight, TrendingUp, Lock } from 'lucide-react';

interface CardTrackerProps {
  agentName?: string;
  totalLtbEarned?: number; // e.g., 795
}

export default function DebitCardTracker({ 
  agentName = "BABAK SEPEHRI", 
  totalLtbEarned = 795 
}: CardTrackerProps) {
  
  // Calculate the milestones
  const milestoneUnit = 500;
  const activeCardBalance = Math.floor(totalLtbEarned / milestoneUnit) * milestoneUnit; // 795 -> 500
  const pendingRollover = totalLtbEarned % milestoneUnit; // 795 -> 295
  const remainingToNextUnlock = milestoneUnit - pendingRollover; // 500 - 295 = 205
  const progressPercentage = (pendingRollover / milestoneUnit) * 100; // 59%

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: THE PREMIUM PHYSICAL CARD MOCKUP (5 Cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          {/* Interactive Card */}
          <div className="relative w-80 h-48 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-800 p-6 shadow-xl transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-orange-950/50 hover:shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Background Accent Design */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />
            
            {/* Top of Card */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] tracking-widest text-orange-200 uppercase font-medium">Bazaria World</p>
                <p className="text-xs text-white/80 font-semibold tracking-wider">PREMIUM PARTNER</p>
              </div>
              <CreditCard className="w-8 h-8 text-white/90" />
            </div>

            {/* Chip Icon */}
            <div className="w-10 h-8 rounded-md bg-gradient-to-r from-amber-200 to-amber-300/80 border border-amber-400/40 shadow-inner" />

            {/* Bottom of Card */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] tracking-wider text-orange-200/70">CARDHOLDER</p>
                <p className="text-sm font-bold tracking-widest text-white">{agentName}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] tracking-wider text-orange-200/70">STATUS</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold tracking-wider uppercase text-white animate-pulse">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Physical card active & loaded
          </p>
        </div>

        {/* RIGHT COLUMN: THE MATHEMATICAL TRAP & MILESTONE (7 Cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Header Summary */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Your Payout Center</h3>
            <p className="text-sm text-slate-400">Track and unlock your earnings in $500 increments.</p>
          </div>

          <hr className="border-slate-800" />

          {/* Account Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Metric 1: Loaded on Card */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-emerald-500 font-bold tracking-wider uppercase flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Loaded on Card
              </span>
              <p className="text-3xl font-black mt-1 text-emerald-400">${activeCardBalance.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 mt-1">Available for immediate cash-out</p>
            </div>

            {/* Metric 2: Pending Rollover */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-orange-400 font-bold tracking-wider uppercase flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Pending Rollover
              </span>
              <p className="text-3xl font-black mt-1 text-orange-300">{pendingRollover} LTB</p>
              <p className="text-[11px] text-slate-400 mt-1">Building toward your next $500</p>
            </div>
          </div>

          {/* THE PROGRESS BAR (The Psychological Chase) */}
          <div className="space-y-2 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Progress to Next Payout</span>
              <span className="text-orange-400 font-bold">{pendingRollover} / 500 LTB</span>
            </div>
            
            {/* The Outer Bar */}
            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/30">
              {/* Inner Glowing Fill */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-xs text-slate-400">
                You are only <strong className="text-white">{remainingToNextUnlock} LTB</strong> away from unlocking another <strong className="text-emerald-400">$500.00</strong> on your card!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
