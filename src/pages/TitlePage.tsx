import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { useGameStore } from '../store/gameStore';

export const TitlePage: React.FC = () => {
  const navigate = useNavigate();
  const { teamName, currentLevel, totalScore } = useGameStore();
  const hasSave = teamName !== '' && currentLevel > 0;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '24px',
      background: 'var(--color-bg)', padding: '20px',
      animation: 'pixelFadeIn 600ms ease',
    }}>
      {/* Pixel ship decoration */}
      <div style={{ fontSize: '48px', animation: 'bob 2s ease-in-out infinite' }}>
        \u26F5
      </div>

      <h1 style={{
        fontFamily: 'var(--font-pixel)', fontSize: '38px', color: 'var(--color-primary)',
        textShadow: '4px 4px 0px #1A1A2E', letterSpacing: '4px', textAlign: 'center',
      }}>
        ONE CODE
      </h1>

      <h2 style={{
        fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--color-text)',
        letterSpacing: '3px', textAlign: 'center',
      }}>
        THE VOYAGE OF REASONING
      </h2>

      <div style={{
        fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--color-gold)',
        letterSpacing: '6px',
      }}>
        \u25C6 \u25C6 \u25C6 \u25C6 \u25C6
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '20px' }}>
        {hasSave && (
          <>
            <PixelButton variant="secondary" size="lg" onClick={() => navigate('/map')}>
              \u26F5 CONTINUE VOYAGE
            </PixelButton>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888',
              textAlign: 'center',
            }}>
              {teamName} \u2014 Level {currentLevel}/15 \u2014 \u2605 {totalScore.toLocaleString()} pts
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
          \u2693 START VOYAGE
        </PixelButton>

        <PixelButton variant="ghost" size="md" onClick={() => navigate('/leaderboard')}>
          \uD83C\uDFC6 LEADERBOARD
        </PixelButton>
      </div>

      <div style={{
        fontFamily: 'var(--font-body)', fontSize: '11px', color: '#999',
        marginTop: '40px', textAlign: 'center',
      }}>
        A Computational Thinking Adventure \u2022 15 Puzzle Islands \u2022 3 Rounds
      </div>
    </div>
  );
};
