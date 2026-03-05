import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PixelButton } from '../ui/PixelButton';

interface Level01Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

interface FallingLetter {
  id: number;
  letter: string;
  x: number;
  y: number;
  speed: number;
  active: boolean;
}

export const Level01StormTheKeyboard: React.FC<Level01Props> = ({ onComplete, onFail, timeLimit }) => {
  const [letters, setLetters] = useState<FallingLetter[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [typed, setTyped] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeUsed, setTimeUsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const frameRef = useRef<number>(0);
  const lastSpawn = useRef(Date.now());
  const startTime = useRef(Date.now());

  const containerHeight = 500;
  const containerWidth = 700;

  const spawnLetter = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = chars[Math.floor(Math.random() * chars.length)];
    const newLetter: FallingLetter = {
      id: nextId.current++,
      letter,
      x: Math.random() * (containerWidth - 60) + 30,
      y: -40,
      speed: 1.2 + wave * 0.5,
      active: true,
    };
    setLetters(prev => [...prev, newLetter]);
  }, [wave]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const loop = () => {
      const spawnInterval = Math.max(1200 - wave * 200, 400);
      const now = Date.now();
      if (now - lastSpawn.current > spawnInterval) {
        spawnLetter();
        lastSpawn.current = now;
      }

      setLetters(prev => {
        const updated = prev.map(l => ({
          ...l,
          y: l.active ? l.y + l.speed : l.y,
        }));

        // Check for missed letters
        const missed_now = updated.filter(l => l.active && l.y > containerHeight);
        if (missed_now.length > 0) {
          setMissed(m => m + missed_now.length);
          setLives(l => {
            const newLives = l - missed_now.length;
            if (newLives <= 0) setGameOver(true);
            return Math.max(newLives, 0);
          });
          setCombo(0);
        }

        return updated.filter(l => l.y <= containerHeight + 50).map(l =>
          missed_now.find(m => m.id === l.id) ? { ...l, active: false } : l
        );
      });

      setTimeUsed(Math.floor((Date.now() - startTime.current) / 1000));
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameOver, wave, spawnLetter]);

  // Wave progression
  useEffect(() => {
    if (typed > 0 && typed % 15 === 0 && wave < 4) {
      setWave(w => Math.min(w + 1, 4));
    }
  }, [typed]);

  // Auto-complete after enough typed
  useEffect(() => {
    if (typed >= 50 && !gameOver) {
      setGameOver(true);
      const accuracy = typed / Math.max(typed + missed, 1);
      onComplete(score, timeUsed, accuracy);
    }
  }, [typed]);

  // Handle game over
  useEffect(() => {
    if (gameOver && lives <= 0) {
      const accuracy = typed / Math.max(typed + missed, 1);
      if (typed > 10) {
        onComplete(score, timeUsed, accuracy);
      } else {
        onFail();
      }
    }
  }, [gameOver, lives]);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();
      if (key.length !== 1 || key < 'A' || key > 'Z') return;

      setLetters(prev => {
        const idx = prev.findIndex(l => l.active && l.letter === key);
        if (idx >= 0) {
          setTyped(t => t + 1);
          setCombo(c => {
            const newCombo = c + 1;
            const multiplier = 1 + Math.floor(newCombo / 3) * 0.5;
            setScore(s => s + Math.round(10 * multiplier));
            return newCombo;
          });
          return prev.map((l, i) => i === idx ? { ...l, active: false } : l);
        } else {
          setCombo(0);
          return prev;
        }
      });
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [gameOver]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* Stats bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', width: `${containerWidth}px`,
        fontFamily: "'Press Start 2P'", fontSize: '10px',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ color: i < lives ? '#FF6B6B' : '#ccc', fontSize: '16px' }}>
              {i < lives ? '\u2764' : '\uD83E\uDE76'}
            </span>
          ))}
        </div>
        <div style={{ color: '#FFB830' }}>WAVE {wave}/4</div>
        <div style={{ color: '#4CAF50' }}>{typed}/50</div>
      </div>

      {/* Combo display */}
      {combo >= 3 && (
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: `${14 + combo * 2}px`,
          color: combo >= 8 ? '#B39DDB' : combo >= 6 ? '#4ECDC4' : combo >= 4 ? '#FFB830' : '#FF6B6B',
          animation: 'bounceSuccess 200ms ease', textShadow: '2px 2px 0px #1A1A2E',
        }}>
          COMBO x{combo}!
        </div>
      )}

      {/* Game area */}
      <div
        ref={containerRef}
        style={{
          position: 'relative', width: `${containerWidth}px`, height: `${containerHeight}px`,
          background: 'linear-gradient(180deg, #1A1A2E 0%, #2D2D5E 100%)',
          border: '3px solid #1A1A2E', overflow: 'hidden',
        }}
      >
        {/* Stars background */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`,
            width: '2px', height: '2px', background: '#FFF',
            opacity: 0.3 + Math.random() * 0.4,
          }} />
        ))}

        {/* Falling letters */}
        {letters.filter(l => l.active).map(l => (
          <div
            key={l.id}
            style={{
              position: 'absolute', left: `${l.x}px`, top: `${l.y}px`,
              width: '40px', height: '40px',
              background: '#FFF8E7', border: '2px solid #1A1A2E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P'", fontSize: '16px', color: '#1A1A2E',
              boxShadow: '2px 2px 0px #1A1A2E',
              transition: 'opacity 200ms',
            }}
          >
            {l.letter}
          </div>
        ))}

        {/* Bottom danger zone */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
          background: '#FF6B6B',
        }} />
      </div>

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', color: '#888' }}>
        Type the letters as they fall! Build combos for bonus points.
      </div>
    </div>
  );
};
