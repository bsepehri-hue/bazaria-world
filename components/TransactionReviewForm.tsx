import React, { useState } from 'react';
import { Star, CheckCircle, Flame, ArrowRight } from 'lucide-react';

interface ReviewFormProps {
  transactionId?: string; // e.g. tx_baza_99482
  agentName?: string;
}

export default function TransactionReviewForm({
  transactionId = "TX-BAZA-89472",
  agentName = "Bazaria Partner"
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5); // Default to 5-stars (Keep it positive!)
  const [hover, setHover] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you will push to Firestore: 
    // update agent's CSAT and mark this transactionId as "rated: true"
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-slate-950 border border-emerald-500/30 rounded-3xl text-center space-y-4 shadow-2xl shadow-emerald-950/20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">Receipt Verified & Rated!</h3>
        <p className="text-xs text-slate-400 px-4">
          Transaction <code className="text-amber-400 font-mono text-[11px]">{transactionId}</code> has successfully pushed 5-stars to the network pool.
        </p>
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-medium">
          🚀 Platform volume updated. Transaction active.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Visual background flare */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-slate-400 font-mono uppercase tracking-wider">
            Verified Receipt: {transactionId}
          </span>
          <h3 className="text-xl font-black tracking-tight pt-2">Rate Your Platform Experience</h3>
          <p className="text-xs text-slate-400">Every paid transaction secures eligibility for our 5-star incentive pools.</p>
        </div>

        {/* The Star Selector Interactive Loop */}
        <div className="flex justify-center items-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform duration-150 hover:scale-125 focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                className={`w-9 h-9 transition-colors duration-150 ${
                  star <= (hover || rating)
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                    : 'text-slate-700 fill-none'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Text Input (Optional) */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Review Comments</label>
          <textarea
            rows={2}
            placeholder="Excellent service, highly professional transaction!"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 text-white placeholder-slate-600 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg hover:from-amber-400 hover:to-orange-500 transition-all uppercase tracking-widest flex items-center justify-center gap-1.5"
        >
          Submit Verified Rating <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
