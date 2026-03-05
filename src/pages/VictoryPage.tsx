import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/PixelButton';
import { StarRating } from '../components/ui/StarRating';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { crew } from '../data/crew';

export const VictoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamName, totalScore, levelResults, crewUnlocked, resetGame } = useGameStore();
  const completedLevels = Object.values(levelResults).filter(r => r.completed).length;
  const totalTime = Object.values(levelResults).reduce((sum, r) => sum + r.timeUsed, 0);
  const avgAccuracy = Object.values(levelResults).length > 0
    ? Object.values(levelResults).reduce((sum, r) => sum + r.accuracy, 0) / Object.values(levelResults).length
    : 0;
  const hintsUsed = Object.values(levelResults).reduce((sum, r) => sum + r.hintsUsed, 0);

  const maxScore = levels.reduce((sum, l) => sum + l.basePoints, 0);
  const pct = totalScore / maxScore;
  const rank = pct >= 0.9 ? 'KING OF THE GRAND LINE'
    : pct >= 0.7 ? 'VICE ADMIRAL'
    : pct >= 0.5 ? 'WARLORD'
    : 'ROOKIE';

  const shareText = `ONE CODE Results\nTeam: ${teamName}\nScore: ${totalScore.toLocaleString()}\nLevels: ${completedLevels}/15\nRank: ${rank}`;

  const sparkles = React.useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      left: (i * 37 + 13) % 100,
      top: (i * 23 + 7) % 100,
      size: 4 + (i % 4),
      color: i % 3 === 0 ? '#FFB830' : i % 3 === 1 ? '#FF6B6B' : '#4ECDC4',
      duration: 1.5 + (i % 3) * 0.5,
      delay: (i % 5) * 0.4,
    })),
  []);

  return (
    <div className="scanlines" style={{
      minHeight: '100vh', padding: '40px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
      background: 'var(--color-bg)', animation: 'pixelFadeIn 600ms ease',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Gold sparkle particles */}
      {sparkles.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          background: s.color,
          animation: `sparkle ${s.duration}s ease ${s.delay}s infinite`,
          imageRendering: 'pixelated',
        }} />
      ))}

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-pixel)', fontSize: 'clamp(18px, 5vw, 28px)',
        color: '#FFB830',
        textShadow: '3px 3px 0px #1A1A2E',
        animation: 'titleGlow 3s ease-in-out infinite',
      }}>
        {completedLevels >= 15 ? '🏆 VOYAGE COMPLETE 🏆' : '⛵ VOYAGE ENDED'}
      </div>

      <div style={{
        fontFamily: 'var(--font-pixel)', fontSize: '14px',
        color: '#FF6B6B',
      }}>
        {teamName}
      </div>

      {/* Main score card */}
      <div className="iso-card" style={{
        maxWidth: '500px', width: '100%', textAlign: 'center', padding: '24px',
        background: 'var(--color-card)',
      }}>
        <div style={{
          fontFamily: 'var(--font-pixel)', fontSize: 'clamp(20px, 6vw, 32px)',
          color: '#FFB830', marginBottom: '8px',
          animation: 'bounceSuccess 300ms ease',
          textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
        }}>
          {totalScore.toLocaleString()} PTS
        </div>
        <div style={{
          fontFamily: 'var(--font-pixel)', fontSize: '12px',
          color: rank === 'KING OF THE GRAND LINE' ? '#FFB830' : '#1A1A2E',
          marginBottom: '16px',
          padding: '4px 12px',
          background: rank === 'KING OF THE GRAND LINE' ? 'rgba(255,184,48,0.1)' : 'transparent',
          display: 'inline-block',
        }}>
          {'🏆'} {rank}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
          fontFamily: 'var(--font-body)', fontSize: '13px',
          padding: '12px', background: 'var(--color-bg)',
          border: 'var(--border-thin)',
        }}>
          <div>{'📊'} Levels: {completedLevels}/15</div>
          <div>{'⏱'} Time: {Math.floor(totalTime / 60)}m {totalTime % 60}s</div>
          <div>{'🎯'} Accuracy: {Math.round(avgAccuracy * 100)}%</div>
          <div>{'💡'} Hints Used: {hintsUsed}</div>
        </div>
      </div>

      {/* Level grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px',
        maxWidth: '400px', width: '100%',
      }}>
        {levels.map(l => {
          const result = levelResults[l.id];
          return (
            <div key={l.id} style={{
              textAlign: 'center', padding: '8px 4px',
              background: result?.completed ? '#E8F5E9' : 'var(--color-card)',
              border: `2px solid ${result?.completed ? '#4CAF50' : '#ccc'}`,
              boxShadow: result?.completed ? '2px 2px 0px rgba(76,175,80,0.3)' : '2px 2px 0px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                fontFamily: 'var(--font-pixel)', fontSize: '8px', marginBottom: '4px',
                color: result?.completed ? '#2E7D32' : '#999',
              }}>
                {l.id}
              </div>
              {result?.completed ? (
                <StarRating rating={result.starRating} size="sm" animate={false} />
              ) : (
                <span style={{ fontSize: '10px', color: '#ccc' }}>{'☐'}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Crew roster */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {crew.map(c => (
          <div key={c.id} style={{
            width: '40px', height: '40px',
            background: crewUnlocked[c.id] ? c.colorScheme : '#888',
            border: '3px solid #1A1A2E',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-pixel)', fontSize: '11px', color: '#FFF',
            filter: crewUnlocked[c.id] ? 'none' : 'grayscale(1)',
            imageRendering: 'pixelated',
          }}>
            {crewUnlocked[c.id] ? c.archetype[0] : '?'}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <PixelButton variant="primary" onClick={() => navigate('/leaderboard')}>
          {'🏆'} LEADERBOARD
        </PixelButton>
        <PixelButton variant="secondary" onClick={() => {
          if (window.confirm('Start a new voyage? Current progress will be reset.')) {
            resetGame();
            navigate('/register');
          }
        }}>
          {'⛵'} PLAY AGAIN
        </PixelButton>
        <PixelButton variant="ghost" onClick={() => {
          navigator.clipboard.writeText(shareText);
          alert('Results copied to clipboard!');
        }}>
          {'📋'} SHARE
        </PixelButton>
      </div>
    </div>
  );
};
