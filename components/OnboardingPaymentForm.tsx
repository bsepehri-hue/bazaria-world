"use client";

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, ShieldAlert, ShieldCheck } from 'lucide-react';
import { MANAGED_SERVICES } from './OnboardingServicesForm';

interface OnboardingPaymentFormProps {
  onSuccess: () => void;
  selectedServices: string[];
  // 🎟️ COUPON PROPS PASSED DOWN FROM PARENT
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

  // Mandatory setup fee
  const BASE_FEE = 95.00;

  // Compute the total of selected services dynamically
  const selectedServiceDetails = MANAGED_SERVICES.filter(service => 
    selectedServices.includes(service.id)
  );

  const servicesTotal = selectedServiceDetails.reduce((total, service) => {
    const priceString = service.price.split(' ')[0].replace('$', '');
    const numPrice = parseFloat(priceString);
    return total + (isNaN(numPrice) ? 0 : numPrice);
  }, 0);

  const originalTotal = BASE_FEE + servicesTotal;

  // 🎟️ DYNAMIC PRICE DEFLATION CALCULATION MATRIX
  const totalAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percent'
      ? originalTotal * (1 - appliedCoupon.value / 100)
      : Math.max(0, originalTotal - appliedCoupon.value)
    : originalTotal;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1200);
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
          Secure Payment Sync
        </h2>
        <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '16px' }}>
          Complete the setup, managed services, and processing fees.
        </p>
      </div>

      <div style={{ padding: '32px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#FFBF00', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="#000000" />
          </div>
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 1000, textTransform: 'uppercase', color: '#0f172a', margin: 0, letterSpacing: '0.05em' }}>
              Credit Card Protocol
            </h4>
            <p style={{ fontSize: '9px', fontWeight: 900, color: '#64748b', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Processed by Stripe. 128-Bit Encryption.
            </p>
          </div>
        </div>

        {/* Breakdown of services in the invoice */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, color: '#64748b', marginBottom: '8px' }}>
            <span>Onboarding Processing Fee</span>
            <span>${BASE_FEE.toFixed(2)}</span>
          </div>

          {selectedServiceDetails.map((service) => (
            <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, color: '#64748b', marginBottom: '6px' }}>
              <span>{service.title}</span>
              <span>{service.price.split(' ')[0]}</span>
            </div>
          ))}

          {/* 🎟️ VISUAL DISCOUNT DEDUCTION DISPLAY ROW */}
          {appliedCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, color: '#166534', marginTop: '8px', padding: '4px 0' }}>
              <span>Promo Discount ({appliedCoupon.code})</span>
              <span>-${(originalTotal - totalAmount).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* 🎟️ INTERACTIVE IN-LINE PROMO ENTRY FIELD */}
        <div style={{ margin: '20px 0', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
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
                <ShieldCheck size={14} className="text-emerald-600" />
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>
                  PROMO <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>{appliedCoupon.code}</span> ACTIVE ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.value}% OFF` : `$${appliedCoupon.value} OFF`})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 900, fontSize: '14px', cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          )}
          {couponError && <p style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, margin: '6px 0 0 4px' }}>{couponError}</p>}
        </div>

        <div style={{ marginTop: '12px' }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '13px',
                  color: '#0f172a',
                  fontFamily: 'sans-serif',
                  '::placeholder': {
                    color: '#94a3b8',
                  },
                },
                invalid: {
                  color: '#f43f5e',
                },
              },
            }}
          />
        </div>
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
          Total charged today: <span style={{ color: '#0d9488', fontWeight: 1000, marginLeft: '8px' }}>${totalAmount.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={processing}
          style={{
            width: '100%',
            height: '64px',
            backgroundColor: '#000000',
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
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
        >
          {processing ? 'Processing and verifying...' : 'Process Payment'}
        </button>
      </div>
    </form>
  );
}
