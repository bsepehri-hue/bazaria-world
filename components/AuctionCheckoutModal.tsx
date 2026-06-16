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

  // --- BAZARIA AUCTION FEE LOGIC ---
  const isHighTicket = finalBidAmount >= 5000;

  const metrics = useMemo(() => {
    if (!isHighTicket) {
      // Standard Logic (< $5k): 6% on reserve, 15% on overage
      let fee = 0;
      if (finalBidAmount <= reservePrice || reservePrice === 0) {
        fee = finalBidAmount * 0.06;
      } else {
        const reserveFee = reservePrice * 0.06;
        const overageFee = (finalBidAmount - reservePrice) * 0.15;
        fee = reserveFee + overageFee;
      }
      return {
        isHighTicket: false,
        totalPrice: finalBidAmount,
        upfrontFee: fee,
        dueToday: finalBidAmount + fee,
      };
    } else {
      // High-Ticket Logic (>= $5k):
      // 1. Binder Deposit: 10% of Total Asset Price
      // 2. Upfront Commission: 10% of that Binder Deposit
      // 3. Potential Default Penalty: 10% of (Total Asset Price - Binder Deposit) 
      const binderDeposit = finalBidAmount * 0.10;
      const upfrontBazariaCommission = binderDeposit * 0.10; 
      
      const remainingEscrowBalance = finalBidAmount - binderDeposit;
      const totalPenaltyPool = remainingEscrowBalance * 0.10;
      const penaltySplit = totalPenaltyPool / 2; // Split between Seller & Bazaria

      return {
        isHighTicket: true,
        totalPrice: finalBidAmount,
        binderDeposit: binderDeposit,
        upfrontBazariaCommission: upfrontBazariaCommission,
        remainingEscrowBalance: remainingEscrowBalance,
        totalPenaltyPool: totalPenaltyPool,
        penaltySplit: penaltySplit,
        dueToday: binderDeposit, // Buyer pays the binder to start
      };
    }
  }, [finalBidAmount, reservePrice, isHighTicket]);

  return (
    <div className="fixed inset-0 bg-[#031d20]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-[#f8fafc]">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-[#0d9488]" />
            <span className="text-[10px] font-black text-[#0d9488] tracking-widest uppercase">
              Secure Fiat Gateway
            </span>
          </div>
          <h2 className="text-xl font-black text-[#0f172a] uppercase">{title}</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Total Asset Value: <span className="text-slate-800">${finalBidAmount.toLocaleString()} USD</span>
          </p>
        </div>

        {/* Math & Logic Container */}
        <div className="p-6 flex flex-col gap-6">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            {!metrics.isHighTicket ? (
              // UI FOR UNDER $5000
              <>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>Auction Fee (Calculated):</span>
                  <span>${metrics.upfrontFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#0d9488] border-t border-slate-200 pt-3 mt-1">
                  <span>Total Due Now:</span>
                  <span>${metrics.dueToday.toLocaleString()} USD</span>
                </div>
              </>
            ) : (
              // UI FOR OVER $5000 (ESCROW)
              <>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>10% Binder Deposit (Due Today):</span>
                  <span>${metrics.binderDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-400">
                  <span>- Bazaria Upfront Comm. (10% of Binder):</span>
                  <span>-${metrics.upfrontBazariaCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#0d9488] border-t border-slate-200 pt-3 mt-1">
                  <span>Total Due Now:</span>
                  <span>${metrics.dueToday.toLocaleString()} USD</span>
                </div>
                
                {/* Penalty Breakdown Box */}
                <div className="mt-3 bg-[#fef2f2] border border-[#fca5a5] p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={20} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[#991b1b] uppercase tracking-wide mb-1">
                      High-Ticket Default Penalty
                    </span>
                    <p className="text-[11px] text-[#7f1d1d] font-semibold leading-relaxed">
                      If you default, a 10% penalty on the remaining balance ($90,000 remaining = $9,000 total penalty pool) is triggered. 
                      <br/><strong>Bazaria Penalty Share: ${metrics.penaltySplit.toLocaleString()}</strong> 
                      <br/><strong>Seller Inconvenience Share: ${metrics.penaltySplit.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <label className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input 
              type="checkbox" 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#0d9488] rounded focus:ring-[#0d9488] cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <FileText size={14} /> Accept Terms of Business
              </span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                I agree to the Bazaria Escrow logic, fee structures, and the {isHighTicket ? 'penalty forfeiture policies' : 'standard shipping policies'}.
              </span>
            </div>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f8fafc] border-t border-slate-200 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          
          <button 
            disabled={!termsAccepted}
            onClick={() => onConfirmPayment(metrics.dueToday)}
            className={`flex-[2] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
              termsAccepted 
                ? 'bg-[#0f172a] text-[#FFBF00] border border-[#FFBF00] shadow-xl hover:bg-slate-800' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {termsAccepted ? `Pay $${metrics.dueToday.toLocaleString()} via Stripe` : 'Accept Terms to Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}
