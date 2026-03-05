import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const sizeMap = { sm: 12, md: 18, lg: 24 };

export const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5, size = 'md', animate = true }) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: `${sizeMap[size]}px`,
            color: i < rating ? '#FFB830' : '#ccc',
            animation: animate && i < rating ? `bounceSuccess 200ms ease ${i * 100}ms both` : 'none',
            textShadow: i < rating ? '0 0 4px rgba(255,184,48,0.3)' : 'none',
          }}
        >
          {i < rating ? '\u2605' : '\u2606'}
        </span>
      ))}
    </div>
  );
};
