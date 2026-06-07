"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckCircle2, ShoppingBag, LogOut, ArrowLeft } from 'lucide-react';
import { OnboardingServicesForm } from '@/components/OnboardingServicesForm';
import { OnboardingPaymentForm } from '@/components/OnboardingPaymentForm';
import { StorefrontSettingsForm } from '@/components/StorefrontSettingsForm';
import { KycUploadForm } from '@/components/KycUploadForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51MockKeyForBazariaDevelopmentLocal64748b'
);

type OnboardingStep = 'SERVICES' | 'PAYMENT' | 'KYC' | 'SETTINGS' | 'COMPLETE';

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('SERVICES');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState('');

  // 🎟️ ACTIVE COUPON ENGINE STATES
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: 'percent' | 'flat'; value: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/join');
      if (!user && !isAuthPage) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

 const handleServicesSelect = (servicesPayload: string[]) => {
  // Save raw un-itemized collection payload directly into core state
  setSelectedServices(servicesPayload);
  
  // Advance state flow to payment gateway layout frame
  setStep('PAYMENT');
};

  const handlePaymentSuccess = () => setStep('KYC');
  const handleKycSuccess = () => setStep('SETTINGS');
  const handleSettingsSuccess = () => setStep('COMPLETE');

  const handleBack = () => {
    if (step === 'PAYMENT') setStep('SERVICES');
    if (step === 'KYC') setStep('PAYMENT');
    if (step === 'SETTINGS') setStep('KYC');
  };

  // 🎟️ PROMO CODE INTERCEPTOR LOGIC
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const parsedCode = couponInput.trim().toUpperCase();

    if (!parsedCode) {
      setCouponError('Please enter a code.');
      return;
    }

    if (parsedCode === 'BAZARIA20') {
      setAppliedCoupon({ code: 'BAZARIA20', discountType: 'percent', value: 20 });
      setCouponError('');
    } else if (parsedCode === 'LAUNCH50') {
      setAppliedCoupon({ code: 'LAUNCH50', discountType: 'flat', value: 50 });
      setCouponError('');
    } else if (parsedCode === 'LAUNCH100') {
      setAppliedCoupon({ code: 'LAUNCH100', discountType: 'flat', value: 95 });
      setCouponError('');
    } else {
      setCouponError('Invalid promo or referral coupon code.');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#05292E', 
      padding: '40px 32px', 
      color: '#fff', 
      fontFamily: 'sans-serif',
      overflowX: 'hidden',
      position: 'relative',
      touchAction: 'pan-y'
    }}>
      
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        left: '-10%', 
        width: '500px', 
        height: '500px', 
        backgroundColor: 'rgba(255, 191, 0, 0.03)', 
        filter: 'blur(100px)', 
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 1000, letterSpacing: '-0.02em', margin: '0 0 6px 0', color: '#fff' }}>
              Bazaria Storefront Setup
            </h1>
            <p style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              Identity & Protocol Sync
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '12px 20px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'; }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        <div style={{ 
          backgroundColor: '#05292E', 
          color: '#ffffff', 
          padding: '24px 32px', 
          borderRadius: '24px', 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '16px', 
          marginBottom: '32px', 
          border: '1px solid rgba(255, 191, 0, 0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {step !== 'SERVICES' && step !== 'COMPLETE' && (
              <button
                onClick={handleBack}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 191, 0, 0.2)',
                  borderRadius: '12px',
                  color: '#FFBF00',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={16} />
              </button>
            )}

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', backgroundColor: 'rgba(255, 191, 0, 0.1)', borderRadius: '16px', border: '1px solid rgba(255,191,0,0.3)' }}>
              <ShoppingBag size={22} style={{ color: '#FFBF00' }} />
            </div>
            
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 1000, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                Storefront Setup
              </h2>
              <p style={{ fontSize: '8px', letterSpacing: '0.15em', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginTop: '4px' }}>
                Step: {step}
              </p>
            </div>
          </div>
          
          {/* Stepper Indicators */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            fontSize: '8px', 
            fontWeight: 900, 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em', 
            color: '#64748b',
            overflowX: 'auto',
            paddingBottom: '4px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            flexWrap: 'nowrap',
            WebkitOverflowScrolling: 'touch'
          }}>
            <div 
              onClick={() => step !== 'COMPLETE' && setStep('SERVICES')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 'SERVICES' ? '#FFBF00' : '#cbd5e1', flexShrink: 0, cursor: step !== 'COMPLETE' ? 'pointer' : 'default' }}
            >
              <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>1</span>
              Services
            </div>
            <span style={{ flexShrink: 0 }}>&rarr;</span>
            
            <div 
              onClick={() => step !== 'COMPLETE' && selectedServices.length > 0 && setStep('PAYMENT')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 'PAYMENT' ? '#FFBF00' : '#cbd5e1', flexShrink: 0, cursor: step !== 'COMPLETE' && selectedServices.length > 0 ? 'pointer' : 'default' }}
            >
              <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>2</span>
              Payment
            </div>
            <span style={{ flexShrink: 0 }}>&rarr;</span>
            
            <div 
              onClick={() => step !== 'COMPLETE' && clientSecret && setStep('KYC')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 'KYC' ? '#FFBF00' : '#cbd5e1', flexShrink: 0, cursor: step !== 'COMPLETE' && clientSecret ? 'pointer' : 'default' }}
            >
              <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>3</span>
              KYC
            </div>
            <span style={{ flexShrink: 0 }}>&rarr;</span>
            
            <div 
              onClick={() => step !== 'COMPLETE' && clientSecret && setStep('SETTINGS')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 'SETTINGS' ? '#FFBF00' : '#cbd5e1', flexShrink: 0, cursor: step !== 'COMPLETE' && clientSecret ? 'pointer' : 'default' }}
            >
              <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>4</span>
              Settings
            </div>
          </div>
        </div>

        {/* Wizard Panel Content */}
        <div>
          {step === 'SERVICES' && (
  <OnboardingServicesForm 
    onNext={handleServicesSelect} 
    // 🧼 Compress the array down to unique IDs so checkboxes don't misbehave
    initialSelected={Array.from(new Set(selectedServices))} 
  />
)}

