"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Mail, ShieldAlert, CreditCard, Layout, FileText, ArrowRight } from "lucide-react";

// 🎯 UPDATED CORE MANAGED PRODUCTS
export const MANAGED_SERVICES = [
  {
    id: 'GOOGLE_WORKSPACE',
    title: 'Google Workspace Business Plus',
    description: 'Custom email matching your brand (Max 300 users), enterprise security vault, and full integrated collaboration tools. Includes 1-Year Pre-Purchase setup. Domain handling redirects cleanly to Google.',
    price: '$9.95 / mo',
    icon: <Mail size={18} color="#FFBF00" />
  },
  {
    id: 'SHIPPING_CALLTAGS',
    title: 'Shipping Calltag Infrastructure',
    description: 'Activate automated wholesale reverse logistics configurations to coordinate heavy item freight or parcel courier collection routing directly to your footprint.',
    price: '$25.00 setup',
    icon: <ShieldAlert size={18} color="#FFBF00" />
  },
  {
    id: 'STRIPE_TERMINAL',
    title: 'Payments (Stripe Terminals)',
    description: 'Deploy enterprise-grade hardware directly into your physical storefront setup. Card transactions execute at 2.9% + $0.05 (+1.5% for international cards). Checkmark confirms fee authorization.',
    price: 'Hardware Addon',
    icon: <CreditCard size={18} color="#FFBF00" />
  },
  {
    id: 'WEBSITE_TEMPLATES',
    title: 'Premium Website Templates',
    description: 'Unlock modern, highly optimized layouts to represent your storefront inventory elegantly across global device footprints.',
    price: '$99.00 asset',
    icon: <Layout size={18} color="#FFBF00" />
  },
  {
    id: 'BUSINESS_REGISTRY',
    title: 'Corporate Business Registry',
    description: 'Streamline legal structuring, formation, and compliance parameters seamlessly inside your management track.',
    price: 'Registry Setup',
    icon: <FileText size={18} color="#FFBF00" />
  }
];

interface OnboardingServicesFormProps {
  onNext: (selectedServices: string[]) => void;
  initialSelected?: string[];
}

