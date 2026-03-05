import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level12Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

export const Level12HauntedLighthouse: React.FC<Level12Props> = ({ onComplete, onFail, timeLimit }) => {
  const [phase, setPhase] = useState<'choice' | 'fibonacci' | 'hanoi'>('choice');
  const [choiceTimer, setChoiceTimer] = useState(60);
  const [fibAnswers, setFibAnswers] = useState(['', '', '']);
  const [fibStack, setFibStack] = useState<string[]>(['', '', '', '']);
  const [hanoiMoves, setHanoiMoves] = useState('');
  const [hanoiStack, setHanoiStack] = useState<string[]>(['', '', '', '']);
  const [message, setMessage] = useState('');
  const startTime = useRef(Date.now());

  // Choice timer
  React.useEffect(() => {
    if (phase !== 'choice') return;
    const t = setInterval(() => {
      setChoiceTimer(prev => {
        if (prev <= 1) { setPhase('fibonacci'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const handleFibSubmit = () => {
    // Fibonacci: 1, 1, 2, 3, 5, 8, ? -> 13, 21, 34
    const correct = fibAnswers[0] === '13' && fibAnswers[1] === '21' && fibAnswers[2] === '34';
    // Call stack: fib(7) -> fib(6) + fib(5)
    const stackCorrect = fibStack[0].toLowerCase().includes('fib(6)') || fibStack[0].includes('fib(5)');

    if (correct) {
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = correct ? (stackCorrect ? 1.0 : 0.7) : 0.4;
      onComplete(500, timeUsed, accuracy);
    } else {
      setMessage('Not quite! Check the Fibonacci sequence again.');
    }
  };

  const handleHanoiSubmit = () => {
    // Tower of Hanoi n=4: minimum moves = 2^4 - 1 = 15
    const correct = hanoiMoves === '15';

    if (correct) {
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      onComplete(500, timeUsed, 0.9);
    } else {
      setMessage('Not quite! Remember: minimum moves for n disks = 2^n - 1');
    }
  };

  if (phase === 'choice') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FFB830' }}>
          \uD83D\uDD12 BOSS: CHOOSE YOUR CHALLENGE
        </div>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '16px', color: choiceTimer <= 10 ? '#FF6B6B' : '#1A1A2E' }}>
          {choiceTimer}s
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <PixelCard onClick={() => setPhase('fibonacci')} style={{ maxWidth: '280px', cursor: 'pointer' }}>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#42A5F5', marginBottom: '8px' }}>
              OPTION A: FIBONACCI
            </div>
            <p style={{ fontFamily: "'Nunito'", fontSize: '13px', marginBottom: '12px' }}>
              Predict the next 3 numbers in the Fibonacci sequence and trace the call stack.
            </p>
            <PixelButton variant="primary" size="md" onClick={() => setPhase('fibonacci')}>
              CHOOSE THIS
            </PixelButton>
          </PixelCard>

          <PixelCard onClick={() => setPhase('hanoi')} style={{ maxWidth: '280px', cursor: 'pointer' }}>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#AB47BC', marginBottom: '8px' }}>
              OPTION B: TOWER OF HANOI
            </div>
            <p style={{ fontFamily: "'Nunito'", fontSize: '13px', marginBottom: '12px' }}>
              Calculate minimum moves for 4 disks and trace the recursive decomposition.
            </p>
            <PixelButton variant="primary" size="md" onClick={() => setPhase('hanoi')}>
              CHOOSE THIS
            </PixelButton>
          </PixelCard>
        </div>
      </div>
    );
  }

  if (phase === 'fibonacci') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#42A5F5' }}>
          FIBONACCI SEQUENCE
        </div>

        <PixelCard style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Fira Code'", fontSize: '20px', letterSpacing: '8px', marginBottom: '16px' }}>
            1, 1, 2, 3, 5, 8, <span style={{ color: '#FFB830' }}>?, ?, ?</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                value={fibAnswers[i]}
                onChange={e => {
                  const newA = [...fibAnswers];
                  newA[i] = e.target.value;
                  setFibAnswers(newA);
                }}
                placeholder={`#${i + 7}`}
                style={{
                  width: '80px', padding: '8px', fontFamily: "'Fira Code'", fontSize: '18px',
                  border: '3px solid #1A1A2E', textAlign: 'center',
                }}
              />
            ))}
          </div>
        </PixelCard>

        <PixelCard variant="code" style={{ width: '100%' }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '8px' }}>
            CALL STACK TRACE: fib(7)
          </div>
          <div style={{ fontFamily: "'Fira Code'", fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            fib(7) calls which two sub-problems?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {fibStack.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: "'Fira Code'", fontSize: '10px', color: '#888', width: '70px' }}>
                  Level {i + 1}:
                </span>
                <input
                  value={s}
                  onChange={e => {
                    const newS = [...fibStack];
                    newS[i] = e.target.value;
                    setFibStack(newS);
                  }}
                  placeholder={i === 0 ? 'fib(?) + fib(?)' : 'sub-calls...'}
                  style={{
                    flex: 1, padding: '4px 8px', fontFamily: "'Fira Code'", fontSize: '12px',
                    border: '2px solid #B39DDB', background: '#F5F5F5',
                  }}
                />
              </div>
            ))}
          </div>
        </PixelCard>

        <PixelButton variant="primary" size="lg" onClick={handleFibSubmit}>SUBMIT ANSWER</PixelButton>
        {message && <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', color: '#FF6B6B' }}>{message}</div>}
      </div>
    );
  }

  // Hanoi
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#AB47BC' }}>
        TOWER OF HANOI (n=4)
      </div>

      <PixelCard style={{ width: '100%', textAlign: 'center' }}>
        {/* Visual tower */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '16px' }}>
          {['A', 'B', 'C'].map(peg => (
            <div key={peg} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '4px', height: '80px', background: '#5D4037' }} />
              <div style={{ width: '80px', height: '6px', background: '#5D4037' }} />
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginTop: '4px' }}>{peg}</div>
            </div>
          ))}
        </div>
        {/* Show disks on peg A */}
        {[4, 3, 2, 1].map(disk => (
          <div key={`disk-${disk}`} style={{
            width: `${20 + disk * 15}px`, height: '10px',
            background: ['#FF6B6B', '#FFB830', '#42A5F5', '#4CAF50'][disk - 1],
            margin: '2px auto', border: '1px solid #1A1A2E',
          }} />
        ))}

        <div style={{ fontFamily: "'Fira Code'", fontSize: '14px', marginTop: '12px' }}>
          Move all 4 disks from peg A to peg C.
        </div>
        <div style={{ fontFamily: "'Nunito'", fontSize: '13px', color: '#666', marginTop: '4px' }}>
          What is the MINIMUM number of moves required?
        </div>
        <input
          value={hanoiMoves}
          onChange={e => setHanoiMoves(e.target.value)}
          placeholder="Enter number..."
          style={{
            marginTop: '12px', padding: '8px', fontFamily: "'Fira Code'", fontSize: '18px',
            border: '3px solid #1A1A2E', textAlign: 'center', width: '120px',
          }}
        />
      </PixelCard>

      <PixelCard variant="code" style={{ width: '100%' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '8px' }}>
          RECURSIVE DECOMPOSITION
        </div>
        <div style={{ fontFamily: "'Fira Code'", fontSize: '11px', color: '#666', marginBottom: '8px' }}>
          hanoi(4, A, C, B) breaks down into:
        </div>
        {hanoiStack.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontFamily: "'Fira Code'", fontSize: '10px', color: '#888', width: '60px' }}>Step {i + 1}:</span>
            <input
              value={s}
              onChange={e => { const n = [...hanoiStack]; n[i] = e.target.value; setHanoiStack(n); }}
              placeholder="hanoi(?, ?, ?, ?)"
              style={{ flex: 1, padding: '4px 8px', fontFamily: "'Fira Code'", fontSize: '11px', border: '2px solid #B39DDB', background: '#F5F5F5' }}
            />
          </div>
        ))}
      </PixelCard>

      <PixelButton variant="primary" size="lg" onClick={handleHanoiSubmit}>SUBMIT ANSWER</PixelButton>
      {message && <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', color: '#FF6B6B' }}>{message}</div>}
    </div>
  );
};
