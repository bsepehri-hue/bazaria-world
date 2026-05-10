"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadCloud, ShieldAlert, FileText, X } from 'lucide-react';

interface KycUploadFormProps {
  onComplete: () => void;
}

export function KycUploadForm({ onComplete }: KycUploadFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = async (data: any) => {
    // Ensure at least one file is attached
    if (files.length === 0) {
      alert("Please upload at least one verification document.");
      return;
    }
    
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onComplete();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
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
        color: '#0f172a',
      }}
    >
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 1000, textTransform: 'uppercase', margin: 0, color: '#0f172a', letterSpacing: '-0.03em' }}>
          KYC & Documentation
        </h2>
        <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '16px' }}>
          Provide valid verification documents to complete identity and protocol compliance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Document Type Select */}
        <div>
          <label style={{ fontSize: '9px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
            Verification Document Type
          </label>
          <select 
            {...register('docType', { required: 'Please select a document type' })}
            style={{
              width: '100%',
              height: '64px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '0 24px',
              fontSize: '11px',
              fontWeight: 1000,
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select Document Type</option>
            <option value="PASSPORT">International Passport</option>
            <option value="DRIVERS_LICENSE">Driver's License</option>
            <option value="IDENTITY_CARD">National Identity Card</option>
            <option value="INCORPORATION_DOCS">Business Registration / Articles of Inc.</option>
          </select>
          {errors.docType && (
            <p style={{ color: '#f43f5e', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={14} /> 
              {typeof errors.docType.message === 'string' && errors.docType.message}
            </p>
          )}
        </div>

        {/* Custom Dropzone Component with Multiple Files Support */}
        <div>
          <label style={{ fontSize: '9px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
            Upload Verification Documents
          </label>
          
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? '2px dashed #FFBF00' : '2px dashed #cbd5e1',
              borderRadius: '20px',
              padding: '32px 24px',
              textAlign: 'center',
              backgroundColor: dragActive ? 'rgba(255, 191, 0, 0.04)' : '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            <input 
              type="file" 
              id="kyc-file" 
              style={{ display: 'none' }} 
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="kyc-file" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', backgroundColor: 'rgba(255, 191, 0, 0.1)', borderRadius: '18px', marginBottom: '16px' }}>
                <UploadCloud size={24} color="#FFBF00" />
              </div>
              
              <h4 style={{ fontSize: '11px', fontWeight: 1000, color: '#0f172a', margin: '0 0 6px', letterSpacing: '0.05em' }}>
                Click or Drag to Add Documents
              </h4>
              <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Supported formats: PDF, PNG, or JPG (up to 10MB each)
              </p>
            </label>
          </div>
        </div>

        {/* Display the Selected Files with a Remove Option */}
        {files.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '8px', fontWeight: 1000, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em' }}>
              Attached files ({files.length})
            </span>
            {files.map((file, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f1f5f9',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <FileText size={18} color="#FFBF00" />
                  <span style={{ fontSize: '9px', fontWeight: 1000, color: '#0f172a' }}>
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Compliance Check Verification */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: '#faf5ff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #f3e8ff' }}>
          <div style={{ marginTop: '2px' }}>
            <FileText size={18} color="#7c3aed" />
          </div>
          <div>
            <h5 style={{ fontSize: '9px', fontWeight: 1000, color: '#6b21a8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Compliance and Privacy
            </h5>
            <p style={{ fontSize: '8px', color: '#7e22ce', marginTop: '6px', lineHeight: '1.4', maxWidth: '440px' }}>
              Your files are kept secure using 128-bit protocol encryption. They are not shared with third parties, remaining strictly for verification compliance.
            </p>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '36px', paddingTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
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
          {isSubmitting ? 'Verifying Uploads...' : 'Submit & Verify'}
        </button>
      </div>
    </form>
  );
}
