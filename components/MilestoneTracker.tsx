'use client';

import React, { useState } from 'react'; // Added useState directly here
import { Trophy, ArrowUpRight, Zap, Award } from 'lucide-react';

interface MilestoneTrackerProps {
  currentLtb?: number;
  targetLtb?: number;
}

export default function MilestoneTracker({
  currentLtb = 340,
  targetLtb = 500
}: MilestoneTrackerProps) {
  // 🛰️ The state lives directly inside the component now!
  const [isVolumeMenuOpen, setIsVolumeMenuOpen] = useState(false);

  const percentage = Math.min(Math.round((currentLtb / targetLtb) * 100), 100);
  const remaining = targetLtb - currentLtb;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    cardBg: '#0b1329',
    border: '#1e293b',
    accent: '#FFBF00',
    textMuted: '#94a3b8',
    subBox: '#030712'
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '24px',
      padding: '20px',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      color: '#fff'
    }}>
      
      {/* HEADER SECTION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '14px',
        marginBottom: '20px'
      }}>
        <div>
          <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: colors.textMuted, margin: 0, letterSpacing: '1px' }}>
            Card Payout Threshold
          </h4>
          <p style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0 0 0', color: '#fff' }}>First Milestone</p>
        </div>
        <div style={{
          backgroundColor: 'rgba(255, 191, 0, 0.1)',
          padding: '8px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 191, 0, 0.2)',
          color: colors.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy style={{ width: '18px', height: '18px' }} />
        </div>
      </div>

      {/* CORE RESPONSIVE FLEX CONTAINER */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '24px',
        width: '100%'
      }}>
        
        {/* PROGRESS RING */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '110px',
          height: '110px',
          flexShrink: 0,
          margin: '0 auto'
        }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r={radius} stroke="#1e293b" strokeWidth="8" fill="transparent" />
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke={colors.accent}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', display: 'block' }}>{percentage}%</span>
            <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', color: colors.textMuted, letterSpacing: '0.5px' }}>Done</span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
            <div style={{ flex: '1 1 130px', backgroundColor: colors.subBox, padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Current Earned</span>
              <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', display: 'block', marginTop: '2px' }}>{currentLtb} LTB</span>
            </div>
            <div style={{ flex: '1 1 130px', backgroundColor: colors.subBox, padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Target Vault</span>
              <span style={{ fontSize: '16px', fontWeight: 900, color: colors.textMuted, display: 'block', marginTop: '2px' }}>{targetLtb} LTB</span>
            </div>
          </div>

          {remaining > 0 ? (
            <div style={{
              backgroundColor: 'rgba(255, 191, 0, 0.03)',
              border: '1px solid rgba(255, 191, 0, 0.12)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Zap style={{ width: '14px', height: '14px', color: colors.accent, flexShrink: 0 }} />
              <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                Earn <strong style={{ color: '#fff', fontWeight: 900 }}>{remaining} LTB</strong> more to automatically activate and ship your physical debit card.
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.03)',
              border: '1px solid rgba(16, 185, 129, 0.12)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Award style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0 }} />
              <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>
                <strong style={{ color: '#fff', fontWeight: 900 }}>Milestone Unlocked!</strong> Hardware deployment sequence active.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER CTA TRACK */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px'
      }}>
        <span style={{ color: colors.textMuted }}>Want to fast-track progress?</span>
        <button 
          onClick={() => setIsVolumeMenuOpen(true)} // 👈 Switches local state immediately!
          style={{
            background: 'none',
            border: 'none',
            color: colors.accent,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: 0
          }}
        >
          Inject Volume <ArrowUpRight style={{ width: '12px', height: '12px' }} />
        </button>
      </div>

      {/* 🎛️ PORTED SIDE-DRAWER CODE RIGHT INSIDE THE CONTAINER MESH */}
      {isVolumeMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(2, 6, 17, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'flex-end',
          fontFamily: 'sans-serif'
        }} onClick={() => setIsVolumeMenuOpen(false)}>
          
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#0b1329',
            borderLeft: '1px solid #1e293b',
            height: '100%',
            padding: '32px 24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setIsVolumeMenuOpen(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>

            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#FFBF00', letterSpacing: '1px', backgroundColor: 'rgba(255, 191, 0, 0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255, 191, 0, 0.2)' }}>
                Volume Accelerator
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 900, margin: '14px 0 4px 0', color: '#fff' }}>
                Inject Market Volume
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                Select an enterprise activity to accelerate your transaction volume and push your ledger closer to the $500 payout threshold.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: 0 }} />

            {/* FLYERS DOWNLOADING INFRASTRUCTURE */}
            <div style={{
              backgroundColor: '#030712',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Download Weekly Flyers</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    Grab this week's high-converting social assets. Tag them on social media with your partner link to organically capture deal volume.
                  </p>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#0d9488', backgroundColor: 'rgba(13, 148, 136, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(13, 148, 136, 0.2)', textTransform: 'uppercase' }}>
                  NEW
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <div style={{
                  flex: 1,
                  height: '60px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px dashed #475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#94a3b8',
                  fontWeight: 700,
                  cursor: 'pointer'
                }} onClick={() => alert('Downloading: Premium Auto Pack Flyer.jpg')}>
                  🚗 AUTO FLYER
                </div>
                <div style={{
                  flex: 1,
                  height: '60px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px dashed #475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#94a3b8',
                  fontWeight: 700,
                  cursor: 'pointer'
                }} onClick={() => alert('Downloading: Luxury Estate Pack Flyer.jpg')}>
                  🏠 REAL ESTATE
                </div>
              </div>
            </div>

            {/* DISPATCH ACTIVE SHORTCUT */}
            <div style={{
              backgroundColor: '#030712',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Deploy New Active Listing</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                  Post a new verified car package or real estate asset. Live marketplace inventory attracts direct orders to clear your milestone.
                </p>
              </div>
              <button style={{
                backgroundColor: '#0d9488',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Go to Inventory Manager →
              </button>
            </div>

            {/* SHARE TRACKS */}
            <div style={{
              backgroundColor: '#030712',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Circulate Partner Routing</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                  Distribute your secure console routing links directly to your localized buyer networks to accelerate closed deals.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => alert('Merchant Link Copied!')} style={{
                  backgroundColor: 'transparent',
                  color: '#FFBF00',
                  border: '1px solid #FFBF00',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}>
                  📋 COPY MERCHANT ROUTE LINK
                </button>
                <button onClick={() => alert('Partner Link Copied!')} style={{
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}>
                  📋 COPY REGIONAL PARTNER LINK
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
