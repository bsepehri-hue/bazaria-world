"use client";


import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Store, Globe, MapPin, ShieldCheck, Image, UploadCloud, X } from 'lucide-react';

interface StorefrontSettingsFormProps {
  onSuccess: () => void;
}

export function StorefrontSettingsForm({ onSuccess }: StorefrontSettingsFormProps) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      storeName: '',
      domain: '',
      category: 'RETAIL',
    }
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const onSubmit = async (data: any) => {
    // You can process the payload containing data, logoFile, and bannerFile here
    const formData = {
      ...data,
      logo: logoFile,
      banner: bannerFile,
    };
    
    console.log('Uploading settings and asset nodes:', formData);

    // Simulate configuration delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSuccess();
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
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
          Storefront Settings
        </h2>
        <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '16px' }}>
          Configure operational parameters, protocol routing, and visual assets.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Store Name Input */}
        <div>
          <label style={{ fontSize: '9px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
            Storefront Name
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              {...register('storeName', { required: 'Storefront name is required' })}
              placeholder="E.g. Bazaria Marketplace"
              style={{
                width: '100%',
                height: '64px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '0 24px 0 60px',
                fontSize: '11px',
                fontWeight: 1000,
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFBF00'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <span style={{ position: 'absolute', left: '22px', top: '22px', color: '#64748b' }}>
              <Store size={18} />
            </span>
          </div>
          {errors.storeName && (
            <p style={{ color: '#f43f5e', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', marginTop: '8px' }}>
              {typeof errors.storeName.message === 'string' && errors.storeName.message}
            </p>
          )}
        </div>

        {/* Custom Domain Input */}
        <div>
          <label style={{ fontSize: '9px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
            Preferred Custom Domain
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              {...register('domain', { required: 'Domain is required' })}
              placeholder="E.g. yourstore.bazaria.eth"
              style={{
                width: '100%',
                height: '64px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '0 24px 0 60px',
                fontSize: '11px',
                fontWeight: 1000,
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFBF00'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <span style={{ position: 'absolute', left: '22px', top: '22px', color: '#64748b' }}>
              <Globe size={18} />
            </span>
          </div>
          {errors.domain && (
            <p style={{ color: '#f43f5e', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', marginTop: '8px' }}>
              {typeof errors.domain.message === 'string' && errors.domain.message}
            </p>
          )}
        </div>

        {/* Category Select */}
        <div>
          <label style={{ fontSize: '9px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
            Category Node
          </label>
          <div style={{ position: 'relative' }}>
            <select 
              {...register('category')}
              style={{
                width: '100%',
                height: '64px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '0 24px 0 60px',
                fontSize: '11px',
                fontWeight: 1000,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="RETAIL">Retail Goods</option>
              <option value="MOBILITY">Mobility and Parts</option>
              <option value="LOGISTICS">Supply and Logistics</option>
              <option value="NEXUS">Sanctuary Node</option>
            </select>
            <span style={{ position: 'absolute', left: '22px', top: '22px', color: '#64748b' }}>
              <MapPin size={18} />
            </span>
          </div>
        </div>

        {/* Storefront Logo Upload */}
        <div>
          <label style={{ fontSize: '9px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
            Storefront Logo
          </label>
          <div style={{ 
            border: '2px dashed #cbd5e1', 
            borderRadius: '20px', 
            padding: '24px', 
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <input 
              type="file" 
              id="logo-file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setLogoFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="logo-file" style={{ cursor: 'pointer', width: '100%' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', backgroundColor: 'rgba(255, 191, 0, 0.1)', borderRadius: '14px', marginBottom: '12px' }}>
                <Image size={20} color="#FFBF00" />
              </div>
              <h4 style={{ fontSize: '10px', fontWeight: 1000, color: '#0f172a', margin: '0 0 4px 0' }}>
                {logoFile ? 'Change Logo' : 'Upload Storefront Logo'}
              </h4>
              <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                {logoFile ? logoFile.name : 'Recommended: 400x400px, PNG or JPG'}
              </p>
            </label>
            {logoFile && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#475569' }}>
                <span style={{ color: '#FFBF00', fontWeight: 800 }}>Asset Selected:</span> {logoFile.name}
                <button 
                  type="button" 
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', marginLeft: '6px' }} 
                  onClick={() => setLogoFile(null)}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Storefront Banner Upload */}
        <div>
          <label style={{ fontSize: '9px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
            Storefront Banner
          </label>
          <div style={{ 
            border: '2px dashed #cbd5e1', 
            borderRadius: '20px', 
            padding: '24px', 
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <input 
              type="file" 
              id="banner-file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setBannerFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="banner-file" style={{ cursor: 'pointer', width: '100%' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', backgroundColor: 'rgba(255, 191, 0, 0.1)', borderRadius: '14px', marginBottom: '12px' }}>
                <UploadCloud size={20} color="#FFBF00" />
              </div>
              <h4 style={{ fontSize: '10px', fontWeight: 1000, color: '#0f172a', margin: '0 0 4px 0' }}>
                {bannerFile ? 'Change Banner' : 'Upload Storefront Banner'}
              </h4>
              <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                {bannerFile ? bannerFile.name : 'Recommended: 1200x400px, PNG or JPG'}
              </p>
            </label>
            {bannerFile && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#475569' }}>
                <span style={{ color: '#FFBF00', fontWeight: 800 }}>Asset Selected:</span> {bannerFile.name}
                <button 
                  type="button" 
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', marginLeft: '6px' }} 
                  onClick={() => setBannerFile(null)}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Notification */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: '#f0fdf4', padding: '20px 24px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
          <div style={{ marginTop: '2px' }}>
            <ShieldCheck size={18} color="#15803d" />
          </div>
          <div>
            <h5 style={{ fontSize: '9px', fontWeight: 1000, color: '#166534', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Network Protocol Security
            </h5>
            <p style={{ fontSize: '8px', color: '#15803d', marginTop: '6px', lineHeight: '1.4', maxWidth: '440px' }}>
              Settings are saved on the Polygon Amoy testnet. Contract deployment may require a small amount of gas on signature approval.
            </p>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '36px', paddingTop: '28px' }}>
        <button
          type="submit"
          disabled={isSubmitting}
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
          {isSubmitting ? 'Saving Configuration...' : 'Complete & Save Configuration'}
        </button>
      </div>
    </form>
  );
}
