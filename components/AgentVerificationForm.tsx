{/* OPTION A: SUPPORT STAFF (THE METRIC-DRIVEN POOL) */}
<div 
  onClick={() => setRole('support')}
  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${role === 'support' ? 'bg-amber-950/20 border-amber-500 shadow-lg shadow-amber-950/20' : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'}`}
>
  {role === 'support' && (
    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-md">
      ACTIVE IN POOL
    </div>
  )}
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${role === 'support' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
          <Users className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-white">Sales Support Staff</h4>
      </div>
      
      {/* Visual Indicator of the 80% Rule */}
      <div className="text-right">
        <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-wider">POOL REQUIREMENT</span>
        <span className="text-xs font-black text-emerald-400">🏆 ≥ 80% CSAT</span>
      </div>
    </div>

    <p className="text-xs text-slate-400 leading-relaxed mt-1">
      Opt-in to service platform buyers. Maintain a 5-star ranking to unlock corporate distributions.
    </p>

    {/* The Psychological Warning / Motivation Loop */}
    <div className="mt-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/60 text-[11px] text-slate-400">
      ⚠️ <strong className="text-white">The 80% Rule:</strong> If your customer satisfaction metric drops below 80%, the autonomous router will temporarily pause your account from receiving free closed sales until your score recovers.
    </div>

    <ul className="mt-3 space-y-1.5 text-[11px] text-amber-400 font-medium">
      <li className="flex items-center gap-1.5">🎁 Receives fully processed, platform-closed transactions</li>
      <li className="flex items-center gap-1.5">✓ Priority routing for automated high-intent Orphan Leads</li>
      <li className="flex items-center gap-1.5">🚀 Fast-track accelerator to your $500 physical debit card</li>
    </ul>
  </div>
</div>
