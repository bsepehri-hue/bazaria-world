import React, { useState, useMemo } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

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
      // 1. Binder Fee: 10% of the total property value ($2.2M * 10% = $220,000)
      const binderDeposit = finalBidAmount * 0.10; 
      
      // 2. Upfront Bazaria Commission: 10% of the Binder ($220k * 10% = $22,000)
      const bazariaUpfrontCommission = binderDeposit * 0.10; 
      
      // 3. Remaining Binder Balance ($220,000 - $22,000 = $198,000)
      const remainingBinder = binderDeposit - bazariaUpfrontCommission;
      
      // 4. Default Penalty Pool: 10% of the remaining binder ($198,000 * 10% = $19,800)
      const totalPenaltyPool = remainingBinder * 0.10; 
      
      // 5. Split the Penalty 50/50 ($19,800 / 2 = $9,900 each)
      const penaltySplit = totalPenaltyPool / 2; 

      return { 
        isHighTicket: true, 
        dueToday: binderDeposit, 
        bazariaUpfrontCommission, 
        totalPenaltyPool, 
        penaltySplit,
        bazariaTotalNet: bazariaUpfrontCommission + penaltySplit // $22,000 + $9,900 = $31,900
      };
    }
  }, [finalBidAmount, reservePrice, isHighTicket]);

 // Inside AuctionCheckoutModal.tsx
 return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans relative z-[1000000]" onClick={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-[#0d9488]" />
          <span className="text-[10px] font-black text-[#0d9488] tracking-widest uppercase">Secure Fiat Gateway</span>
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
          <div className="flex justify-between text-lg font-black text-[#0d9488] pt-2 border-t border-slate-200">
            <span>Due Today (10% Binder):</span>
            <span>${metrics.dueToday?.toLocaleString()}</span>
          </div>
        </div>

        {isHighTicket && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-black uppercase text-[10px]">
              <AlertTriangle size={14} /> High-Ticket Penalty Structure
            </div>
            <div className="text-[11px] text-rose-900 font-medium space-y-1">
              <p>• Bazaria Upfront Commission: <strong>${metrics.bazariaUpfrontCommission?.toLocaleString()}</strong></p>
              <p>• Default Penalty Pool (10% of remaining binder): <strong>${metrics.totalPenaltyPool?.toLocaleString()}</strong></p>
              
              <div className="pt-2 mt-2 border-t border-rose-200 flex justify-between font-black text-slate-900">
                <span>Bazaria Total Net on Default:</span>
                <span>${metrics.bazariaTotalNet?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-[#0d9488]">
                <span>Buyer Inconvenience Rebate:</span>
                <span>${metrics.penaltySplit?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Terms Agreement */}
        <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
          <input 
            type="checkbox" 
            checked={termsAccepted} 
            onChange={(e) => setTermsAccepted(e.target.checked)} 
            className="mt-1 w-5 h-5 accent-[#0d9488]" 
          />
          <span className="text-[11px] font-bold text-slate-700 leading-relaxed">
            I accept the Bazaria Terms of Business, Escrow Logic, and Default Penalty forfeiture policies.
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
        <button 
          onClick={onCancel} 
          className="flex-1 py-4 bg-white border border-slate-300 rounded-xl font-black text-[11px] uppercase text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
        <button 
          disabled={!termsAccepted}
          onClick={() => onConfirmPayment(metrics.dueToday || 0)}
          className={`flex-[2] py-4 rounded-xl font-black text-[11px] uppercase transition-all ${
            termsAccepted 
              ? 'bg-[#030712] text-[#FFBF00] hover:bg-slate-800 cursor-pointer shadow-lg' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
