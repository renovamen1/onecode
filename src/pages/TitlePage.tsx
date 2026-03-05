import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/PixelButton';
import { useGameStore } from '../store/gameStore';

// Pixel particle component
interface ParticleData { delay: number; x: number; size: number; color: string; duration: number; }
const PixelParticle: React.FC<ParticleData> = ({ delay, x, size, color, duration }) => (
  <div style={{
    position: 'absolute',
    left: `${x}%`,
    top: '-10px',
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    opacity: 0.7,
    animation: `pixelFall ${duration}s linear ${delay}s infinite`,
    imageRendering: 'pixelated' as const,
  }} />
);

// Minecraft-style 3D block letter
const BlockLetter: React.FC<{ char: string; color: string; delay: number }> = ({ char, color, delay }) => (
  <span style={{
    display: 'inline-block',
    fontFamily: 'var(--font-pixel)',
    fontSize: 'clamp(28px, 8vw, 48px)',
    color: '#FFF',
    background: color,
    padding: '4px 6px',
    border: '3px solid #1A1A2E',
    boxShadow: '4px 4px 0px #1A1A2E, inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.2)',
    margin: '0 2px',
    animation: `blockPlace 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both`,
    lineHeight: '1.2',
    imageRendering: 'pixelated' as const,
    position: 'relative' as const,
  }}>
    {char}
    {/* Pixel highlight on top-left */}
    <span style={{
      position: 'absolute', top: '2px', left: '2px',
      width: '4px', height: '4px', background: 'rgba(255,255,255,0.4)',
    }} />
  </span>
);

export const TitlePage: React.FC = () => {
  const navigate = useNavigate();
  const { teamName, currentLevel, totalScore } = useGameStore();
  const hasSave = teamName !== '' && currentLevel > 0;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const titleChars = 'ONE CODE'.split('');

  const particles = React.useMemo<ParticleData[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      delay: i * 0.5,
      x: (i * 37 + 13) % 100,
      size: 4 + (i % 4),
      color: ['#FFB830', '#FF6B6B', '#4ECDC4', '#B39DDB', '#4CAF50'][i % 5],
      duration: 4 + (i % 6),
    })),
  []);

  return (
    <div className="scanlines" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '20px',
      background: 'var(--color-bg)', padding: '20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Pixel particle rain */}
      {particles.map((p, i) => (
        <PixelParticle key={i} {...p} />
      ))}

      {/* Minecraft-style ground blocks at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px',
        display: 'flex', overflow: 'hidden',
      }}>
        {Array.from({ length: Math.ceil(window.innerWidth / 32) + 1 }).map((_, i) => (
          <div key={i} style={{
            width: '32px', height: '48px', flexShrink: 0,
            background: i % 2 === 0 
              ? 'linear-gradient(180deg, #5B8731 0%, #5B8731 33%, #8B6914 33%, #8B6914 100%)'
              : 'linear-gradient(180deg, #6B9B3A 0%, #6B9B3A 33%, #7B5E12 33%, #7B5E12 100%)',
            border: '1px solid rgba(0,0,0,0.1)',
            imageRendering: 'pixelated',
          }} />
        ))}
      </div>

      {/* Ship icon - animated */}
      <div style={{
        fontSize: '56px',
        animation: 'bob 2.5s ease-in-out infinite',
        filter: 'drop-shadow(3px 3px 0px rgba(26,26,46,0.3))',
        marginBottom: '-8px',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 500ms ease',
      }}>
        {'⛵'}
      </div>

      {/* 3D Block Title */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: '0px', marginBottom: '4px',
      }}>
        {titleChars.map((char, i) => (
          char === ' ' 
            ? <span key={i} style={{ width: '16px' }} />
            : <BlockLetter 
                key={i} 
                char={char} 
                color={i < 3 ? '#FF6B6B' : '#FFB830'} 
                delay={200 + i * 80} 
              />
        ))}
      </div>

      {/* Subtitle with pixel divider */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 800ms ease 600ms',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2vw, 12px)',
          color: 'var(--color-text)', letterSpacing: '3px', textAlign: 'center',
        }}>
          THE VOYAGE OF REASONING
        </h2>

        {/* Diamond divider */}
        <div style={{
          fontFamily: 'var(--font-pixel)', fontSize: '10px',
          color: 'var(--color-lavender)', letterSpacing: '8px',
        }}>
          {'◆ ◆ ◆ ◆ ◆'}
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        alignItems: 'center', marginTop: '16px',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 800ms ease 1000ms',
      }}>
        {hasSave && (
          <>
            <PixelButton variant="secondary" size="lg" onClick={() => navigate('/map')}>
              {'⛵'} CONTINUE VOYAGE
            </PixelButton>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888',
              textAlign: 'center',
            }}>
              {teamName} — Level {currentLevel}/15 — {'⭐'} {totalScore.toLocaleString()} pts
            </div>
          </>
        )}

        <PixelButton variant="primary" size="lg" onClick={() => {
          if (hasSave) {
            if (window.confirm('Starting a new voyage will overwrite your saved progress. Continue?')) {
              navigate('/register');
            }
          } else {
            navigate('/register');
          }
        }}>
          {'⚓'} START VOYAGE
        </PixelButton>

        <PixelButton variant="ghost" size="md" onClick={() => navigate('/leaderboard')}>
          {'🏆'} LEADERBOARD
        </PixelButton>
      </div>

      {/* Footer info */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: '11px', color: '#999',
        marginTop: '24px', textAlign: 'center',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 800ms ease 1200ms',
        zIndex: 1,
      }}>
        A Computational Thinking Adventure • 15 Puzzle Islands • 3 Rounds
      </div>

      {/* Version badge */}
      <div style={{
        position: 'absolute', bottom: '56px', right: '12px',
        fontFamily: 'var(--font-pixel)', fontSize: '6px',
        color: '#bbb', zIndex: 1,
      }}>
        v2.0
      </div>
    </div>
  );
};
