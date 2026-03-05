import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { StarRating } from '../components/ui/StarRating';
import { useGameStore } from '../store/gameStore';
import { islands as islandData } from '../data/mapData';
import { levels } from '../data/levels';
import { rounds } from '../data/rounds';
import { crew } from '../data/crew';
import { showToast } from '../components/ui/Toast';

const ZONE_COLORS = {
  'east-blue': { bg: 'linear-gradient(180deg, #7EC8A0 0%, #5BBFA0 50%, #3E9B8F 100%)', wave: '#5BBFA0' },
  'grand-line': { bg: 'linear-gradient(180deg, #42A5F5 0%, #1E88E5 50%, #1565C0 100%)', wave: '#1E88E5' },
  'new-world': { bg: 'linear-gradient(180deg, #7B1FA2 0%, #6A1B9A 50%, #4A148C 100%)', wave: '#6A1B9A' },
};

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLevel, levelResults, crewUnlocked, totalScore, teamName } = useGameStore();
  const [selectedIsland, setSelectedIsland] = useState<number | null>(null);
  const [showCrew, setShowCrew] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active island
  useEffect(() => {
    if (containerRef.current) {
      const activeIsland = islandData.find(i => i.levelId === currentLevel);
      if (activeIsland) {
        containerRef.current.scrollTo({
          left: activeIsland.position.x - window.innerWidth / 2,
          top: activeIsland.position.y - window.innerHeight / 2 + 100,
          behavior: 'smooth',
        });
      }
    }
  }, [currentLevel]);

  const getIslandState = (levelId: number) => {
    if (levelResults[levelId]?.completed) return 'complete';
    if (levelId === currentLevel) return 'active';
    if (levelId < currentLevel || (levelResults[levelId - 1]?.completed)) return 'active';
    return 'locked';
  };

  const handleIslandClick = (island: typeof islandData[0]) => {
    const state = getIslandState(island.levelId);
    if (state === 'locked') {
      showToast('Complete the previous level to unlock this island.', 'warning');
      return;
    }
    setSelectedIsland(island.levelId);
  };

  const handleStartLevel = (levelId: number) => {
    setSelectedIsland(null);
    navigate(`/level/${levelId}`);
  };

  const selectedLevel = levels.find(l => l.id === selectedIsland);
  const selectedResult = selectedIsland ? levelResults[selectedIsland] : null;

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: '#1565C0' }}>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: '#FFF8E7', borderBottom: '3px solid #1A1A2E',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px', height: '48px',
      }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px' }}>
          \u26F5 {teamName || 'CREW'}
        </div>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px' }}>
          Level {currentLevel}/15
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FFB830',
            background: '#1A1A2E', padding: '4px 12px',
          }}>
            \u2605 {totalScore.toLocaleString()} pts
          </div>
          <PixelButton variant="ghost" size="sm" onClick={() => setShowCrew(!showCrew)}>
            \uD83D\uDC65
          </PixelButton>
        </div>
      </div>

      {/* Scrollable map */}
      <div ref={containerRef} style={{
        position: 'absolute', inset: 0, top: '48px', overflow: 'auto',
      }}>
        <div ref={mapRef} style={{
          width: '4000px', height: '900px', position: 'relative',
          background: 'linear-gradient(90deg, #7EC8A0 0%, #5BBFA0 25%, #42A5F5 40%, #1E88E5 60%, #7B1FA2 75%, #4A148C 100%)',
        }}>
          {/* Animated wave overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,255,255,0.05) 30px, rgba(255,255,255,0.05) 32px)',
            animation: 'waveOcean 3s linear infinite',
          }} />

          {/* Zone labels */}
          {[
            { label: 'EAST BLUE', color: '#FF8A65', x: 800, badge: '\u2460' },
            { label: 'GRAND LINE', color: '#42A5F5', x: 2300, badge: '\u2461' },
            { label: 'NEW WORLD', color: '#AB47BC', x: 3300, badge: '\u2462' },
          ].map(zone => (
            <div key={zone.label} style={{
              position: 'absolute', left: `${zone.x}px`, top: '40px',
              fontFamily: "'Press Start 2P'", fontSize: '14px', color: zone.color,
              textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <span style={{
                background: zone.color, color: '#FFF', padding: '2px 6px',
                fontSize: '10px', marginRight: '8px',
              }}>
                {zone.badge}
              </span>
              {zone.label}
            </div>
          ))}

          {/* Path connections */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {islandData.map((island, i) => {
              if (i === 0) return null;
              const prev = islandData[i - 1];
              const state = getIslandState(island.levelId);
              return (
                <line key={i}
                  x1={prev.position.x} y1={prev.position.y}
                  x2={island.position.x} y2={island.position.y}
                  stroke={state !== 'locked' ? '#FFB830' : '#666'}
                  strokeWidth={state !== 'locked' ? 3 : 2}
                  strokeDasharray={state === 'locked' ? '8,8' : 'none'}
                  opacity={state === 'locked' ? 0.3 : 0.7}
                />
              );
            })}
          </svg>

          {/* Round gates */}
          {[
            { x: 1800, y: 350, between: '8-9', round: 2, unlocked: currentLevel > 8 },
            { x: 2880, y: 400, between: '12-13', round: 3, unlocked: currentLevel > 12 },
          ].map(gate => (
            <div key={gate.between} style={{
              position: 'absolute', left: `${gate.x}px`, top: `${gate.y}px`,
              transform: 'translate(-50%, -50%)',
            }}>
              <div style={{
                width: '64px', height: '48px',
                border: `4px solid ${gate.unlocked ? rounds[gate.round - 1].accentColor : '#888'}`,
                borderBottom: 'none', borderRadius: '32px 32px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: gate.unlocked ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
                fontSize: '20px',
              }}>
                {gate.unlocked ? '\uD83D\uDD13' : '\uD83D\uDD12'}
              </div>
            </div>
          ))}

          {/* Islands */}
          {islandData.map(island => {
            const state = getIslandState(island.levelId);
            const result = levelResults[island.levelId];
            const isActive = state === 'active';
            const isComplete = state === 'complete';
            const isLocked = state === 'locked';
            const size = island.size === 'large' ? 80 : island.size === 'medium' ? 60 : 48;

            return (
              <div
                key={island.id}
                onClick={() => handleIslandClick(island)}
                style={{
                  position: 'absolute',
                  left: `${island.position.x}px`,
                  top: `${island.position.y}px`,
                  transform: 'translate(-50%, -50%)',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                }}
              >
                {/* Island body */}
                <div style={{
                  width: `${size}px`, height: `${size}px`,
                  background: isLocked ? '#888' : isComplete ? '#4CAF50' : island.isBoss ? '#FFB830' : '#8BC34A',
                  border: `3px solid ${isActive ? '#FF6B6B' : isComplete ? '#2E7D32' : '#555'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Press Start 2P'", fontSize: island.isBoss ? '16px' : '12px',
                  color: '#FFF', textShadow: '1px 1px 0px rgba(0,0,0,0.3)',
                  filter: isLocked ? 'grayscale(1) opacity(0.5)' : 'none',
                  animation: isActive ? 'glow 2s ease infinite' : 'none',
                  boxShadow: isActive ? '0 0 15px rgba(255,107,107,0.5)' : '3px 3px 0px rgba(0,0,0,0.3)',
                  transition: 'transform 100ms',
                  position: 'relative',
                }}>
                  {isLocked ? '?' : isComplete ? '\u2713' : island.isBoss ? '\uD83D\uDD25' : island.levelId}

                  {/* Fog overlay for locked */}
                  {isLocked && (
                    <div style={{
                      position: 'absolute', inset: '-4px',
                      background: 'rgba(200,200,200,0.5)',
                      animation: 'float 4s ease-in-out infinite',
                    }} />
                  )}
                </div>

                {/* Star rating for completed */}
                {isComplete && result && (
                  <div style={{
                    position: 'absolute', top: `-16px`, left: '50%',
                    transform: 'translateX(-50%)', whiteSpace: 'nowrap',
                  }}>
                    <StarRating rating={result.starRating} size="sm" animate={false} />
                  </div>
                )}

                {/* Island name */}
                <div style={{
                  fontFamily: "'Press Start 2P'", fontSize: '6px', color: '#FFF',
                  textAlign: 'center', marginTop: '4px',
                  textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
                  maxWidth: `${size + 30}px`, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {island.name}
                </div>
              </div>
            );
          })}

          {/* Ship */}
          {(() => {
            const activeIsland = islandData.find(i => i.levelId === currentLevel) || islandData[0];
            return (
              <div style={{
                position: 'absolute',
                left: `${activeIsland.position.x}px`,
                top: `${activeIsland.position.y - 50}px`,
                transform: 'translate(-50%, -50%)',
                fontSize: '32px',
                animation: 'bob 2s ease-in-out infinite',
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
                pointerEvents: 'none',
                zIndex: 10,
              }}>
                \u26F5
              </div>
            );
          })()}
        </div>
      </div>

      {/* Level info popup */}
      {selectedIsland && selectedLevel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(26,26,46,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 200ms ease',
        }} onClick={() => setSelectedIsland(null)}>
          <PixelCard style={{
            maxWidth: '420px', width: '90%',
            animation: 'bounceSuccess 300ms ease',
          }} onClick={() => {}}>
            <div style={{
              fontFamily: "'Press Start 2P'", fontSize: '12px',
              color: rounds.find(r => r.id === selectedLevel.roundId)?.accentColor,
              marginBottom: '8px',
            }}>
              {selectedLevel.isBoss ? '\uD83D\uDD25 BOSS: ' : ''}{selectedLevel.name}
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < selectedLevel.difficulty ? '#FFB830' : '#ccc' }}>
                  {i < selectedLevel.difficulty ? '\u2605' : '\u2606'}
                </span>
              ))}
            </div>

            <p style={{ fontFamily: "'Nunito'", fontSize: '13px', marginBottom: '12px', lineHeight: '1.5' }}>
              {selectedLevel.story}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '11px', fontFamily: "'Nunito'", color: '#666' }}>
              <span>\u23F1 {Math.floor(selectedLevel.timeLimit / 60)}:{(selectedLevel.timeLimit % 60).toString().padStart(2, '0')}</span>
              <span>\u2605 {selectedLevel.basePoints} pts</span>
            </div>

            {selectedResult?.completed ? (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <StarRating rating={selectedResult.starRating} size="md" />
                </div>
                <div style={{ fontFamily: "'Nunito'", fontSize: '12px', color: '#666' }}>
                  Score: {selectedResult.score} | Time: {selectedResult.timeUsed}s | Accuracy: {Math.round(selectedResult.accuracy * 100)}%
                </div>
                <div style={{ marginTop: '12px' }}>
                  <PixelButton variant="ghost" size="sm" onClick={() => setSelectedIsland(null)}>
                    BACK TO MAP
                  </PixelButton>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <PixelButton variant="primary" onClick={() => handleStartLevel(selectedIsland)}>
                  START LEVEL
                </PixelButton>
                <PixelButton variant="ghost" onClick={() => setSelectedIsland(null)}>
                  BACK TO MAP
                </PixelButton>
              </div>
            )}
          </PixelCard>
        </div>
      )}

      {/* Crew sidebar */}
      {showCrew && (
        <div style={{
          position: 'fixed', right: 0, top: '48px', bottom: 0, width: '220px',
          background: '#FFF8E7', borderLeft: '3px solid #1A1A2E', zIndex: 150,
          padding: '12px', animation: 'slideUp 200ms ease',
          overflowY: 'auto',
        }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', marginBottom: '12px' }}>
            CREW ROSTER
          </div>
          {crew.map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px',
              opacity: crewUnlocked[c.id] ? 1 : 0.4,
            }}>
              <div style={{
                width: '36px', height: '36px',
                background: crewUnlocked[c.id] ? c.colorScheme : '#888',
                border: '2px solid #1A1A2E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FFF',
              }}>
                {crewUnlocked[c.id] ? c.archetype[0] : '?'}
              </div>
              <div>
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: '7px' }}>
                  {crewUnlocked[c.id] ? c.archetype : '???'}
                </div>
                <div style={{ fontFamily: "'Nunito'", fontSize: '10px', color: '#888' }}>
                  {crewUnlocked[c.id] ? c.role : 'Locked'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#FFF8E7', borderTop: '3px solid #1A1A2E',
        display: 'flex', justifyContent: 'center', gap: '12px',
        padding: '8px',
      }}>
        <PixelButton variant="ghost" size="sm" onClick={() => navigate('/')}>HOME</PixelButton>
        <PixelButton variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>LEADERBOARD</PixelButton>
      </div>
    </div>
  );
};
