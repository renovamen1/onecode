import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer } from '../components/ui/Timer';
import { XPBar } from '../components/ui/XPBar';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { StarRating } from '../components/ui/StarRating';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { crew } from '../data/crew';
import { rounds } from '../data/rounds';
import { LevelState } from '../types/game';

// Level imports
import { Level01StormTheKeyboard } from '../components/levels/Level01StormTheKeyboard';
import { Level02LostInTheFog } from '../components/levels/Level02LostInTheFog';
import { Level03CipherCrosswords } from '../components/levels/Level03CipherCrosswords';
import { Level04ShatteredCompass } from '../components/levels/Level04ShatteredCompass';
import { Level05AdmiralsGambit } from '../components/levels/Level05AdmiralsGambit';
import { Level06LiarsIsland } from '../components/levels/Level06LiarsIsland';
import { Level07SignalInTheStatic } from '../components/levels/Level07SignalInTheStatic';
import { Level08AncientGate } from '../components/levels/Level08AncientGate';
import { Level09CipherStone } from '../components/levels/Level09CipherStone';
import { Level10DensityChamber } from '../components/levels/Level10DensityChamber';
import { Level11InfiniteKitchen } from '../components/levels/Level11InfiniteKitchen';
import { Level12HauntedLighthouse } from '../components/levels/Level12HauntedLighthouse';
import { Level13CorruptedSystem } from '../components/levels/Level13CorruptedSystem';
import { Level14IceWall } from '../components/levels/Level14IceWall';
import { Level15TheOneCode } from '../components/levels/Level15TheOneCode';

const LEVEL_COMPONENTS: Record<number, React.ComponentType<any>> = {
  1: Level01StormTheKeyboard,
  2: Level02LostInTheFog,
  3: Level03CipherCrosswords,
  4: Level04ShatteredCompass,
  5: Level05AdmiralsGambit,
  6: Level06LiarsIsland,
  7: Level07SignalInTheStatic,
  8: Level08AncientGate,
  9: Level09CipherStone,
  10: Level10DensityChamber,
  11: Level11InfiniteKitchen,
  12: Level12HauntedLighthouse,
  13: Level13CorruptedSystem,
  14: Level14IceWall,
  15: Level15TheOneCode,
};

