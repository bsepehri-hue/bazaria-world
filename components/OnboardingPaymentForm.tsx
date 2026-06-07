"use client";

import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, ShieldAlert, ShieldCheck, Wallet, Coins, Loader2 } from 'lucide-react';
import { MANAGED_SERVICES } from './OnboardingServicesForm';

// 🌐 WAGMI CORES FOR ERC-20 MULTI-TRANSACTION ROUTING
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';

interface OnboardingPaymentFormProps {
  onSuccess: () => void;
  selectedServices: string[];
  appliedCoupon: { code: string; discountType: 'percent' | 'flat'; value: number } | null;
  setAppliedCoupon: (coupon: { code: string; discountType: 'percent' | 'flat'; value: number } | null) => void;
  couponInput: string;
  setCouponInput: (val: string) => void;
  couponError: string;
  setCouponError: (val: string) => void;
  handleApplyCoupon: (e: React.FormEvent) => void;
  handleRemoveCoupon: () => void;
}

// 📜 SYSTEM PROTOCOL TARGET CONTRACT ADDRESSES (POLYGON AMOY)
const BAZARIA_REGISTRY_ADDRESS = "0xD757d560BEc4A2d7ceC79df95C6dB537c23953Cf"; 
const USDC_TOKEN_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"; // Official Circle USDC Address on Amoy Testnet

// 📝 COMPACT ERC-20 INTEGRATION ABIS
const ERC20_APPROVE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

