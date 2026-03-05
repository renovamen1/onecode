import React from 'react';

interface PixelCardProps {
  variant?: 'primary' | 'info' | 'level' | 'code';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: '#FFF8E7' },
  info: { background: '#FFFDF0' },
  level: { background: '#FFFFFF' },
  code: { background: '#F5F5F5', borderColor: '#B39DDB' },
};

export const PixelCard: React.FC<PixelCardProps> = ({ variant = 'primary', children, className = '', onClick, style }) => {
  const base: React.CSSProperties = {
    border: '3px solid #1A1A2E',
    borderRadius: 0,
    boxShadow: '4px 4px 0px #1A1A2E',
    padding: '16px',
    transition: 'transform 80ms, box-shadow 80ms',
    cursor: onClick ? 'pointer' : 'default',
    ...variantStyles[variant],
    ...style,
  };

  return (
    <div
      className={className}
      style={base}
      onClick={onClick}
      onMouseEnter={e => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0px #1A1A2E';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px #1A1A2E';
      }}
    >
      {children}
    </div>
  );
};