export function OnboardingServicesForm({ onNext, initialSelected = [] }: OnboardingServicesFormProps) {
  // Translate initial baseline string array mappings if editing a historical setup
  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      services: initialSelected.map(s => {
        if (s.startsWith('STRIPE_TERMINAL')) return 'STRIPE_TERMINAL';
        if (s.startsWith('BUSINESS_REGISTRY')) return 'BUSINESS_REGISTRY';
        return s;
      }),
    },
  });

  const selectedServices = watch('services');

  // 🛠️ SUB-TIER STATE STORAGE
  const [terminalModel, setTerminalModel] = useState("m2");
  const [registerTier, setRegisterTier] = useState("basic");

  // Explicit form submit handler translating options to raw string arrays
  const onSubmit = (data: { services: string[] }) => {
    try {
      const formattedServices = data.services.map(serviceId => {
        if (serviceId === 'STRIPE_TERMINAL') return `STRIPE_TERMINAL_${terminalModel.toUpperCase()}`;
        if (serviceId === 'BUSINESS_REGISTRY') return `BUSINESS_REGISTRY_${registerTier.toUpperCase()}`;
        return serviceId;
      });
      onNext(formattedServices);
    } catch (err) {
      console.error('Error during step transition:', err);
    }
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      style={{
        backgroundColor: '#ffffff',
        padding: '48px',
        borderRadius: '48px',
        maxWidth: '44rem',
        margin: '0 auto',
        boxShadow: '0 30px 80px -15px rgba(0,0,0,0.4)',
        color: '#0f172a',
      }}
    >
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 1000, textTransform: 'uppercase', margin: 0, color: '#0f172a', letterSpacing: '-0.03em' }}>
          Managed Services
        </h2>
        <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '16px' }}>
          Select the add-on managed services you would like us to maintain.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MANAGED_SERVICES.map((service) => (
          <Controller
            key={service.id}
            name="services"
            control={control}
            render={({ field: { value, onChange } }) => {
              const isChecked = value.includes(service.id);
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '22px 28px',
                    borderRadius: '20px',
                    border: isChecked ? '1px solid #FFBF00' : '1px solid #f1f5f9',
                    backgroundColor: isChecked ? 'rgba(255, 191, 0, 0.04)' : '#f8fafc',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <input
                        type="checkbox"
                        value={service.id}
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange([...value, service.id]);
                          } else {
                            onChange(value.filter((v: string) => v !== service.id));
                          }
                        }}
                        style={{
                          height: '18px',
                          width: '18px',
                          borderRadius: '6px',
                          borderColor: '#cbd5e1',
                          accentColor: '#FFBF00',
                          cursor: 'pointer',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {service.icon}
                          <h4 style={{ fontSize: '11px', fontWeight: 1000, color: '#0f172a', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>
                            {service.title}
                          </h4>
                        </div>
                        <p style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', maxWidth: '360px', lineHeight: '1.4', marginHorizontal: 0 }}>
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 1000,
                        color: '#000',
                        backgroundColor: '#FFBF00',
                        padding: '6px 14px',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        flexShrink: 0
                      }}
                    >
                      {service.id === 'STRIPE_TERMINAL' && isChecked ? `${terminalModel.toUpperCase()} CHOSEN` : 
                       service.id === 'BUSINESS_REGISTRY' && isChecked ? `${registerTier.toUpperCase()} CHOSEN` : service.price}
                    </span>
                  </label>

                  {/* 💳 NESTED SELECTION FOR STRIPE TERMINALS */}
                  {service.id === 'STRIPE_TERMINAL' && isChecked && (
                    <div style={subStyles.wrapper}>
                      {[
                        { id: "m2", name: "Stripe Reader M2", cost: "$59" },
                        { id: "wisepos", name: "BBPOS WisePOS E", cost: "$249" },
                        { id: "s700", name: "Stripe Reader S700", cost: "$349" }
                      ].map(model => (
                        <div 
                          key={model.id}
                          onClick={() => setTerminalModel(model.id)}
                          style={{
                            ...subStyles.card,
                            borderColor: terminalModel === model.id ? '#FFBF00' : '#e2e8f0',
                            backgroundColor: terminalModel === model.id ? '#ffffff' : 'transparent'
                          }}
                        >
                          <span style={subStyles.name}>{model.name}</span>
                          <span style={subStyles.cost}>{model.cost}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ⚖️ NESTED SELECTION FOR BUSINESS INCORPORATION */}
                  {service.id === 'BUSINESS_REGISTRY' && isChecked && (
                    <div style={subStyles.wrapper}>
                      {[
                        { id: "basic", name: "Basic Registry (2-Wk Setup)", cost: "$199" },
                        { id: "expedited", name: "Expedited Registry (4 Biz Days)", cost: "$299" }
                      ].map(tier => (
                        <div 
                          key={tier.id}
                          onClick={() => setRegisterTier(tier.id)}
                          style={{
                            ...subStyles.card,
                            borderColor: registerTier === tier.id ? '#FFBF00' : '#e2e8f0',
                            backgroundColor: registerTier === tier.id ? '#ffffff' : 'transparent'
                          }}
                        >
                          <span style={subStyles.name}>{tier.name}</span>
                          <span style={subStyles.cost}>{tier.cost}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            }}
          />
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          marginTop: '36px',
          paddingTop: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em' }}>
          Onboarding Processing Fee: <span style={{ color: '#FFBF00', fontWeight: 1000, marginLeft: '8px' }}>$95.00</span>
        </div>

        <button
          type="button"
          onClick={() => onSubmit({ services: selectedServices })}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
        >
          Proceed to Checkout <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}

const subStyles = {
  wrapper: { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginTop: '16px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '12px' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.1s ease' },
  name: { fontSize: '11px', fontWeight: 700, color: '#0f172a' },
  cost: { fontSize: '11px', fontWeight: 900, color: '#FFBF00' }
};
