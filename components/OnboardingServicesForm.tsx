"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';

export const MANAGED_SERVICES = [
  {
    id: 'GOOGLE_WORKSPACE',
    title: 'Google Workspace',
    description: 'Custom email, storage, and collaboration suite.',
    price: '$6.00 / mo',
  },
  {
    id: 'DOMAIN_MANAGEMENT',
    title: 'Domain Management',
    description: 'We acquire and manage domains on your behalf.',
    price: '$12.00 / yr',
  },
  {
    id: 'BUSINESS_REGISTRY',
    title: 'Business Registry',
    description: 'Assistance with corporate or LLC incorporation.',
    price: '$150.00 one-time',
  },
  {
    id: 'SHIPPING_CALLTAGS',
    title: 'Shipping Calltags',
    description: 'Automated reverse logistics call tags setup.',
    price: '$5.00 / unit',
  },
  {
    id: 'VIDEO_CONFERENCING',
    title: 'Video Conferencing',
    description: 'Dedicated virtual meeting environment.',
    price: '$8.00 / mo',
  },
];

interface OnboardingServicesFormProps {
  onNext: (selectedServices: string[]) => void;
  initialSelected?: string[];
}

export function OnboardingServicesForm({ onNext, initialSelected = [] }: OnboardingServicesFormProps) {
  const { control, handleSubmit, watch, formState: { isSubmitting, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      services: initialSelected,
    },
  });

  const selectedServices = watch('services');

  // Explicit form submit handler
  const onSubmit = (data: { services: string[] }) => {
    try {
      onNext(data.services);
    } catch (err) {
      console.error('Error during step transition:', err);
    }
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault(); // Ensure we don't bubble or trigger native page reload
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
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '22px 28px',
                    borderRadius: '20px',
                    border: isChecked ? '1px solid #FFBF00' : '1px solid #f1f5f9',
                    backgroundColor: isChecked ? 'rgba(255, 191, 0, 0.04)' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
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
                        color: '#000000',
                        cursor: 'pointer',
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: '11px', fontWeight: 1000, color: '#0f172a', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>
                        {service.title}
                      </h4>
                      <p style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', maxWidth: '360px', lineHeight: '1.4' }}>
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
                    }}
                  >
                    {service.price}
                  </span>
                </label>
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
          type="button" // Change to type="button"
          onClick={() => {
            // Unconditionally trigger onNext with selected services
            onNext(selectedServices);
          }}
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
          Proceed to Checkout
        </button>
      </div>
    </form>
  );
}
