import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level03Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

const grids = [
  {
    size: 5,
    clues: [
      { dir: 'across', num: 1, clue: 'Base-2 number system', answer: 'BINARY', row: 0, col: 0 },
      { dir: 'down', num: 2, clue: 'LIFO data structure', answer: 'STACK', row: 0, col: 2 },
      { dir: 'across', num: 3, clue: 'Smallest unit of data', answer: 'BIT', row: 2, col: 0 },
      { dir: 'down', num: 4, clue: 'Element in a linked list', answer: 'NODE', row: 1, col: 4 },
    ],
  },
  {
    size: 5,
    clues: [
      { dir: 'across', num: 1, clue: 'FIFO data structure', answer: 'QUEUE', row: 0, col: 0 },
      { dir: 'down', num: 2, clue: 'Repetition construct', answer: 'LOOP', row: 0, col: 2 },
      { dir: 'across', num: 3, clue: 'Indexed collection', answer: 'ARRAY', row: 2, col: 0 },
      { dir: 'down', num: 4, clue: 'Key-value lookup function', answer: 'HASH', row: 1, col: 4 },
    ],
  },
  {
    size: 5,
    clues: [
      { dir: 'across', num: 1, clue: 'Boolean reasoning system', answer: 'LOGIC', row: 0, col: 0 },
      { dir: 'down', num: 2, clue: 'Analyze syntax', answer: 'PARSE', row: 0, col: 2 },
      { dir: 'across', num: 3, clue: 'Lexical unit', answer: 'TOKEN', row: 2, col: 0 },
      { dir: 'down', num: 4, clue: 'Hierarchical data structure', answer: 'TREE', row: 1, col: 4 },
    ],
  },
];

export const Level03CipherCrosswords: React.FC<Level03Props> = ({ onComplete, onFail, timeLimit }) => {
  const [activeGrid, setActiveGrid] = useState(0);
  const [answers, setAnswers] = useState<string[][][]>(
    grids.map(g => Array.from({ length: g.size }, () => Array(g.size).fill('')))
  );
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [finalCode, setFinalCode] = useState('');
  const [allSolved, setAllSolved] = useState([false, false, false]);
  const [showFinal, setShowFinal] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const startTime = useRef(Date.now());

  const checkGrid = (gridIdx: number) => {
    const grid = grids[gridIdx];
    let correct = true;
    grid.clues.forEach(clue => {
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.dir === 'across' ? clue.row : clue.row + i;
        const c = clue.dir === 'across' ? clue.col + i : clue.col;
        if (r < grid.size && c < grid.size) {
          if (answers[gridIdx][r][c].toUpperCase() !== clue.answer[i]) correct = false;
        }
      }
    });
    return correct;
  };

  const handleCellChange = (gridIdx: number, row: number, col: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[gridIdx] = newAnswers[gridIdx].map(r => [...r]);
    newAnswers[gridIdx][row][col] = value.toUpperCase().slice(0, 1);
    setAnswers(newAnswers);
  };

  const handleCheckGrid = () => {
    if (checkGrid(activeGrid)) {
      const newSolved = [...allSolved];
      newSolved[activeGrid] = true;
      setAllSolved(newSolved);
      if (newSolved.every(Boolean)) setShowFinal(true);
      else if (activeGrid < 2) setActiveGrid(activeGrid + 1);
    }
  };

  const handleFinalSubmit = () => {
    setAttempts(a => a + 1);
    // The "code" is first letters of first across clues: B, Q, L = "BQL" mapped to numbers
    const expectedCode = '21712';
    if (finalCode === expectedCode) {
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = attempts === 0 ? 1 : attempts === 1 ? 0.8 : 0.6;
      onComplete(100, timeUsed, accuracy);
    }
  };

  const grid = grids[activeGrid];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      {/* Grid tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <PixelButton
            key={i}
            variant={i === activeGrid ? 'primary' : allSolved[i] ? 'success' : 'ghost'}
            size="sm"
            onClick={() => setActiveGrid(i)}
          >
            GRID {i + 1} {allSolved[i] ? '\u2713' : ''}
          </PixelButton>
        ))}
      </div>

      {!showFinal ? (
        <>
          {/* Crossword grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${grid.size}, 36px)`,
            gap: '2px',
            background: '#1A1A2E',
            padding: '2px',
          }}>
            {Array.from({ length: grid.size }).map((_, r) =>
              Array.from({ length: grid.size }).map((_, c) => {
                const hasClue = grid.clues.some(cl => {
                  for (let i = 0; i < cl.answer.length; i++) {
                    const cr = cl.dir === 'across' ? cl.row : cl.row + i;
                    const cc = cl.dir === 'across' ? cl.col + i : cl.col;
                    if (cr === r && cc === c) return true;
                  }
                  return false;
                });

                if (!hasClue) {
                  return <div key={`${r},${c}`} style={{ width: 36, height: 36, background: '#1A1A2E' }} />;
                }

                return (
                  <input
                    key={`${r},${c}`}
                    value={answers[activeGrid][r][c]}
                    onChange={e => handleCellChange(activeGrid, r, c, e.target.value)}
                    maxLength={1}
                    disabled={allSolved[activeGrid]}
                    style={{
                      width: 36, height: 36, textAlign: 'center',
                      fontFamily: "'Press Start 2P'", fontSize: '14px',
                      border: '1px solid #ccc', background: allSolved[activeGrid] ? '#E8F5E9' : '#FFF',
                      textTransform: 'uppercase', outline: 'none', padding: 0,
                    }}
                  />
                );
              })
            )}
          </div>

          {/* Clues */}
          <PixelCard variant="info" style={{ maxWidth: '500px', width: '100%' }}>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '8px' }}>CLUES</div>
            {grid.clues.map((cl, i) => (
              <div key={i} style={{ fontSize: '12px', marginBottom: '4px', fontFamily: "'Nunito'" }}>
                <strong>{cl.num} {cl.dir.toUpperCase()}:</strong> {cl.clue}
              </div>
            ))}
          </PixelCard>

          {!allSolved[activeGrid] && (
            <PixelButton variant="primary" onClick={handleCheckGrid}>CHECK GRID</PixelButton>
          )}
        </>
      ) : (
        /* Final code entry */
        <PixelCard style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '12px', marginBottom: '16px', color: '#FFB830' }}>
            ALL GRIDS COMPLETE!
          </div>
          <p style={{ fontSize: '13px', marginBottom: '12px' }}>
            Combine the first letters of all across-words, convert A=1, B=2... and enter the 5-digit code:
          </p>
          <input
            value={finalCode}
            onChange={e => setFinalCode(e.target.value)}
            placeholder="Enter 5-digit code..."
            maxLength={5}
            style={{
              fontFamily: "'Fira Code'", fontSize: '20px', textAlign: 'center',
              padding: '10px', border: '3px solid #1A1A2E', width: '200px',
              letterSpacing: '8px',
            }}
          />
          <div style={{ marginTop: '12px' }}>
            <PixelButton variant="primary" onClick={handleFinalSubmit}>SUBMIT CODE</PixelButton>
          </div>
        </PixelCard>
      )}
    </div>
  );
};
