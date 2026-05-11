'use client';

import React from 'react';
import { Trophy, ArrowUpRight, Zap, Award } from 'lucide-react';

interface MilestoneTrackerProps {
  currentLtb?: number;
  targetLtb?: number;
}

export default function MilestoneTracker({
  currentLtb = 340,
  targetLtb = 500
}: MilestoneTrackerProps) {
  const percentage = Math.min(Math.round((currentLtb / targetLtb) * 100), 100);
  const remaining = targetLtb - currentLtb;

  // SVG Progress Ring Math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h4 className="text-sm font-black tracking-wide uppercase text-slate-400">Card Payout Threshold</h4>
          <p className="text-2xl font-black text-white mt-1">First Milestone</p>
        </div>
        <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-400">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* INTERACTIVE PROGRESS RING */}
        <div className="relative flex items-center justify-center w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ stroke: '#f59e0b' }} // Fallback amber-500 color
            />
          </svg>
          {/* Percentage Text Center */}
          <div className="absolute text-center">
            <span className="text-2xl font-black tracking-tight text-white">{percentage}%</span>
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Done</span>
          </div>
        </div>

        {/* METRIC BREAKDOWN */}
        <div className="flex-grow space-y-4 w-full sm:w-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
              <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-wider">Current Earned</span>
              <span className="text-lg font-black text-white">{currentLtb} LTB</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
              <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-wider">Target Vault</span>
              <span className="text-lg font-black text-slate-400">{targetLtb} LTB</span>
            </div>
          </div>

          {remaining > 0 ? (
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
              <p className="text-xs text-amber-200/90 leading-normal">
                Earn <strong className="text-white font-black">{remaining} LTB</strong> more to automatically activate and ship your custom physical debit card.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-200/90 leading-normal">
                <strong className="text-white font-black">Milestone Unlocked!</strong> Your identity documentation has been routed to fulfillment for hardware deployment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QUICK ACCELERATOR CTA */}
      <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400">Want to fast-track your progress?</span>
        <button className="text-amber-400 font-bold flex items-center gap-1 hover:text-amber-300 transition group">
          Inject Volume <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