{step === 'PAYMENT' && clientSecret && (
  <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '32px', color: '#0f172a', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.4)' }}>
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <OnboardingPaymentForm 
        selectedServices={selectedServices} // Passes raw array (with repeated seats) directly to billing total parsers
        onSuccess={handlePaymentSuccess}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        couponInput={couponInput}
        setCouponInput={setCouponInput}
        couponError={couponError}
        setCouponError={setCouponError}
        handleApplyCoupon={handleApplyCoupon}
        handleRemoveCoupon={handleRemoveCoupon}
      />
    </Elements>
  </div>
)}

          {step === 'KYC' && (
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '40px', 
              borderRadius: '32px', 
              color: '#0f172a', 
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.4)' 
            }}>
              <KycUploadForm onComplete={handleKycSuccess} />
            </div>
          )}

          {step === 'SETTINGS' && (
            <StorefrontSettingsForm 
              onSuccess={handleSettingsSuccess} 
              referralCode={referralCode}        
              setReferralCode={setReferralCode}  
            />
          )}

          {step === 'COMPLETE' && (
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '32px', textAlign: 'center', color: '#0f172a', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.4)' }}>
              <div style={{ width: '72px', height: '72px', backgroundColor: 'rgba(255, 191, 0, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                <CheckCircle2 style={{ color: '#FFBF00' }} size={32} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 1000, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                Storefront Setup Complete!
              </h2>
              <p style={{ fontSize: '9px', fontWeight: 900, color: '#64748b', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.5' }}>
                Your storefront configuration is saved. Managed services provisioning and business incorporation is in progress.
              </p>
              <a href="/market/create" style={{ display: 'inline-block', width: '240px', height: '56px', backgroundColor: '#05292E', color: '#ffffff', borderRadius: '16px', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none', lineHeight: '56px', marginTop: '32px' }}>
                Go to Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
