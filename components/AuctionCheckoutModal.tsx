import React, { useState, useMemo } from 'react';
import { AlertTriangle, FileText, ShieldCheck } from 'lucide-react';

interface AuctionCheckoutProps {
  assetId: string;
  title: string;
  reservePrice: number;
  finalBidAmount: number;
  onConfirmPayment: (amountToCharge: number) => void;
  onCancel: () => void;
}

export default function AuctionCheckoutModal({
  assetId,
  title,
  reservePrice,
  finalBidAmount,
  onConfirmPayment,
  onCancel
}: AuctionCheckoutProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isHighTicket = finalBidAmount >= 5000;

  const metrics = useMemo(() => {
    if (!isHighTicket) {
      let fee = 0;
      if (finalBidAmount <= reservePrice || reservePrice === 0) {
        fee = finalBidAmount * 0.06;
      } else {
        const reserveFee = reservePrice * 0.06;
        const overageFee = (finalBidAmount - reservePrice) * 0.15;
        fee = reserveFee + overageFee;
      }
      return { isHighTicket: false, dueToday: finalBidAmount + fee, fee: fee };
    } else {
      // 1. Buyer pays 10% Binder
      const binderDeposit = finalBidAmount * 0.10;
      // 2. Bazaria takes 10% of that ($22k)
      const bazariaCommission = binderDeposit * 0.10;
      // 3. Penalty: 10% of remaining balance (Total - Binder) = 10% of $1.98M = $198k
      const remainingBalance = finalBidAmount - binderDeposit;
      const totalPenaltyPool = remainingBalance * 0.10;
      const penaltySplit = totalPenaltyPool / 2; // $99k each

      return { 
        isHighTicket: true, 
        dueToday: binderDeposit, 
        bazariaCommission, 
        totalPenaltyPool, 
        penaltySplit 
      };
    }
  }, [finalBidAmount, reservePrice, isHighTicket]);

  return (
    // Fixed classes for high visibility and proper layering
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-teal-600" />
            <span className="text-[10px] font-black text-teal-600 tracking-widest uppercase">Secure Fiat Gateway</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>Total Asset Value:</span>
              <span>${finalBidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-teal-700 pt-2 border-t border-slate-200">
              <span>Due Today:</span>
              <span>${metrics.dueToday.toLocaleString()}</span>
            </div>
          </div>

          {isHighTicket && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-black uppercase text-[10px]">
                <AlertTriangle size={14} /> High-Ticket Penalty Logic
              </div>
              <p className="text-[11px] text-rose-800 font-semibold leading-relaxed">
                Penalty Pool ($198k). Bazaria Share: <strong>${metrics.penaltySplit?.toLocaleString()}</strong>. Seller Share: <strong>${metrics.penaltySplit?.toLocaleString()}</strong>.
              </p>
            </div>
          )}

          <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-5 h-5" />
            <span className="text-[11px] font-bold text-slate-700">Accept Terms of Business and Escrow Logic.</span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 bg-white border border-slate-300 rounded-xl font-black text-[11px] uppercase">Cancel</button>
          <button 
            disabled={!termsAccepted}
            onClick={() => onConfirmPayment(metrics.dueToday)}
            className={`flex-[2] py-4 rounded-xl font-black text-[11px] uppercase ${termsAccepted ? 'bg-slate-900 text-yellow-400' : 'bg-slate-300 text-slate-500'}`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
