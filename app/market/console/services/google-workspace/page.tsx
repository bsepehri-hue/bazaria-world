"use client";

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Key, Loader2, Copy, ExternalLink } from 'lucide-react';

// Define the discrete architectural phases of Google API domain synchronization
type ProvisioningStatus = 'PROVISIONING' | 'NEED_DNS_VERIFICATION' | 'ACTIVE';

export default function GoogleWorkspaceConsole() {
  const [status, setStatus] = useState<ProvisioningStatus>('NEED_DNS_VERIFICATION');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock static data populated from your backend database
  const workspaceData = {
    domain: "yourbrand.world",
    purchasedSeats: 2,
    adminEmail: "admin@yourbrand.world",
    txtRecordName: "@",
    txtRecordValue: "google-site-verification=AbCDeF123456789_mock_verification_key",
    tempPassword: "Bazaria_Init_2026!X"
  };

  const handleTriggerVerification = async () => {
    setIsVerifying(true);
    // Simulate hitting your internal Next.js API route, which proxies the Google Reseller verification check
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsVerifying(false);
    setStatus('ACTIVE');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-slate-900">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
        
        {/* Header Block */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-content-center border border-amber-200">
              <Mail className="text-amber-500" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Google Workspace Provisioning</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Domain Integration Handle: <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-slate-600 font-bold">{workspaceData.domain}</span>
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div>
            {status === 'PROVISIONING' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200 animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Provisioning
              </span>
            )}
            {status === 'NEED_DNS_VERIFICATION' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle size={12} /> DNS Verification Required
              </span>
            )}
            {status === 'ACTIVE' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 size={12} /> Active & Synced
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Display State Panels */}
        {status === 'NEED_DNS_VERIFICATION' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Step 1: Prove Ownership of {workspaceData.domain}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before Google can routing corporate email traffic to your platform instance, you must insert this verification marker inside your domain management ledger.
              </p>

              {/* TXT Record Table Box */}
              <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden text-xs font-mono">
                <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 px-4 py-2 font-sans font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  <div>Record Type</div>
                  <div>Host / Name</div>
                  <div>Value / Destination</div>
                </div>
                <div className="grid grid-cols-3 px-4 py-3 items-center border-b border-slate-100 text-slate-700">
                  <div className="font-sans font-black text-slate-400">TXT</div>
                  <div>{workspaceData.txtRecordName}</div>
                  <div className="flex items-center justify-between gap-2 overflow-hidden truncate">
                    <span className="truncate pr-2">{workspaceData.txtRecordValue}</span>
                    <button 
                      onClick={() => copyToClipboard(workspaceData.txtRecordValue)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-all shrink-0 cursor-pointer"
                    >
                      <Copy size={12} className="text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
              {copied && <p className="text-[10px] text-emerald-600 font-bold mt-2 font-sans uppercase tracking-wider">✓ Record value saved to clipboard</p>}
            </div>

            {/* Verification Button Action Frame */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-400 font-medium max-w-md leading-normal">
                If you registered your domain directly through the Bazaria domain hub, this entry executes automatically behind the scenes.
              </p>
              <button
                onClick={handleTriggerVerification}
                disabled={isVerifying}
                className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Interrogating Google Servers...
                  </>
                ) : (
                  "Check DNS Status with Google"
                )}
              </button>
            </div>
          </div>
        )}

        {status === 'ACTIVE' && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-left">
            <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> Global Subscription Sync Complete
            </h3>
            <p className="text-xs text-emerald-700/80 leading-relaxed mb-4">
              Your Google Workspace cluster has generated cleanly. Your {workspaceData.purchasedSeats} administrative allocation seats are ready for team provisioning.
            </p>

            {/* Temporary Security Credentials Reveal Box */}
            <div className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Primary Admin Identity</div>
                <div className="text-xs font-bold text-slate-800 font-mono">{workspaceData.adminEmail}</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Temporary Login Key</div>
                <div className="text-xs font-bold text-slate-800 font-mono bg-slate-50 px-2 py-1 border border-slate-200 rounded flex items-center gap-2">
                  <Key size={12} className="text-slate-400" />
                  {workspaceData.tempPassword}
                </div>
              </div>
              <a 
                href="https://admin.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer no-underline shrink-0"
              >
                Launch Google Admin <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
