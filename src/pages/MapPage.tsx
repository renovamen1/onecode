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

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLevel, levelResults, crewUnlocked, totalScore, teamName } = useGameStore();
  const [selectedIsland, setSelectedIsland] = useState<number | null>(null);

  // guard against empty teamName (e.g. direct /map visit or cleared save)
  useEffect(() => {
    if (!teamName) {
      navigate('/', { replace: true });
    }
  }, [teamName, navigate]);
  const [showCrew, setShowCrew] = useState(false);
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
    <div className="scanlines" style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: '#1A5276' }}>
      {/* ── Top Bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--color-card)', borderBottom: 'var(--border-pixel)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px', height: '48px',
      }}>
        <div style={{
          fontFamily: 'var(--font-pixel)', fontSize: '10px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          {'⛵'} <span>{teamName || 'CREW'}</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-pixel)', fontSize: '10px',
          background: 'var(--color-bg)', padding: '4px 12px',
          border: 'var(--border-thin)',
        }}>
          Level {currentLevel}/15
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#FFB830',
            background: '#1A1A2E', padding: '4px 12px',
            border: '2px solid #FFB830',
          }}>
            {'⭐'} {totalScore.toLocaleString()} pts
          </div>
          <button
            onClick={() => setShowCrew(!showCrew)}
            style={{
              background: 'transparent', border: '2px dashed #1A1A2E',
              padding: '4px 8px', cursor: 'pointer',
              fontFamily: 'var(--font-pixel)', fontSize: '12px',
            }}
          >
            {'👥'}
          </button>
        </div>
      </div>

      {/* ── Scrollable Map ── */}
      <div ref={containerRef} style={{
        position: 'absolute', inset: 0, top: '48px', bottom: '48px', overflow: 'auto',
      }}>
        <div style={{
          width: '4000px', height: '900px', position: 'relative',
          background: 'linear-gradient(90deg, #2E8B6E 0%, #1B7A5A 15%, #1A6B8A 35%, #145B7A 55%, #4A2080 75%, #35155E 100%)',
        }}>
          {/* Ocean wave overlay - animated pixel texture */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 30px),
              repeating-linear-gradient(90deg, transparent, transparent 62px, rgba(255,255,255,0.02) 62px, rgba(255,255,255,0.02) 64px)
            `,
            animation: 'waveOcean 3s linear infinite',
          }} />

          {/* Secondary wave layer */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(0,0,0,0.03) 60px, rgba(0,0,0,0.03) 62px)',
            animation: 'waveOceanSlow 5s linear infinite',
          }} />

          {/* Zone labels */}
          {[
            { label: 'EAST BLUE', color: '#FF8A65', x: 800, badge: '①', wave: 'rgba(46,139,110,0.3)' },
            { label: 'GRAND LINE', color: '#42A5F5', x: 2300, badge: '②', wave: 'rgba(26,107,138,0.3)' },
            { label: 'NEW WORLD', color: '#AB47BC', x: 3300, badge: '③', wave: 'rgba(74,32,128,0.3)' },
          ].map(zone => (
            <div key={zone.label} style={{
              position: 'absolute', left: `${zone.x}px`, top: '35px',
              display: 'flex', alignItems: 'center', gap: '8px',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <span style={{
                background: zone.color, color: '#FFF', padding: '3px 8px',
                fontFamily: 'var(--font-pixel)', fontSize: '10px',
                border: '2px solid rgba(0,0,0,0.2)',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
              }}>
                {zone.badge}
              </span>
              <span style={{
                fontFamily: 'var(--font-pixel)', fontSize: '13px', color: zone.color,
                textShadow: '2px 2px 0px rgba(0,0,0,0.4)',
                letterSpacing: '2px',
              }}>
                {zone.label}
              </span>
            </div>
          ))}

          {/* Path connections (isometric dashed lines) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {islandData.map((island, i) => {
              if (i === 0) return null;
              const prev = islandData[i - 1];
              const state = getIslandState(island.levelId);
              const isCompleted = state !== 'locked';
              return (
                <g key={i}>
                  {/* Shadow line */}
                  <line
                    x1={prev.position.x + 3} y1={prev.position.y + 3}
                    x2={island.position.x + 3} y2={island.position.y + 3}
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth={isCompleted ? 4 : 2}
                    strokeDasharray={!isCompleted ? '10,8' : 'none'}
                  />
                  {/* Main line */}
                  <line
                    x1={prev.position.x} y1={prev.position.y}
                    x2={island.position.x} y2={island.position.y}
                    stroke={isCompleted ? '#FFB830' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isCompleted ? 3 : 2}
                    strokeDasharray={!isCompleted ? '10,8' : 'none'}
                    opacity={!isCompleted ? 0.4 : 0.8}
                  />
                  {/* Dot markers on completed paths */}
                  {isCompleted && (
                    <circle
                      cx={(prev.position.x + island.position.x) / 2}
                      cy={(prev.position.y + island.position.y) / 2}
                      r={3} fill="#FFB830" stroke="#1A1A2E" strokeWidth={1}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Round gates (isometric archways) */}
          {[
            { x: 1800, y: 350, between: '8-9', round: 2, unlocked: currentLevel > 8 },
            { x: 2880, y: 400, between: '12-13', round: 3, unlocked: currentLevel > 12 },
          ].map(gate => (
            <div key={gate.between} style={{
              position: 'absolute', left: `${gate.x}px`, top: `${gate.y}px`,
              transform: 'translate(-50%, -50%)',
              animation: gate.unlocked ? 'none' : 'torchFlicker 2s ease-in-out infinite',
            }}>
              {/* Isometric gate structure */}
              <div style={{
                width: '72px', height: '52px',
                border: `4px solid ${gate.unlocked ? rounds[gate.round - 1].accentColor : '#555'}`,
                borderBottom: 'none', borderRadius: '36px 36px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: gate.unlocked
                  ? `linear-gradient(180deg, ${rounds[gate.round - 1].accentColor}30, transparent)`
                  : 'rgba(0,0,0,0.4)',
                fontSize: '22px',
                boxShadow: gate.unlocked
                  ? `0 0 20px ${rounds[gate.round - 1].accentColor}40`
                  : '0 0 10px rgba(0,0,0,0.3)',
              }}>
                {gate.unlocked ? '🔓' : '🔒'}
              </div>
              {/* Gate pillars */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{
                  width: '8px', height: '20px',
                  background: gate.unlocked ? rounds[gate.round - 1].accentColor : '#555',
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                }} />
                <div style={{
                  width: '8px', height: '20px',
                  background: gate.unlocked ? rounds[gate.round - 1].accentColor : '#555',
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                }} />
              </div>
              <div style={{
                textAlign: 'center', fontFamily: 'var(--font-pixel)',
                fontSize: '7px', color: gate.unlocked ? rounds[gate.round - 1].accentColor : '#888',
                marginTop: '4px', textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
              }}>
                ROUND {gate.round}
              </div>
            </div>
          ))}

          {/* ── Islands (Isometric Tiles) ── */}
          {islandData.map((island, idx) => {
            const state = getIslandState(island.levelId);
            const result = levelResults[island.levelId];
            const isActive = state === 'active';
            const isComplete = state === 'complete';
            const isLocked = state === 'locked';
            const baseSize = island.size === 'large' ? 72 : island.size === 'medium' ? 56 : 44;

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
                  animation: isActive 
                    ? 'isoLift 2.5s ease-in-out infinite' 
                    : `isoSlideIn 400ms ease ${100 + idx * 50}ms both`,
                  zIndex: isActive ? 5 : 1,
                }}
              >
                {/* Isometric 3D block */}
                <div style={{ position: 'relative' }}>
                  {/* Top face */}
                  <div style={{
                    width: `${baseSize}px`, height: `${baseSize}px`,
                    background: isLocked 
                      ? 'linear-gradient(135deg, #666 0%, #555 100%)' 
                      : isComplete 
                        ? 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)'
                        : island.isBoss 
                          ? 'linear-gradient(135deg, #FFD54F 0%, #FFB830 100%)'
                          : 'linear-gradient(135deg, #8BC34A 0%, #689F38 100%)',
                    border: `3px solid ${isActive ? '#FF6B6B' : isComplete ? '#2E7D32' : '#1A1A2E'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: island.isBoss ? '18px' : '13px',
                    color: '#FFF',
                    textShadow: '1px 1px 0px rgba(0,0,0,0.4)',
                    filter: isLocked ? 'grayscale(0.8) brightness(0.7)' : 'none',
                    boxShadow: isActive 
                      ? '0 0 20px rgba(255,107,107,0.6), 0 0 40px rgba(255,107,107,0.3), 4px 4px 0px rgba(0,0,0,0.3)'
                      : '4px 4px 0px rgba(0,0,0,0.3)',
                    transition: 'transform 100ms, box-shadow 100ms',
                    position: 'relative',
                    imageRendering: 'pixelated' as const,
                  }}>
                    {/* Minecraft-style pixel noise texture */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px',
                      pointerEvents: 'none',
                    }} />

                    {/* Inner highlight */}
                    <div style={{
                      position: 'absolute', top: '3px', left: '3px',
                      width: '8px', height: '8px',
                      background: 'rgba(255,255,255,0.3)',
                    }} />

                    {isLocked ? '❓' : isComplete ? '✅' : island.isBoss ? '🔥' : island.levelId}

                    {/* Fog overlay for locked */}
                    {isLocked && (
                      <div style={{
                        position: 'absolute', inset: '-2px',
                        background: 'radial-gradient(circle, rgba(100,100,100,0.3), rgba(80,80,80,0.5))',
                        animation: 'float 4s ease-in-out infinite',
                      }} />
                    )}
                  </div>

                  {/* Right face (3D depth) */}
                  <div style={{
                    position: 'absolute',
                    top: '4px', right: '-8px',
                    width: '8px', height: `${baseSize}px`,
                    background: isLocked
                      ? '#444'
                      : isComplete
                        ? '#2E7D32'
                        : island.isBoss ? '#E6A200' : '#558B2F',
                    transform: 'skewY(-45deg)',
                    transformOrigin: 'top left',
                    border: '1px solid rgba(0,0,0,0.2)',
                    filter: isLocked ? 'grayscale(0.8)' : 'none',
                  }} />

                  {/* Bottom face (3D depth) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px', left: '4px',
                    width: `${baseSize}px`, height: '8px',
                    background: isLocked
                      ? '#333'
                      : isComplete
                        ? '#1B5E20'
                        : island.isBoss ? '#CC8800' : '#33691E',
                    transform: 'skewX(-45deg)',
                    transformOrigin: 'top left',
                    border: '1px solid rgba(0,0,0,0.2)',
                    filter: isLocked ? 'grayscale(0.8)' : 'none',
                  }} />
                </div>

                {/* Star rating for completed */}
                {isComplete && result && (
                  <div style={{
                    position: 'absolute', top: '-18px', left: '50%',
                    transform: 'translateX(-50%)', whiteSpace: 'nowrap',
                  }}>
                    <StarRating rating={result.starRating} size="sm" animate={false} />
                  </div>
                )}

                {/* Island name */}
                <div style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '6px', color: '#FFF',
                  textAlign: 'center', marginTop: '12px',
                  textShadow: '1px 1px 0px rgba(0,0,0,0.7)',
                  maxWidth: `${baseSize + 40}px`, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {island.name}
                </div>
              </div>
            );
          })}

          {/* ── Ship ── */}
          {(() => {
            const activeIsland = islandData.find(i => i.levelId === currentLevel) || islandData[0];
            return (
              <div style={{
                position: 'absolute',
                left: `${activeIsland.position.x}px`,
                top: `${activeIsland.position.y - 55}px`,
                transform: 'translate(-50%, -50%)',
                animation: 'bob 2s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 10,
              }}>
                {/* Ship with wake effect */}
                <div style={{ position: 'relative' }}>
                  <span style={{
                    fontSize: '36px',
                    filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.4))',
                  }}>
                    {'⛵'}
                  </span>
                  {/* Wake particles */}
                  <div style={{
                    position: 'absolute', bottom: '-4px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '24px', height: '3px',
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    animation: 'shipWake 1.5s ease-in-out infinite',
                  }} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Level Info Popup ── */}
      {selectedIsland && selectedLevel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(26,26,46,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 200ms ease',
          backdropFilter: 'blur(2px)',
        }} onClick={() => setSelectedIsland(null)}>
          <div className="iso-card" style={{
            maxWidth: '440px', width: '90%', padding: '20px',
            background: 'var(--color-card)',
            animation: 'blockPlace 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} onClick={e => e.stopPropagation()}>
            {/* Level name */}
            <div style={{
              fontFamily: 'var(--font-pixel)', fontSize: '12px',
              color: rounds.find(r => r.id === selectedLevel.roundId)?.accentColor,
              marginBottom: '8px',
            }}>
              {selectedLevel.isBoss ? '🔥 BOSS: ' : ''}{selectedLevel.name}
            </div>

            {/* Difficulty stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{
                  fontSize: '14px',
                  color: i < selectedLevel.difficulty ? '#FFB830' : '#ccc',
                }}>
                  {i < selectedLevel.difficulty ? '★' : '☆'}
                </span>
              ))}
            </div>

            {/* Story */}
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              marginBottom: '12px', lineHeight: '1.6', color: '#555',
            }}>
              {selectedLevel.story}
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '16px', marginBottom: '16px',
              fontSize: '11px', fontFamily: 'var(--font-body)', color: '#888',
            }}>
              <span>{'⏱'} {Math.floor(selectedLevel.timeLimit / 60)}:{(selectedLevel.timeLimit % 60).toString().padStart(2, '0')}</span>
              <span>{'⭐'} {selectedLevel.basePoints} pts</span>
            </div>

            {/* Actions */}
            {selectedResult?.completed ? (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <StarRating rating={selectedResult.starRating} size="md" />
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '12px', color: '#666',
                }}>
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
                  BACK
                </PixelButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Crew Sidebar ── */}
      {showCrew && (
        <div style={{
          position: 'fixed', right: 0, top: '48px', bottom: '48px', width: '230px',
          background: 'var(--color-card)', borderLeft: 'var(--border-pixel)', zIndex: 150,
          padding: '12px', animation: 'slideUp 200ms ease',
          overflowY: 'auto',
        }}>
          <div style={{
            fontFamily: 'var(--font-pixel)', fontSize: '10px', marginBottom: '12px',
            color: 'var(--color-primary)',
          }}>
            {'👥'} CREW ROSTER
          </div>
          {crew.map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
              opacity: crewUnlocked[c.id] ? 1 : 0.35,
              padding: '6px',
              background: crewUnlocked[c.id] ? 'rgba(255,184,48,0.05)' : 'transparent',
              border: crewUnlocked[c.id] ? '2px solid rgba(255,184,48,0.2)' : '2px solid transparent',
            }}>
              <div style={{
                width: '36px', height: '36px',
                background: crewUnlocked[c.id] ? c.colorScheme : '#888',
                border: '2px solid #1A1A2E',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#FFF',
                imageRendering: 'pixelated',
              }}>
                {crewUnlocked[c.id] ? c.archetype[0] : '?'}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }}>
                  {crewUnlocked[c.id] ? c.archetype : '???'}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '10px',
                  color: crewUnlocked[c.id] ? '#888' : '#aaa',
                }}>
                  {crewUnlocked[c.id] ? c.role : 'Locked'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom Nav ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--color-card)', borderTop: 'var(--border-pixel)',
        display: 'flex', justifyContent: 'center', gap: '12px',
        padding: '8px',
      }}>
        <PixelButton variant="ghost" size="sm" onClick={() => navigate('/')}>
          {'🏠'} HOME
        </PixelButton>
        <PixelButton variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
          {'🏆'} LEADERBOARD
        </PixelButton>
      </div>
    </div>
  );
};