export const LevelPage: React.FC = () => {
  const { levelId: levelIdParam } = useParams();
  const navigate = useNavigate();
  const levelId = Number(levelIdParam);
  const levelConfig = levels.find(l => l.id === levelId);
  const round = rounds.find(r => r.id === levelConfig?.roundId);

  const { totalScore, xp, isSoloMode, hintsRemaining, completeLevel, calculateScore } = useGameStore();

  const [state, setState] = useState<LevelState>('transition');
  const [countdown, setCountdown] = useState(3);
  const [levelScore, setLevelScore] = useState(0);
  const [levelTime, setLevelTime] = useState(0);
  const [levelAccuracy, setLevelAccuracy] = useState(0);
  const [starRating, setStarRating] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [unlockedCrew, setUnlockedCrew] = useState<typeof crew[0] | null>(null);

  if (!levelConfig || !round) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Level not found</h2>
        <PixelButton variant="primary" onClick={() => navigate('/map')}>BACK TO MAP</PixelButton>
      </div>
    );
  }

  const timeLimit = Math.round(levelConfig.timeLimit * (isSoloMode ? 1.2 : 1));

  // Countdown
  useEffect(() => {
    if (state !== 'transition') return;
    if (countdown <= 0) {
      setState('playing');
      setTimerRunning(true);
      setTimeRemaining(timeLimit);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [state, countdown]);

  const handleComplete = useCallback((score: number, timeUsed: number, accuracy: number) => {
    const finalScore = calculateScore(levelConfig.basePoints, timeLimit - timeUsed, timeLimit, accuracy);
    setLevelScore(finalScore);
    setLevelTime(timeUsed);
    setLevelAccuracy(accuracy);
    setStarRating(
      finalScore >= levelConfig.basePoints * 0.95 ? 5 :
      finalScore >= levelConfig.basePoints * 0.80 ? 4 :
      finalScore >= levelConfig.basePoints * 0.60 ? 3 :
      finalScore >= levelConfig.basePoints * 0.40 ? 2 : 1
    );

    completeLevel(levelId, finalScore, timeUsed, accuracy);
    setTimerRunning(false);

    // Check crew unlock (Round 1 levels 1-7)
    if (levelId >= 1 && levelId <= 7) {
      const crewMember = crew.find(c => c.unlockedAtLevel === levelId);
      if (crewMember) setUnlockedCrew(crewMember);
    }

    setState('complete');
  }, [levelConfig, timeLimit, levelId]);

  const handleFail = useCallback(() => {
    setTimerRunning(false);
    setState('failed');
  }, []);

  const handleTimeUp = useCallback(() => {
    handleFail();
  }, [handleFail]);

  const handleRetry = () => {
    setState('transition');
    setCountdown(3);
    setLevelScore(0);
    setLevelTime(0);
  };

  const LevelComponent = LEVEL_COMPONENTS[levelId];

  // Transition screen
  if (state === 'transition') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
        background: `${round.accentColor}15`,
      }}>
        <div style={{
          background: round.accentColor, padding: '4px 20px',
          fontFamily: "'Press Start 2P'", fontSize: '9px', color: '#FFF',
        }}>
          ROUND {round.id}: {round.name}
        </div>

        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '24px', color: '#1A1A2E' }}>
          LEVEL {String(levelId).padStart(2, '0')}
        </div>

        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '12px', color: round.accentColor }}>
          {levelConfig.name}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < levelConfig.difficulty ? '#FFB830' : '#ccc', fontSize: '18px' }}>
              {i < levelConfig.difficulty ? '\u2605' : '\u2606'}
            </span>
          ))}
        </div>

        <div key={countdown} style={{
          fontFamily: "'Press Start 2P'", fontSize: countdown === 0 ? '36px' : '48px',
          color: countdown === 0 ? '#4CAF50' : '#FFB830',
          animation: 'countdownPop 800ms ease',
        }}>
          {countdown > 0 ? countdown : 'GO!'}
        </div>
      </div>
    );
  }

  // Complete screen
  if (state === 'complete') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
        background: 'var(--color-bg)', animation: 'fadeIn 300ms ease',
      }}>
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '20px', color: '#FFB830',
          animation: 'bounceSuccess 300ms ease',
          textShadow: '2px 2px 0px #1A1A2E',
        }}>
          LEVEL COMPLETE!
        </div>

        <PixelCard style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <StarRating rating={starRating} size="lg" />
          </div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '16px', color: '#FFB830', marginBottom: '8px' }}>
            {levelScore.toLocaleString()} PTS
          </div>
          <div style={{ fontFamily: "'Nunito'", fontSize: '13px', color: '#666', marginBottom: '4px' }}>
            Time: {levelTime}s | Accuracy: {Math.round(levelAccuracy * 100)}%
          </div>
          <div style={{ fontFamily: "'Nunito'", fontSize: '13px', color: '#4CAF50' }}>
            +{Math.floor(levelScore / 10)} XP
          </div>
        </PixelCard>

        {/* Crew unlock */}
        {unlockedCrew && (
          <PixelCard style={{
            maxWidth: '350px', width: '90%', textAlign: 'center',
            border: `3px solid ${unlockedCrew.colorScheme}`, animation: 'bounceSuccess 300ms ease 500ms both',
          }}>
            <div style={{
              width: '48px', height: '48px', margin: '0 auto 8px',
              background: unlockedCrew.colorScheme, border: '3px solid #1A1A2E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P'", fontSize: '16px', color: '#FFF',
            }}>
              {unlockedCrew.archetype[0]}
            </div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: unlockedCrew.colorScheme }}>
              {unlockedCrew.archetype}
            </div>
            <div style={{ fontFamily: "'Nunito'", fontSize: '12px', color: '#888', marginTop: '4px' }}>
              has joined your crew!
            </div>
          </PixelCard>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <PixelButton variant="primary" onClick={() => {
            if (levelId === 15) navigate('/victory');
            else navigate('/map');
          }}>
            {levelId === 15 ? 'VIEW RESULTS' : 'CONTINUE TO MAP'}
          </PixelButton>
        </div>
      </div>
    );
  }

  // Failed screen
  if (state === 'failed') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
        background: 'var(--color-bg)', animation: 'shakeFailure 400ms ease',
      }}>
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '20px', color: '#F48FB1',
        }}>
          TIME'S UP!
        </div>

        <PixelCard style={{ maxWidth: '350px', width: '90%', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Nunito'", fontSize: '14px', marginBottom: '12px' }}>
            Don't give up! Every great captain faces storms. Try again! \u26F5
          </p>
        </PixelCard>

        <div style={{ display: 'flex', gap: '12px' }}>
          <PixelButton variant="primary" onClick={handleRetry}>RETRY</PixelButton>
          <PixelButton variant="ghost" onClick={() => navigate('/map')}>BACK TO MAP</PixelButton>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      {/* Top bar */}
      <div style={{
        background: '#FFF8E7', borderBottom: '3px solid #1A1A2E',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 16px',
      }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', color: round.accentColor }}>
          {levelConfig.name}
        </div>
        <Timer
          totalSeconds={timeLimit}
          onTimeUp={handleTimeUp}
          isRunning={timerRunning}
          onTick={(r) => setTimeRemaining(r)}
        />
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '9px', color: '#FFB830',
          background: '#1A1A2E', padding: '4px 10px',
        }}>
          \u2605 {totalScore.toLocaleString()}
        </div>
      </div>

      {/* XP bar */}
      <XPBar currentXP={xp} maxXP={1000} />

      {/* Story text */}
      <div style={{
        padding: '6px 16px', borderBottom: `2px solid ${round.accentColor}30`,
        fontFamily: "'Nunito'", fontSize: '12px', color: '#666',
        fontStyle: 'italic', lineHeight: '1.5',
      }}>
        {levelConfig.story}
      </div>

      {/* Main puzzle area */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', overflow: 'auto',
      }}>
        {LevelComponent && (
          <LevelComponent
            onComplete={handleComplete}
            onFail={handleFail}
            timeLimit={timeLimit}
          />
        )}
      </div>

      {/* Bottom controls */}
      <div style={{
        background: '#FFF8E7', borderTop: '2px solid #1A1A2E',
        padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <PixelButton variant="ghost" size="sm" onClick={() => navigate('/map')}>
          QUIT
        </PixelButton>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#888' }}>
          HINTS: {hintsRemaining}
        </div>
      </div>
    </div>
  );
};
