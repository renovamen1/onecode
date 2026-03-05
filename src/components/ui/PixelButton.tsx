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

const colorMap: Record<string, { bg: string; color: string; border: string }> = {
  primary: { bg: '#FF6B6B', color: '#FFF', border: '#1A1A2E' },
  secondary: { bg: '#FFB830', color: '#1A1A2E', border: '#1A1A2E' },
  success: { bg: '#4CAF50', color: '#FFF', border: '#1A1A2E' },
  danger: { bg: '#F48FB1', color: '#1A1A2E', border: '#1A1A2E' },
  ghost: { bg: 'transparent', color: '#1A1A2E', border: '#1A1A2E' },
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

  const baseStyle: React.CSSProperties = {
    background: disabled ? '#ccc' : colors.bg,
    color: disabled ? '#888' : colors.color,
    border: variant === 'ghost' ? `2px dashed ${colors.border}` : `3px solid ${colors.border}`,
    borderRadius: 0,
    boxShadow: variant === 'ghost' ? 'none' : `4px 4px 0px ${colors.border}`,
    fontFamily: "'Press Start 2P', monospace",
    fontSize: sizing.fontSize,
    padding: sizing.padding,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 80ms, box-shadow 80ms',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    lineHeight: '1.5',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ...style,
  };

  return (
    <button
      className={className}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={e => {
        if (!disabled && variant !== 'ghost') {
          (e.currentTarget as HTMLElement).style.transform = 'translate(2px, 2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = `2px 2px 0px ${colors.border}`;
        }
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = variant === 'ghost' ? 'none' : `4px 4px 0px ${colors.border}`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = variant === 'ghost' ? 'none' : `4px 4px 0px ${colors.border}`;
      }}
    >
      {children}
    </button>
  );
};
