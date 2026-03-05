import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { StarRating } from '../components/ui/StarRating';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { crew } from '../data/crew';

export const VictoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamName, totalScore, xp, levelResults, crewUnlocked, resetGame } = useGameStore();
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

  return (
    <div style={{
      minHeight: '100vh', padding: '40px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
      background: 'var(--color-bg)', animation: 'pixelFadeIn 600ms ease',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Gold particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          width: '4px', height: '4px', background: '#FFB830',
          animation: `sparkle ${1.5 + Math.random()}s ease ${Math.random() * 2}s infinite`,
        }} />
      ))}

      <div style={{
        fontFamily: "'Press Start 2P'", fontSize: '24px', color: '#FFB830',
        textShadow: '3px 3px 0px #1A1A2E',
      }}>
        {completedLevels >= 15 ? 'VOYAGE COMPLETE' : 'VOYAGE ENDED'}
      </div>

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#FF6B6B' }}>
        {teamName}
      </div>

      <PixelCard style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '28px', color: '#FFB830',
          marginBottom: '8px', animation: 'bounceSuccess 300ms ease',
        }}>
          {totalScore.toLocaleString()} PTS
        </div>
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '12px',
          color: rank === 'KING OF THE GRAND LINE' ? '#FFB830' : '#1A1A2E',
          marginBottom: '16px',
        }}>
          \uD83C\uDFC6 {rank}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
          fontFamily: "'Nunito'", fontSize: '13px',
        }}>
          <div>Levels: {completedLevels}/15</div>
          <div>Time: {Math.floor(totalTime / 60)}m {totalTime % 60}s</div>
          <div>Accuracy: {Math.round(avgAccuracy * 100)}%</div>
          <div>Hints Used: {hintsUsed}</div>
        </div>
      </PixelCard>

      {/* Level grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px',
        maxWidth: '400px', width: '100%',
      }}>
        {levels.map(l => {
          const result = levelResults[l.id];
          return (
            <div key={l.id} style={{
              textAlign: 'center', padding: '6px',
              background: result?.completed ? '#E8F5E9' : '#F5F5F5',
              border: `2px solid ${result?.completed ? '#4CAF50' : '#ccc'}`,
            }}>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '2px' }}>
                {l.id}
              </div>
              {result?.completed ? (
                <StarRating rating={result.starRating} size="sm" animate={false} />
              ) : (
                <span style={{ fontSize: '10px', color: '#ccc' }}>\u2610</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Crew roster */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {crew.map(c => (
          <div key={c.id} style={{
            width: '36px', height: '36px',
            background: crewUnlocked[c.id] ? c.colorScheme : '#888',
            border: '2px solid #1A1A2E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FFF',
            filter: crewUnlocked[c.id] ? 'none' : 'grayscale(1)',
          }}>
            {crewUnlocked[c.id] ? c.archetype[0] : '?'}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <PixelButton variant="primary" onClick={() => navigate('/leaderboard')}>
          \uD83C\uDFC6 LEADERBOARD
        </PixelButton>
        <PixelButton variant="secondary" onClick={() => {
          if (window.confirm('Start a new voyage? Current progress will be reset.')) {
            resetGame();
            navigate('/register');
          }
        }}>
          \u26F5 PLAY AGAIN
        </PixelButton>
        <PixelButton variant="ghost" onClick={() => {
          navigator.clipboard.writeText(shareText);
          alert('Results copied to clipboard!');
        }}>
          \uD83D\uDCCB SHARE
        </PixelButton>
      </div>
    </div>
  );
};
