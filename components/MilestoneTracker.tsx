'use client';

import React from 'react';
import { Trophy, ArrowUpRight, Zap, Award } from 'lucide-react';

interface MilestoneTrackerProps {
  currentLtb?: number;
  targetLtb?: number;
}

export default function MilestoneTracker({
  currentLtb = 340,
  targetLtb = 500
}: MilestoneTrackerProps) {
  const percentage = Math.min(Math.round((currentLtb / targetLtb) * 100), 100);
  const remaining = targetLtb - currentLtb;

  const radius = 50;
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

      {/* CORE GRID: RESPONSIVE FLEX CONTAINER */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap', // Forces automatic wrap down on mobile screen widths!
        alignItems: 'center',
        gap: '24px',
        width: '100%'
      }}>
        
        {/* LEFT PROGRESS RING (Centered automatically if stacked) */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '110px',
          height: '110px',
          flexShrink: 0,
          margin: '0 auto sm:margin-0' // Centers perfectly on cell phones
        }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r={42} stroke="#1e293b" strokeWidth="8" fill="transparent" />
            <circle
              cx="55"
              cy="55"
              r={42}
              stroke={colors.accent}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 - (percentage / 100) * (2 * Math.PI * 42)}
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

        {/* RIGHT CONTAINER: AUTO-EXPANDING BOX DATA */}
        <div style={{ 
          flex: '1 1 280px', // Automatically stretches to fill dead space, wraps if width < 280px
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px' 
        }}>
          
          {/* HORIZONTAL BOX ROWS FOR METRICS */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '12px', 
            width: '100%' 
          }}>
            <div style={{ flex: '1 1 130px', backgroundColor: colors.subBox, padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', tracking: '0.5px' }}>Current Earned</span>
              <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', display: 'block', marginTop: '2px' }}>{currentLtb} LTB</span>
            </div>
            <div style={{ flex: '1 1 130px', backgroundColor: colors.subBox, padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', tracking: '0.5px' }}>Target Vault</span>
              <span style={{ fontSize: '16px', fontWeight: 900, color: colors.textMuted, display: 'block', marginTop: '2px' }}>{targetLtb} LTB</span>
            </div>
          </div>

          {/* DRIVER NOTICE BOX */}
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
        <button style={{
          background: 'none',
          border: 'none',
          color: colors.accent,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: 0
        }}>
          Inject Volume <ArrowUpRight style={{ width: '12px', height: '12px' }} />
        </button>
      </div>

    </div>
  );
}
