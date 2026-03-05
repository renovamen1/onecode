import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/PixelButton';
import { useGameStore } from '../store/gameStore';

const MEDALS = ['🥇', '🥈', '🥉'];

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { leaderboard, teamName, totalScore, addLeaderboardEntry } = useGameStore();

  // Auto-add current team if not in leaderboard
  React.useEffect(() => {
    if (teamName && totalScore > 0) {
      addLeaderboardEntry({
        teamName,
        score: totalScore,
        levelsCompleted: Object.keys(useGameStore.getState().levelResults).length,
        totalTime: Object.values(useGameStore.getState().levelResults).reduce((s, r) => s + r.timeUsed, 0),
        timestamp: Date.now(),
      });
    }
  }, []);

  const entries = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 20);

  return (
    <div className="scanlines" style={{
      minHeight: '100vh', padding: '40px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
      background: 'var(--color-bg)', animation: 'pixelFadeIn 600ms ease',
    }}>
      <div style={{
        fontFamily: 'var(--font-pixel)', fontSize: '16px', color: '#FF6B6B',
        textShadow: '3px 3px 0px #1A1A2E',
      }}>
        {'🏆'} GRAND LINE RANKINGS
      </div>

      <div className="iso-card" style={{
        maxWidth: '620px', width: '100%', padding: '16px',
        background: 'var(--color-card)',
      }}>
        {entries.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            fontFamily: 'var(--font-body)', fontSize: '14px', color: '#888',
          }}>
            No scores yet. Be the first to set sail! {'⛵'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '3px solid #1A1A2E' }}>
                {['RANK', 'TEAM', 'SCORE', 'LVL', 'TIME'].map(h => (
                  <th key={h} style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '7px',
                    padding: '8px 4px', textAlign: h === 'TEAM' ? 'left' : 'center',
                    color: '#888',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const isCurrentTeam = entry.teamName === teamName;
                return (
                  <tr key={`${entry.teamName}-${i}`} style={{
                    background: isCurrentTeam
                      ? 'rgba(255,184,48,0.12)'
                      : i % 2 === 0 ? 'var(--color-card)' : 'var(--color-bg)',
                    borderBottom: '1px solid rgba(26,26,46,0.1)',
                    transition: 'background 200ms',
                  }}>
                    <td style={{
                      fontFamily: 'var(--font-pixel)', fontSize: '10px',
                      padding: '10px 4px', textAlign: 'center',
                      color: i < 3 ? '#FFB830' : '#888',
                    }}>
                      {i < 3 ? MEDALS[i] : i + 1}
                    </td>
                    <td style={{
                      fontFamily: 'var(--font-body)', fontSize: '13px',
                      fontWeight: isCurrentTeam ? 800 : 600,
                      padding: '10px 4px',
                      color: isCurrentTeam ? '#FF6B6B' : '#1A1A2E',
                    }}>
                      {entry.teamName} {isCurrentTeam && '⭐'}
                    </td>
                    <td style={{
                      fontFamily: 'var(--font-pixel)', fontSize: '9px',
                      padding: '10px 4px', textAlign: 'center', color: '#FFB830',
                    }}>
                      {entry.score.toLocaleString()}
                    </td>
                    <td style={{
                      fontFamily: 'var(--font-body)', fontSize: '12px',
                      padding: '10px 4px', textAlign: 'center',
                    }}>
                      {entry.levelsCompleted}/15
                    </td>
                    <td style={{
                      fontFamily: 'var(--font-body)', fontSize: '12px',
                      padding: '10px 4px', textAlign: 'center', color: '#888',
                    }}>
                      {Math.floor(entry.totalTime / 60)}m
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <PixelButton variant="ghost" size="md" onClick={() => navigate('/map')}>
          {'⛵'} BACK TO MAP
        </PixelButton>
        <PixelButton variant="primary" size="md" onClick={() => navigate('/register')}>
          {'🎮'} NEW GAME
        </PixelButton>
      </div>
    </div>
  );
};
