import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level14Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

const slowCode = `def has_duplicate(arr):
    """Check if array has duplicates - O(n^2)"""
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False`;

const options = [
  {
    label: 'A',
    code: `def has_duplicate(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            if i != j and arr[i] == arr[j]:
                return True
    return False`,
    complexity: 'O(n\u00B2)',
    correct: false,
    explanation: 'Still O(n\u00B2) - just a slight refactor with the same nested loops.',
  },
  {
    label: 'B',
    code: `def has_duplicate(arr):
    seen = set()
    for item in arr:
        if item in seen:
            return True
        seen.add(item)
    return False`,
    complexity: 'O(n)',
    correct: true,
    explanation: 'Uses a HashSet for O(1) lookups. Single pass = O(n) total. Optimal!',
  },
  {
    label: 'C',
    code: `def has_duplicate(arr):
    arr.sort()
    for i in range(len(arr) - 1):
        if arr[i] == arr[i + 1]:
            return True
    return False`,
    complexity: 'O(n log n)',
    correct: false,
    explanation: 'Better than O(n\u00B2), but sorting makes it O(n log n). Not optimal.',
  },
  {
    label: 'D',
    code: `def has_duplicate(arr):
    return list(map(
        lambda x: arr.count(x) > 1,
        arr
    )).count(True) > 0`,
    complexity: 'O(n\u00B2)',
    correct: false,
    explanation: '.count() is O(n) called n times = still O(n\u00B2). Functional style doesn\'t help here.',
  },
];

export const Level14IceWall: React.FC<Level14Props> = ({ onComplete, onFail, timeLimit }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [cracked, setCracked] = useState(false);
  const [glacierGrow, setGlacierGrow] = useState(0);
  const [message, setMessage] = useState('');
  const startTime = useRef(Date.now());

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setAttempts(a => a + 1);

    if (options[idx].correct) {
      setCracked(true);
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = attempts === 0 ? 1 : attempts === 1 ? 0.5 : 0.25;
      setMessage('THE ICE WALL SHATTERS!');
      setTimeout(() => onComplete(500, timeUsed, accuracy), 2000);
    } else {
      setGlacierGrow(g => g + 1);
      setMessage(`Wrong! ${options[idx].explanation}`);
      setSelected(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Ice wall visualization */}
      <div style={{
        width: '100%', height: '80px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #B3E5FC 0%, #4FC3F7 30%, #0288D1 100%)',
        border: '3px solid #01579B',
        transition: 'height 500ms ease',
      }}>
        {/* Icicles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0,
            left: `${i * 8.3}%`,
            width: 0, height: 0,
            borderLeft: `${10 + Math.random() * 10}px solid transparent`,
            borderRight: `${10 + Math.random() * 10}px solid transparent`,
            borderTop: `${30 + glacierGrow * 10 + Math.random() * 20}px solid #E1F5FE`,
          }} />
        ))}

        {cracked && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'transparent',
            animation: 'shakeFailure 300ms ease',
          }}>
            {/* Crack lines */}
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                position: 'absolute',
                left: `${15 + i * 15}%`, top: '0',
                width: '2px', height: '100%',
                background: '#FFF',
                transform: `rotate(${-15 + Math.random() * 30}deg)`,
                animation: `fadeIn ${200 + i * 100}ms ease both`,
              }} />
            ))}
          </div>
        )}

        <div style={{
          position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FFF',
          textShadow: '1px 1px 2px #01579B',
        }}>
          {cracked ? '\uD83D\uDCA5 CRACKED!' : `Estimated runtime: ${47 + glacierGrow * 12} years`}
        </div>
      </div>

      {/* Slow code display */}
      <PixelCard variant="code" style={{ width: '100%', border: '3px solid #B39DDB' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#FF6B6B', marginBottom: '8px' }}>
          \u26A0 SLOW CODE: O(n\u00B2)
        </div>
        <pre style={{
          fontFamily: "'Fira Code'", fontSize: '12px', color: '#1A1A2E',
          whiteSpace: 'pre-wrap', lineHeight: '1.6',
        }}>
          {slowCode}
        </pre>
      </PixelCard>

      {/* Optimization options */}
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', color: '#42A5F5' }}>
        CHOOSE THE OPTIMAL SOLUTION:
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
        {options.map((opt, i) => (
          <PixelCard
            key={i}
            variant="code"
            onClick={cracked ? undefined : () => handleSelect(i)}
            style={{
              cursor: cracked ? 'default' : 'pointer',
              border: selected === i
                ? opt.correct ? '3px solid #4CAF50' : '3px solid #FF6B6B'
                : '3px solid #B39DDB',
              opacity: cracked && !opt.correct ? 0.5 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: '10px' }}>Option {opt.label}</span>
              <span style={{
                fontFamily: "'Fira Code'", fontSize: '10px',
                color: opt.complexity === 'O(n)' ? '#4CAF50' : '#FF8A65',
              }}>
                {opt.complexity}
              </span>
            </div>
            <pre style={{
              fontFamily: "'Fira Code'", fontSize: '10px', whiteSpace: 'pre-wrap',
              lineHeight: '1.4', color: '#333',
            }}>
              {opt.code}
            </pre>
          </PixelCard>
        ))}
      </div>

      {message && (
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '10px',
          color: cracked ? '#4CAF50' : '#FF6B6B',
          animation: cracked ? 'bounceSuccess 300ms ease' : 'shakeFailure 400ms ease',
          textAlign: 'center', maxWidth: '600px',
        }}>
          {message}
        </div>
      )}
    </div>
  );
};
