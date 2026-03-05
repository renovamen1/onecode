import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level13Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

const buggyCode = [
  { line: 1, code: 'def process_scores(scores):', hasBug: false },
  { line: 2, code: '    total = 0', hasBug: false },
  { line: 3, code: '    for i in range(1, len(scores)):', hasBug: true, bugType: 'off-by-one',
    fixes: [
      { text: 'for i in range(0, len(scores)):', correct: true },
      { text: 'for i in range(1, len(scores) + 1):', correct: false },
      { text: 'for i in range(len(scores), 0, -1):', correct: false },
      { text: 'for i in range(1, len(scores) - 1):', correct: false },
    ]
  },
  { line: 4, code: '        total += scores[i]', hasBug: false },
  { line: 5, code: '    average = total / len(scores)', hasBug: false },
  { line: 6, code: '    max_val = scores[len(scores)]', hasBug: true, bugType: 'IndexError',
    fixes: [
      { text: 'max_val = scores[len(scores) - 1]', correct: true },
      { text: 'max_val = scores[len(scores) + 1]', correct: false },
      { text: 'max_val = scores[-2]', correct: false },
      { text: 'max_val = scores[0]', correct: false },
    ]
  },
  { line: 7, code: '    result = average + max_val', hasBug: false },
  { line: 8, code: '    print(sum_val)', hasBug: true, bugType: 'NameError',
    fixes: [
      { text: 'print(result)', correct: true },
      { text: 'print(total)', correct: false },
      { text: 'print(average)', correct: false },
      { text: 'print(max_val)', correct: false },
    ]
  },
  { line: 9, code: '    return result', hasBug: false },
];

export const Level13CorruptedSystem: React.FC<Level13Props> = ({ onComplete, onFail, timeLimit }) => {
  const [fixedLines, setFixedLines] = useState<Record<number, string>>({});
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [bugsFixed, setBugsFixed] = useState(0);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [message, setMessage] = useState('');
  const [systemOnline, setSystemOnline] = useState(false);
  const startTime = useRef(Date.now());

  const handleLineFix = (lineNum: number, fix: { text: string; correct: boolean }) => {
    const newAttempts = { ...attempts, [lineNum]: (attempts[lineNum] || 0) + 1 };
    setAttempts(newAttempts);

    if (fix.correct) {
      setFixedLines(prev => ({ ...prev, [lineNum]: fix.text }));
      setBugsFixed(b => {
        const newCount = b + 1;
        if (newAttempts[lineNum] === 1) setFirstAttemptCorrect(f => f + 1);
        if (newCount >= 3) {
          setSystemOnline(true);
          const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
          const accuracy = (firstAttemptCorrect + (newAttempts[lineNum] === 1 ? 1 : 0)) / 3;
          setTimeout(() => onComplete(500, timeUsed, accuracy), 2000);
        }
        return newCount;
      });
      setActiveLine(null);
      setMessage('Bug fixed!');
    } else {
      setMessage('Wrong fix! Try another option.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '20px', fontFamily: "'Press Start 2P'", fontSize: '9px' }}>
        <span style={{ color: '#FF6B6B' }}>BUGS FOUND: {bugsFixed}/3</span>
        <span style={{ color: systemOnline ? '#4CAF50' : '#888' }}>
          SYSTEM: {systemOnline ? 'ONLINE' : 'CORRUPTED'}
        </span>
      </div>

      {/* Code panel */}
      <PixelCard variant="code" style={{
        width: '100%', padding: '0',
        border: '3px solid #B39DDB',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)',
          pointerEvents: 'none',
        }} />

        {buggyCode.map(line => {
          const isFixed = fixedLines[line.line] !== undefined;
          const isBuggy = line.hasBug && !isFixed;
          const isActive = activeLine === line.line;

          return (
            <div key={line.line}>
              <div
                onClick={() => isBuggy ? setActiveLine(isActive ? null : line.line) : null}
                style={{
                  display: 'flex', padding: '2px 12px',
                  background: isFixed ? '#E8F5E9' : isBuggy && isActive ? '#FFE0E0' : 'transparent',
                  cursor: isBuggy ? 'pointer' : 'default',
                  borderLeft: isBuggy ? '3px solid #FF6B6B' : isFixed ? '3px solid #4CAF50' : '3px solid transparent',
                  transition: 'background 200ms',
                }}
              >
                <span style={{
                  fontFamily: "'Fira Code'", fontSize: '11px', color: '#888',
                  width: '30px', textAlign: 'right', marginRight: '12px',
                  userSelect: 'none',
                }}>
                  {line.line}
                </span>
                <span style={{
                  fontFamily: "'Fira Code'", fontSize: '13px',
                  color: isFixed ? '#2E7D32' : '#1A1A2E',
                  textDecoration: isFixed ? 'none' : isBuggy ? 'underline wavy #FF6B6B' : 'none',
                }}>
                  {isFixed ? `    ${fixedLines[line.line]}` : line.code}
                </span>
                {isBuggy && (
                  <span style={{ marginLeft: '8px', fontSize: '10px' }}>\uD83D\uDC1B</span>
                )}
                {isFixed && (
                  <span style={{ marginLeft: '8px', fontSize: '10px' }}>\u2705</span>
                )}
              </div>

              {/* Fix options */}
              {isActive && line.fixes && (
                <div style={{
                  padding: '8px 12px 8px 54px', background: '#FFF3E0',
                  borderTop: '1px dashed #FFB830', borderBottom: '1px dashed #FFB830',
                }}>
                  <div style={{ fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#FF8A65', marginBottom: '6px' }}>
                    SELECT FIX FOR: {line.bugType}
                  </div>
                  {line.fixes.map((fix, i) => (
                    <div
                      key={i}
                      onClick={() => handleLineFix(line.line, fix)}
                      style={{
                        padding: '4px 8px', margin: '2px 0', cursor: 'pointer',
                        fontFamily: "'Fira Code'", fontSize: '12px',
                        background: '#FFF', border: '1px solid #ccc',
                        transition: 'background 100ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#E3F2FD')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#FFF')}
                    >
                      {String.fromCharCode(65 + i)}) {fix.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </PixelCard>

      {/* System coming online animation */}
      {systemOnline && (
        <PixelCard variant="code" style={{
          width: '100%', background: '#0D0D0D', color: '#4CAF50',
          fontFamily: "'Fira Code'", fontSize: '12px',
          animation: 'fadeIn 500ms ease',
        }}>
          <div style={{ marginBottom: '4px' }}>{'>'} System check... OK</div>
          <div style={{ marginBottom: '4px' }}>{'>'} All bugs patched... OK</div>
          <div style={{ marginBottom: '4px' }}>{'>'} Recompiling... OK</div>
          <div style={{ color: '#FFB830', animation: 'pulse 1s infinite' }}>{'>'} SYSTEM ONLINE \u2588</div>
        </PixelCard>
      )}

      {message && (
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '9px',
          color: message.includes('fixed') ? '#4CAF50' : '#FF6B6B',
          animation: message.includes('fixed') ? 'bounceSuccess 300ms ease' : 'shakeFailure 400ms ease',
        }}>
          {message}
        </div>
      )}

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#888', textAlign: 'center' }}>
        Click on buggy lines (\uD83D\uDC1B) to see fix options. Find and fix all 3 bugs!
      </div>
    </div>
  );
};
