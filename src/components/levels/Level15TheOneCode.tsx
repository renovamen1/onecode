import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level15Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

// Multiple possible puzzles - can be swapped for each event
const puzzles = [
  {
    code: `def mystery(n):
    if n <= 1:
        return n
    return mystery(n - 1) + mystery(n - 2)

print(mystery(7))`,
    answer: '13',
    hint1: 'Trace the recursive calls on paper.',
    hint2: 'The base case returns n itself.',
  },
  {
    code: `def solve(n):
    if n == 0:
        return 1
    if n == 1:
        return 1
    return solve(n - 1) + solve(n - 2) + solve(n - 3) if n >= 3 else solve(n - 1) + solve(n - 2)

print(solve(5))`,
    answer: '15',
    hint1: 'Build a table: solve(0)=1, solve(1)=1, solve(2)=2...',
    hint2: 'solve(3) = solve(2) + solve(1) + solve(0) = 4',
  },
  {
    code: `def compute(a, b):
    if b == 0:
        return a
    return compute(b, a % b)

print(compute(48, 18))`,
    answer: '6',
    hint1: 'This implements a well-known algorithm.',
    hint2: 'compute(48,18) -> compute(18, 48%18=12) -> ...',
  },
];

export const Level15TheOneCode: React.FC<Level15Props> = ({ onComplete, onFail, timeLimit }) => {
  const [puzzleIdx] = useState(0); // Can be randomized for events
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [solved, setSolved] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const startTime = useRef(Date.now());

  const puzzle = puzzles[puzzleIdx];

  const handleSubmit = () => {
    if (!input.trim()) return;
    setAttempts(a => a + 1);

    if (input.trim() === puzzle.answer) {
      setSolved(true);
      setMessage('');

      // Trigger victory sequence
      setTimeout(() => setShowVictory(true), 500);

      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = attempts === 0 ? 1 : Math.max(0.5, 1 - attempts * 0.1);
      setTimeout(() => onComplete(1000, timeUsed, accuracy), 3500);
    } else {
      setMessage('The vault remains sealed...');
    }
  };

  if (showVictory) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        background: 'rgba(26,26,46,0.95)', animation: 'fadeIn 500ms ease',
      }}>
        {/* Gold burst */}
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(255,184,48,0.4) 0%, transparent 70%)',
          animation: 'goldBurst 2s ease-out forwards',
        }} />

        {/* Chest */}
        <div style={{
          width: '120px', height: '80px', background: '#5D4037',
          border: '4px solid #FFB830', position: 'relative',
          boxShadow: '0 0 40px rgba(255,184,48,0.5)',
          animation: 'bounceSuccess 300ms ease 500ms both',
        }}>
          {/* Chest lid opening */}
          <div style={{
            position: 'absolute', top: '-30px', left: '-4px', right: '-4px',
            height: '30px', background: '#795548', border: '4px solid #FFB830',
            transformOrigin: 'bottom center',
            animation: 'chestOpen 600ms ease 800ms both',
          }} />
          {/* Gold glow from inside */}
          <div style={{
            position: 'absolute', top: '-20px', left: '20%', right: '20%',
            height: '60px', background: 'linear-gradient(0deg, transparent, #FFB830)',
            opacity: 0, animation: 'fadeIn 500ms ease 1200ms both',
          }} />
        </div>

        {/* Light beams */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: '4px', height: '0px',
            background: 'linear-gradient(0deg, #FFB830, transparent)',
            transform: `rotate(${i * 45}deg)`,
            transformOrigin: 'bottom center',
            animation: `fadeIn 400ms ease ${1400 + i * 100}ms both`,
            opacity: 0.6,
          }}>
            <div style={{
              width: '4px', height: '200px', background: 'linear-gradient(0deg, #FFB830, transparent)',
              animation: `fadeIn 600ms ease ${1400 + i * 100}ms both`,
            }} />
          </div>
        ))}

        {/* Text */}
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '20px', color: '#FFB830',
          marginTop: '40px', textShadow: '0 0 20px rgba(255,184,48,0.5)',
          animation: 'bounceSuccess 300ms ease 1800ms both', opacity: 0,
          textAlign: 'center',
        }}>
          \u2605 VAULT UNLOCKED \u2605
        </div>

        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '12px', color: '#FF6B6B',
          marginTop: '16px', animation: 'fadeIn 500ms ease 2200ms both', opacity: 0,
        }}>
          Hello, King of the Grand Line!
        </div>

        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FFB830',
          marginTop: '12px', animation: 'pulse 1.5s infinite 2600ms',
          opacity: 0,
        }}>
          BOUNTY STATUS: \u221E INFINITE
        </div>

        {/* Sparkle particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            width: '4px', height: '4px', background: '#FFB830',
            animation: `sparkle ${1 + Math.random()}s ease ${Math.random() * 2}s infinite`,
          }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '12px', color: '#FFB830', textAlign: 'center' }}>
        \uD83D\uDD12 FINAL BOSS: THE ONE CODE
      </div>

      <div style={{
        fontFamily: "'Nunito'", fontSize: '14px', fontStyle: 'italic', color: '#888',
        textAlign: 'center',
      }}>
        "Only the one who can read the mind of the machine may open this."
      </div>

      {/* Code display */}
      <PixelCard variant="code" style={{
        width: '100%',
        border: '3px solid #FFB830',
        boxShadow: solved ? '0 0 30px rgba(255,184,48,0.3)' : '4px 4px 0px #1A1A2E',
        animation: 'glow 3s ease infinite',
        position: 'relative',
      }}>
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)',
          pointerEvents: 'none',
        }} />

        <pre style={{
          fontFamily: "'Fira Code'", fontSize: '14px', lineHeight: '1.7',
          color: '#1A1A2E', whiteSpace: 'pre-wrap',
        }}>
          {puzzle.code}
        </pre>
      </PixelCard>

      {/* Terminal input */}
      <div style={{
        width: '100%', background: '#0D0D0D', border: '3px solid #4CAF50',
        padding: '12px', display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontFamily: "'Fira Code'", color: '#4CAF50', fontSize: '14px' }}>{'>'}</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter the output value..."
          autoFocus
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: "'Fira Code'", fontSize: '16px', color: '#4CAF50',
          }}
        />
        <PixelButton variant="success" size="sm" onClick={handleSubmit}>
          EXECUTE
        </PixelButton>
      </div>

      {message && (
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FF6B6B',
          animation: 'shakeFailure 400ms ease', textAlign: 'center',
        }}>
          {message}
        </div>
      )}

      {attempts > 0 && (
        <div style={{ fontFamily: "'Nunito'", fontSize: '11px', color: '#888' }}>
          Attempts: {attempts} | No hints available for the final challenge.
        </div>
      )}
    </div>
  );
};
