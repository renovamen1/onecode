import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level07Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

const puzzleRounds = [
  { binary: '01001000', answer: '72', hint: 'Convert this 8-bit binary to decimal', type: 'decimal' },
  { binary: '01001000', answer: 'H', hint: 'What ASCII character is decimal 72?', type: 'ascii' },
  { binary: '01001000 01001001', answer: 'HI', hint: 'Decode two bytes to ASCII text', type: 'text' },
  { binary: '01000011 01001111 01000100 01000101', answer: 'CODE', hint: 'Decode four bytes to ASCII text', type: 'text' },
  { binary: '01001000 01000101 01001100 01001100 01001111', answer: 'HELLO', hint: 'Decode the full transmission', type: 'text' },
];

const asciiTable = [
  ...Array.from({ length: 26 }, (_, i) => ({ char: String.fromCharCode(65 + i), dec: 65 + i, bin: (65 + i).toString(2).padStart(8, '0') })),
  ...Array.from({ length: 26 }, (_, i) => ({ char: String.fromCharCode(97 + i), dec: 97 + i, bin: (97 + i).toString(2).padStart(8, '0') })),
  ...Array.from({ length: 10 }, (_, i) => ({ char: String.fromCharCode(48 + i), dec: 48 + i, bin: (48 + i).toString(2).padStart(8, '0') })),
  { char: 'SPACE', dec: 32, bin: '00100000' },
  { char: '!', dec: 33, bin: '00100001' },
  { char: '?', dec: 63, bin: '00111111' },
];

export const Level07SignalInTheStatic: React.FC<Level07Props> = ({ onComplete, onFail, timeLimit }) => {
  const [round, setRound] = useState(0);
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const correctRef = useRef(0);
  const [showStatic, setShowStatic] = useState(true);
  const [feedback, setFeedback] = useState('');
  const startTime = useRef(Date.now());

  const puzzle = puzzleRounds[round];

  React.useEffect(() => {
    setShowStatic(true);
    const t = setTimeout(() => setShowStatic(false), 800);
    return () => clearTimeout(t);
  }, [round]);

  const handleSubmit = () => {
    const isCorrect = input.toUpperCase().trim() === puzzle.answer.toUpperCase();
    if (isCorrect) {
      // increment both ref and state so future closures have updated value
      correctRef.current += 1;
      setCorrect(correctRef.current);
      setFeedback('SIGNAL DECODED!');
      setTimeout(() => {
        if (round < puzzleRounds.length - 1) {
          setRound(r => r + 1);
          setInput('');
          setFeedback('');
        } else {
          const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
          const accuracy = correctRef.current / puzzleRounds.length;
          onComplete(100, timeUsed, accuracy);
        }
      }, 1000);
    } else {
      setFeedback('SIGNAL CORRUPTED - TRY AGAIN');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Left panel: 65% - Puzzle area */}
      <div style={{ flex: '0 0 65%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', display: 'flex', justifyContent: 'space-between' }}>
          <span>ROUND {round + 1}/{puzzleRounds.length}</span>
          <span style={{ color: '#4CAF50' }}>DECODED: {correct}</span>
        </div>

        {/* Oscilloscope */}
        <PixelCard variant="code" style={{
          background: '#0D0D0D', padding: '20px', minHeight: '120px',
          border: '3px solid #4CAF50', position: 'relative', overflow: 'hidden',
        }}>
          {/* Scanlines */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #4CAF50 2px, #4CAF50 4px)',
          }} />

          {showStatic ? (
            <div style={{
              fontFamily: "'Fira Code'", fontSize: '14px', color: '#4CAF50',
              textAlign: 'center', animation: 'shakeFailure 100ms infinite',
            }}>
              {'$#@!%&*!@#$%^&*'.split('').map((c, i) => (
                <span key={i} style={{ opacity: Math.random() }}>{c}</span>
              ))}
              <br />INCOMING SIGNAL...
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: "'Fira Code'", fontSize: '16px', color: '#4CAF50', letterSpacing: '2px', marginBottom: '12px' }}>
                {puzzle.binary}
              </div>
              <div style={{ fontFamily: "'Nunito'", fontSize: '12px', color: '#888' }}>
                {puzzle.hint}
              </div>
            </div>
          )}
        </PixelCard>

        {/* Input area */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={puzzle.type === 'decimal' ? 'Enter decimal...' : 'Enter text...'}
            style={{
              flex: 1, fontFamily: "'Fira Code'", fontSize: '16px', padding: '10px',
              background: '#0D0D0D', color: '#4CAF50', border: '2px solid #4CAF50',
              outline: 'none', textTransform: 'uppercase',
            }}
          />
          <PixelButton variant="success" size="md" onClick={handleSubmit}>DECODE</PixelButton>
        </div>

        {feedback && (
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: '10px',
            color: feedback.includes('DECODED') ? '#4CAF50' : '#FF6B6B',
            animation: feedback.includes('DECODED') ? 'bounceSuccess 300ms ease' : 'shakeFailure 400ms ease',
          }}>
            {feedback}
          </div>
        )}
      </div>

      {/* Right panel: 35% - ASCII reference */}
      <div style={{ flex: '0 0 35%' }}>
        <PixelCard variant="info" style={{
          maxHeight: '450px', overflow: 'auto', padding: '8px',
          border: '3px solid #4ECDC4',
        }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '8px', color: '#4ECDC4' }}>
            ASCII REFERENCE
          </div>
          <table style={{ width: '100%', fontSize: '11px', fontFamily: "'Fira Code'", borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '2px 4px', textAlign: 'left' }}>Char</th>
                <th style={{ padding: '2px 4px', textAlign: 'left' }}>Dec</th>
                <th style={{ padding: '2px 4px', textAlign: 'left' }}>Binary</th>
              </tr>
            </thead>
            <tbody>
              {asciiTable.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1px 4px', fontWeight: 700 }}>{row.char}</td>
                  <td style={{ padding: '1px 4px', color: '#666' }}>{row.dec}</td>
                  <td style={{ padding: '1px 4px', color: '#4ECDC4', fontSize: '10px' }}>{row.bin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PixelCard>
      </div>
    </div>
  );
};
