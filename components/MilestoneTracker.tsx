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

  // SVG Progress Ring Math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Visual Theme Colors matching your existing #05292e & #FFBF00 theme
  const colors = {
    bg: '#020617',          // Slate 950
    cardBg: '#0b1329',      // Premium dark navy
    border: '#1e293b',      // Slate 800
    accent: '#FFBF00',      // Bazaria Amber
    textMuted: '#94a3b8',   // Slate 400
    subBox: '#030712'       // Dark slate
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '24px',
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: 'sans-serif',
      color: '#fff'
    }}>
      
      {/* HEADER ROW */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'between',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ flexGrow: 1 }}>
          <h4 style={{ fontSize: '11px', fontWeight: 900, tracking: '1px', textTransform: 'uppercase', color: colors.textMuted, margin: 0 }}>
            Card Payout Threshold
          </h4>
          <p style={{ fontSize: '20px', fontWeight: 900, margin: '4px 0 0 0', color: '#fff' }}>First Milestone</p>
        </div>
        <div style={{
          backgroundColor: 'rgba(255, 191, 0, 0.1)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 191, 0, 0.2)',
          color: colors.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy style={{ width: '20px', height: '20px' }} />
        </div>
      </div>

      {/* CORE DATAVIEW GRID BLOCK */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        
        {/* LEFT COMPONENT: PROGRESS CIRCLE */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '128px',
          height: '128px',
          flexShrink: 0
        }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={colors.accent}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', display: 'block' }}>{percentage}%</span>
            <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: colors.textMuted, letterSpacing: '1px' }}>Done</span>
          </div>
        </div>

        {/* RIGHT COMPONENT: METRIC BLOCK CHIPS */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '260px' }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <div style={{ flex: 1, backgroundColor: colors.subBox, padding: '12px', borderRadius: '14px', border: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Current Earned</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', display: 'block', marginTop: '2px' }}>{currentLtb} LTB</span>
            </div>
            <div style={{ flex: 1, backgroundColor: colors.subBox, padding: '12px', borderRadius: '14px', border: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Target Vault</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: colors.textMuted, display: 'block', marginTop: '2px' }}>{targetLtb} LTB</span>
            </div>
          </div>

          {/* DYNAMIC METRIC STATUS FOOTER BLOCK */}
          {remaining > 0 ? (
            <div style={{
              backgroundColor: 'rgba(255, 191, 0, 0.05)',
              border: '1px solid rgba(255, 191, 0, 0.15)',
              borderRadius: '14px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Zap style={{ width: '16px', height: '16px', color: colors.accent, flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, leadingHeight: '1.4' }}>
                Earn <strong style={{ color: '#fff', fontWeight: 900 }}>{remaining} LTB</strong> more to automatically activate and ship your physical debit card.
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              borderRadius: '14px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Award style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                <strong style={{ color: '#fff', fontWeight: 900 }}>Milestone Unlocked!</strong> Your hardware deployment is ready for shipment.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER CALL-TO-ACTION ROW */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px'
      }}>
        <span style={{ color: colors.textMuted }}>Want to fast-track your progress?</span>
        <button style={{
          background: 'none',
          border: 'none',
          color: colors.accent,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: 0
        }}>
          Inject Volume <ArrowUpRight style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

    </div>
  );
}