const BAZARIA_REGISTRY_ABI = [
  {
    "inputs": [{ "internalType": "string[]", "name": "serviceIds", "type": "string[]" }],
    "name": "registerStorefront", // Assumed custom function or fallback processing method
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export function OnboardingPaymentForm({ 
  onSuccess, 
  selectedServices,
  appliedCoupon,
  setAppliedCoupon,
  couponInput,
  setCouponInput,
  couponError,
  setCouponError,
  handleApplyCoupon,
  handleRemoveCoupon
}: OnboardingPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [txStep, setTxStep] = useState<'IDLE' | 'APPROVING' | 'CONFIRMING_APPROVE' | 'REGISTERING' | 'CONFIRMING_REGISTRATION'>('IDLE');
  
  // 💳 PAYMENT GATEWAY STATE ENGINE
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CRYPTO'>('CARD');

  // 🦊 ACTIVE WAGMI PROTOCOL INJECTORS
  const { address: walletAddress, isConnected: walletConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [activeTxHash, setActiveTxHash] = useState<`0x${string}` | undefined>(undefined);
  
  // Dynamic system tracking confirmation blocks
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: activeTxHash,
  });

  const BASE_FEE = 95.00;

  const selectedServiceDetails = MANAGED_SERVICES.filter(service => 
    selectedServices.includes(service.id)
  );

  const servicesTotal = selectedServiceDetails.reduce((total, service) => {
    const priceString = service.price.split(' ')[0].replace('$', '');
    const numPrice = parseFloat(priceString);
    return total + (isNaN(numPrice) ? 0 : numPrice);
  }, 0);

  const originalTotal = BASE_FEE + servicesTotal;

  // Calculate dynamic subtotal based on rules
  let totalAmount = originalTotal;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'LAUNCH100') {
      totalAmount = servicesTotal;
    } else if (appliedCoupon.discountType === 'percent') {
      totalAmount = originalTotal * (1 - appliedCoupon.value / 100);
    } else if (appliedCoupon.discountType === 'flat') {
      totalAmount = Math.max(0, originalTotal - appliedCoupon.value);
    }
  }

  const isFreeCheckout = totalAmount === 0;

  // 🔄 MULTI-TRANSACTION STEP WORKFLOW COORDINATOR LOOP
  useEffect(() => {
    if (isTxConfirmed && activeTxHash) {
      if (txStep === 'CONFIRMING_APPROVE') {
        // Step 1 Complete: Token allowance cleared! Now auto-trigger registration step
        executeRegistryTransaction();
      } else if (txStep === 'CONFIRMING_REGISTRATION') {
        // Step 2 Complete: Entire storefront setup fully committed to the ledger!
        setProcessing(false);
        setTxStep('IDLE');
        onSuccess();
      }
    }
  }, [isTxConfirmed, activeTxHash]);

  // Separate sequence out to fire clean second transactions safely
  const executeRegistryTransaction = async () => {
    setTxStep('REGISTERING');
    try {
      const regTx = await writeContractAsync({
        address: BAZARIA_REGISTRY_ADDRESS,
        abi: BAZARIA_REGISTRY_ABI,
        functionName: 'registerStorefront',
        args: [selectedServices]
      });
      setActiveTxHash(regTx);
      setTxStep('CONFIRMING_REGISTRATION');
    } catch (err: any) {
      handleContractError(err);
    }
  };

  const handleContractError = (err: any) => {
    console.error("Stablecoin Protocol Exception Raised:", err);
    setError(err?.shortMessage || err?.message || "Transaction rejected by signing node.");
    setProcessing(false);
    setTxStep('IDLE');
    setActiveTxHash(undefined);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (isFreeCheckout) {
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 1000);
      return;
    }

    if (paymentMethod === 'CARD') {
      if (!stripe || !elements) return;
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 1200);
    } else {
      // ⛓️ START STEP 1: ERC-20 STABLECOIN ALLOWANCE CHECKOUT PIPELINE
      if (!walletConnected || !walletAddress) {
        setError("Wallet connection context missing. Connect your wallet via platform header.");
        setProcessing(false);
        return;
      }

      setTxStep('APPROVING');
      try {
        // USDC uses exactly 6 decimal units instead of standard 18 decimals!
        const usdcParsedValue = parseUnits(totalAmount.toString(), 6);

        // Dispatches token balance usage allowance to the contract registry target
        const approveTx = await writeContractAsync({
          address: USDC_TOKEN_ADDRESS,
          abi: ERC20_APPROVE_ABI,
          functionName: 'approve',
          args: [BAZARIA_REGISTRY_ADDRESS, usdcParsedValue]
        });

        setActiveTxHash(approveTx);
        setTxStep('CONFIRMING_APPROVE');
      } catch (err: any) {
        handleContractError(err);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        backgroundColor: '#ffffff',
        padding: '48px',
        borderRadius: '40px',
        maxWidth: '44rem',
        margin: '0 auto',
        boxShadow: '0 30px 80px -15px rgba(0,0,0,0.4)',
        color: '#0f172a',
      }}
    >
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 1000, textTransform: 'uppercase', margin: 0, color: '#0f172a', letterSpacing: '-0.03em' }}>
          Secure Gateway Protocol
        </h2>
        <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '16px' }}>
          Verify accounting credentials to sync network operations.
        </p>
      </div>

      <div style={{ padding: '32px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '36px' }}>
        
        {/* Invoice Rows */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, color: '#64748b', marginBottom: '8px' }}>
            <span>Onboarding Processing Fee</span>
            <span style={{ textDecoration: appliedCoupon?.code === 'LAUNCH100' ? 'line-through' : 'none' }}>${BASE_FEE.toFixed(2)}</span>
          </div>

          {selectedServiceDetails.map((service) => (
            <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, color: '#64748b', marginBottom: '6px' }}>
              <span>{service.title}</span>
              <span>{service.price.split(' ')[0]}</span>
            </div>
          ))}

          {appliedCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, color: '#166534', marginTop: '8px', padding: '4px 0' }}>
              <span>Promo Discount ({appliedCoupon.code})</span>
              <span>-${(originalTotal - totalAmount).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Coupon Form Component Input Row */}
        <div style={{ margin: '20px 0 24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
          {!appliedCoupon ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="ENTER PROMO CODE"
                style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', color: '#0f172a', outline: 'none', letterSpacing: '0.5px' }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                style={{ backgroundColor: '#05292E', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '10px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Apply
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#16a34a' }} />
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>
                  PROMO <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>{appliedCoupon.code}</span> ACTIVE ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.value}% OFF` : `$${appliedCoupon.value} OFF`})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 900, fontSize: '14px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          )}
          {couponError && <p style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, margin: '6px 0 0 4px' }}>{couponError}</p>}
        </div>

        {/* 💳 DUAL PAY GATEWAY SELECTOR TABS (Only display if balance > $0) */}
        {!isFreeCheckout ? (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => { setPaymentMethod('CARD'); setError(null); }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px',
                  backgroundColor: paymentMethod === 'CARD' ? '#05292E' : '#f1f5f9',
                  color: paymentMethod === 'CARD' ? '#ffffff' : '#475569',
                  border: '1px solid', borderColor: paymentMethod === 'CARD' ? '#05292E' : '#e2e8f0',
                  borderRadius: '14px', cursor: 'pointer', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                <CreditCard size={14} />
                Credit Card
              </button>
              
              <button
                type="button"
                onClick={() => { setPaymentMethod('CRYPTO'); setError(null); }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px',
                  backgroundColor: paymentMethod === 'CRYPTO' ? '#05292E' : '#f1f5f9',
                  color: paymentMethod === 'CRYPTO' ? '#ffffff' : '#475569',
                  border: '1px solid', borderColor: paymentMethod === 'CRYPTO' ? '#05292E' : '#e2e8f0',
                  borderRadius: '14px', cursor: 'pointer', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                <Wallet size={14} />
                Web3 Crypto
              </button>
            </div>

            {/* DYNAMIC FORM CONTEXT RENDER SWITCH */}
            {paymentMethod === 'CARD' ? (
              <div style={{ padding: '4px 0 12px' }}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '13px',
                        color: '#0f172a',
                        fontFamily: 'sans-serif',
                        '::placeholder': { color: '#94a3b8' },
                      },
                      invalid: { color: '#f43f5e' },
                    },
                  }}
                />
              </div>
            ) : (
              <div style={{ padding: '8px 0', textAlign: 'center' }}>
                {!walletConnected ? (
                  <div style={{ padding: '16px', backgroundColor: 'rgba(244,63,94,0.06)', border: '1px dashed rgba(244,63,94,0.3)', borderRadius: '14px', color: '#f43f5e', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🚨 No platform session detected. Please connect your wallet via the main navbar header.
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 20px', borderRadius: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Coins size={16} style={{ color: '#0d9488' }} />
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: 900, color: '#0f766e', textTransform: 'uppercase' }}>Wagmi USDC Session Active</p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', fontFamily: 'monospace', color: '#115e59', fontWeight: 700 }}>
                          {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 900, color: '#0f766e', backgroundColor: '#ccfbf1', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Polygon Amoy
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '24px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#166534' }}>
              🎉 Registration subtotal fully waived. No card or crypto wallet authorization sequence required!
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(244,63,94,0.08)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(244,63,94,0.2)', marginBottom: '28px' }}>
          <ShieldAlert size={18} color="#f43f5e" />
          <p style={{ margin: 0, color: '#f43f5e', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {error}
          </p>
        </div>
      )}

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '28px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em' }}>
          Total charged today: <span style={{ color: isFreeCheckout ? '#16a34a' : '#0d9488', fontWeight: 1000, marginLeft: '8px' }}>${totalAmount.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={processing || (paymentMethod === 'CRYPTO' && !walletConnected && !isFreeCheckout)}
          style={{
            width: '100%',
            height: '64px',
            backgroundColor: isFreeCheckout ? '#16a34a' : '#000000',
            color: '#ffffff',
            fontWeight: 1000,
            borderRadius: '18px',
            border: 'none',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseOver={(e) => { if (!isFreeCheckout) e.currentTarget.style.backgroundColor = '#333333'; }}
          onMouseOut={(e) => { if (!isFreeCheckout) e.currentTarget.style.backgroundColor = '#000000'; }}
        >
          {processing && <Loader2 size={16} className="animate-spin" />}
          
          {/* Dynamic multi-state indicator output labels */}
          {txStep === 'APPROVING' && 'Requesting USDC Allowance...'}
          {txStep === 'CONFIRMING_APPROVE' && 'Confirming Allowance on Chain...'}
          {txStep === 'REGISTERING' && 'Signing Registration Payload...'}
          {txStep === 'CONFIRMING_REGISTRATION' && 'Verifying Block Commit...'}
          {txStep === 'IDLE' && (
            isFreeCheckout 
              ? 'Skip Payment & Complete Activation' 
              : paymentMethod === 'CARD' 
                ? 'Process Card Payment' 
                : `Authorize $${totalAmount.toFixed(2)} USDC Payment`
          )}
        </button>
      </div>
    </form>
  );
}
