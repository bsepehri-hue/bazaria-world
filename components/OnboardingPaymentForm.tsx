"use client";

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, ShieldAlert, ShieldCheck, Wallet, Coins } from 'lucide-react';
import { MANAGED_SERVICES } from './OnboardingServicesForm';

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
  
  // 💳 PAYMENT GATEWAY METHOD SELECTOR STATE
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CRYPTO'>('CARD');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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

  // Mock wallet connector
  const handleConnectWallet = async () => {
    setProcessing(true);
    setTimeout(() => {
      setWalletAddress("0x71C...3A9b");
      setWalletConnected(true);
      setProcessing(false);
    }, 800);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (isFreeCheckout) {
      // Skip processors completely if balance is zero
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 1000);
      return;
    }

    if (paymentMethod === 'CARD') {
      if (!stripe || !elements) return;
      // Real processing simulation
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 1200);
    } else {
      // Crypto checkout routing
      if (!walletConnected) {
        setError("Please connect your Web3 wallet to authorize transaction protocol.");
        setProcessing(false);
        return;
      }
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 1500);
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
                  <button
                    type="button"
                    onClick={handleConnectWallet}
                    disabled={processing}
                    style={{
                      width: '100%', padding: '16px', backgroundColor: '#0f172a', color: '#FFBF00', border: '1px solid #FFBF00',
                      borderRadius: '14px', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer'
                    }}
                  >
                    {processing ? 'Launching Provider Context...' : 'Connect Protocol Web3 Wallet'}
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 20px', borderRadius: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Coins size={16} style={{ color: '#16a34a' }} />
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: 900, color: '#166534', textTransform: 'uppercase' }}>Wallet Link Verified</p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', fontFamily: 'monospace', color: '#15803d', fontWeight: 700 }}>{walletAddress}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 900, color: '#166534', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>Polygon Network</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* ✨ FREE CHECKOUT PASS EMPTY STATE NOTICE */
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
          }}
          onMouseOver={(e) => { if (!isFreeCheckout) e.currentTarget.style.backgroundColor = '#333333'; }}
          onMouseOut={(e) => { if (!isFreeCheckout) e.currentTarget.style.backgroundColor = '#000000'; }}
        >
          {processing 
            ? 'Authorizing Node Secure Sync...' 
            : isFreeCheckout 
              ? 'Skip Payment & Complete Activation' 
              : paymentMethod === 'CARD' 
                ? 'Process Card Payment' 
                : 'Execute Crypto Protocol Transaction'}
        </button>
      </div>
    </form>
  );
}
