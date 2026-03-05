import React from 'react';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  animate?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, maxXP, animate = true }) => {
  const segments = 20;
  const filledSegments = Math.min(Math.round((currentXP / Math.max(maxXP, 1)) * segments), segments);

  return (
    <div style={{
      display: 'flex', gap: '2px', padding: '4px 12px',
      background: 'var(--color-card)', borderBottom: '2px solid #1A1A2E',
      alignItems: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-pixel)', fontSize: '7px',
        color: '#4CAF50', marginRight: '6px',
        textShadow: '1px 1px 0px rgba(0,0,0,0.1)',
      }}>
        XP
      </span>
      <div style={{
        flex: 1, display: 'flex', gap: '2px',
        background: 'rgba(0,0,0,0.05)', padding: '2px',
        border: '1px solid rgba(0,0,0,0.1)',
      }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '8px',
              background: i < filledSegments ? '#FFB830' : 'transparent',
              border: `1px solid ${i < filledSegments ? '#E6A200' : 'rgba(0,0,0,0.08)'}`,
              transition: animate ? 'background 300ms ease' : 'none',
              animation: animate && i === filledSegments - 1 ? 'xpPulse 1s ease infinite' : 'none',
              boxShadow: i < filledSegments ? 'inset 0 -2px 0px rgba(0,0,0,0.15)' : 'none',
            }}
          />
        ))}
      </div>
      <span style={{
        fontFamily: 'var(--font-pixel)', fontSize: '7px',
        color: '#FFB830', marginLeft: '6px',
        whiteSpace: 'nowrap',
      }}>
        {currentXP}/{maxXP}
      </span>
    </div>
  );
};
