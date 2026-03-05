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
      display: 'flex', gap: '3px', padding: '4px 12px',
      background: '#FFF8E7', borderBottom: '2px solid #1A1A2E',
    }}>
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#1A1A2E', marginRight: '6px', alignSelf: 'center' }}>
        XP
      </span>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '100%', maxWidth: '40px', height: '8px',
            background: i < filledSegments ? '#FFB830' : 'transparent',
            border: `1px solid ${i < filledSegments ? '#1A1A2E' : '#ccc'}`,
            transition: animate ? 'background 300ms ease' : 'none',
            animation: animate && i === filledSegments - 1 ? 'bounceSuccess 300ms ease' : 'none',
          }}
        />
      ))}
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#FFB830', marginLeft: '6px', alignSelf: 'center', whiteSpace: 'nowrap' }}>
        {currentXP}/{maxXP}
      </span>
    </div>
  );
};
