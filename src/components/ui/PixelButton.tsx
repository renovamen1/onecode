import React from 'react';

interface PixelButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const colorMap: Record<string, { bg: string; hover: string; color: string; border: string }> = {
  primary: { bg: '#FF6B6B', hover: '#FF5252', color: '#FFF', border: '#1A1A2E' },
  secondary: { bg: '#FFB830', hover: '#FFA000', color: '#1A1A2E', border: '#1A1A2E' },
  success: { bg: '#4CAF50', hover: '#43A047', color: '#FFF', border: '#1A1A2E' },
  danger: { bg: '#F48FB1', hover: '#EC407A', color: '#1A1A2E', border: '#1A1A2E' },
  ghost: { bg: 'transparent', hover: 'rgba(26,26,46,0.04)', color: '#1A1A2E', border: '#1A1A2E' },
};

const sizeMap: Record<string, { padding: string; fontSize: string }> = {
  sm: { padding: '6px 12px', fontSize: '8px' },
  md: { padding: '10px 20px', fontSize: '10px' },
  lg: { padding: '14px 28px', fontSize: '12px' },
};

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary', children, onClick, disabled = false, className = '', size = 'md', style
}) => {
  const colors = colorMap[variant];
  const sizing = sizeMap[size];
  const isGhost = variant === 'ghost';

  const baseStyle: React.CSSProperties = {
    background: disabled ? '#ccc' : colors.bg,
    color: disabled ? '#888' : colors.color,
    border: isGhost ? `2px dashed ${colors.border}` : `3px solid ${colors.border}`,
    borderRadius: 0,
    boxShadow: isGhost ? 'none' : `0 4px 0px ${colors.border}`,
    fontFamily: "'Press Start 2P', monospace",
    fontSize: sizing.fontSize,
    padding: sizing.padding,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 80ms, box-shadow 80ms, background 150ms',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    lineHeight: '1.5',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    position: 'relative' as const,
    imageRendering: 'pixelated' as const,
    ...style,
  };

  return (
    <button
      className={className}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={e => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = disabled ? '#ccc' : colors.hover;
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = disabled ? '#ccc' : colors.bg;
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = isGhost ? 'none' : `0 4px 0px ${colors.border}`;
      }}
      onMouseDown={e => {
        if (!disabled && !isGhost) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(4px)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = isGhost ? 'none' : `0 4px 0px ${colors.border}`;
      }}
    >
      {children}
    </button>
  );
};
