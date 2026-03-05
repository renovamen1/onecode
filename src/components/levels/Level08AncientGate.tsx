import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level08Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

// Einstein's Riddle style logic grid
const categories = ['Color', 'Animal', 'Number', 'Element'];
const items: Record<string, string[]> = {
  Color: ['Red', 'Blue', 'Green', 'Yellow'],
  Animal: ['Cat', 'Dog', 'Fish', 'Bird'],
  Number: ['1', '2', '3', '4'],
  Element: ['Fire', 'Water', 'Earth', 'Air'],
};

const solution: Record<string, string[]> = {
  Color: ['Red', 'Blue', 'Green', 'Yellow'],
  Animal: ['Dog', 'Cat', 'Fish', 'Bird'],
  Number: ['3', '1', '4', '2'],
  Element: ['Fire', 'Water', 'Earth', 'Air'],
};

const clues = [
  'The Red column is the first column.',
  'The Cat is in the Blue column.',
  'Number 3 is in the Red column.',
  'Water is in column 2.',
  'The Bird is in the last column.',
  'Number 4 is in the Green column.',
  'Earth is directly right of Water.',
  'The Dog is directly left of the Cat.',
];

const COLORS: Record<string, string> = {
  Color: '#FF8A65', Animal: '#42A5F5', Number: '#4CAF50', Element: '#B39DDB',
};

export const Level08AncientGate: React.FC<Level08Props> = ({ onComplete, onFail, timeLimit }) => {
  const [grid, setGrid] = useState<Record<string, (string | null)[]>>({
    Color: [null, null, null, null],
    Animal: [null, null, null, null],
    Number: [null, null, null, null],
    Element: [null, null, null, null],
  });
  const [dragItem, setDragItem] = useState<{ category: string; item: string } | null>(null);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const startTime = useRef(Date.now());

  const getUsedItems = (category: string) => grid[category].filter(Boolean) as string[];

  const handleDrop = (category: string, col: number) => {
    if (!dragItem || dragItem.category !== category) return;
    const newGrid = { ...grid, [category]: [...grid[category]] };

    // If cell occupied, swap
    const existing = newGrid[category][col];
    const prevCol = newGrid[category].indexOf(dragItem.item);
    if (prevCol >= 0) newGrid[category][prevCol] = existing;
    newGrid[category][col] = dragItem.item;

    setGrid(newGrid);
    setDragItem(null);
  };

  const removeFromGrid = (category: string, col: number) => {
    const newGrid = { ...grid, [category]: [...grid[category]] };
    newGrid[category][col] = null;
    setGrid(newGrid);
  };

  const checkSolution = () => {
    setAttempts(a => a + 1);
    let allCorrect = true;
    for (const cat of categories) {
      for (let i = 0; i < 4; i++) {
        if (grid[cat][i] !== solution[cat][i]) {
          allCorrect = false;
          break;
        }
      }
      if (!allCorrect) break;
    }

    if (allCorrect) {
      setMessage('THE GATE OPENS!');
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = attempts === 0 ? 1 : Math.max(0.5, 1 - attempts * 0.1);
      setTimeout(() => onComplete(200, timeUsed, accuracy), 1500);
    } else {
      setMessage('Some placements are incorrect. Keep trying!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#FFB830' }}>
        \uD83D\uDD12 BOSS LEVEL: THE ANCIENT GATE
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ height: '32px' }} />
          {categories.map(cat => (
            <div key={cat} style={{
              height: '48px', display: 'flex', alignItems: 'center',
              fontFamily: "'Press Start 2P'", fontSize: '7px', color: COLORS[cat],
            }}>
              {cat}
            </div>
          ))}
        </div>

        {[0, 1, 2, 3].map(col => (
          <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              width: '80px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#888',
            }}>
              COL {col + 1}
            </div>
            {categories.map(cat => (
              <div
                key={cat}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(cat, col)}
                onClick={() => grid[cat][col] && removeFromGrid(cat, col)}
                style={{
                  width: '80px', height: '48px', border: '2px solid #1A1A2E',
                  background: grid[cat][col] ? COLORS[cat] + '33' : '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Nunito'", fontSize: '11px', fontWeight: 700,
                  cursor: grid[cat][col] ? 'pointer' : 'default',
                }}
              >
                {grid[cat][col] || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Token bank */}
      <PixelCard variant="info" style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '8px' }}>TOKENS</div>
        {categories.map(cat => (
          <div key={cat} style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
            {items[cat].filter(item => !getUsedItems(cat).includes(item)).map(item => (
              <div
                key={item}
                draggable
                onDragStart={() => setDragItem({ category: cat, item })}
                onClick={() => setDragItem({ category: cat, item })}
                style={{
                  padding: '4px 10px', background: COLORS[cat] + '33',
                  border: `2px solid ${COLORS[cat]}`, cursor: 'grab',
                  fontFamily: "'Nunito'", fontSize: '11px', fontWeight: 700,
                  boxShadow: dragItem?.item === item ? `0 0 8px ${COLORS[cat]}` : 'none',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </PixelCard>

      {/* Clues */}
      <PixelCard style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '8px' }}>CLUES</div>
        <ol style={{ fontFamily: "'Nunito'", fontSize: '12px', paddingLeft: '20px' }}>
          {clues.map((c, i) => <li key={i} style={{ marginBottom: '4px' }}>{c}</li>)}
        </ol>
      </PixelCard>

      <div style={{ display: 'flex', gap: '8px' }}>
        <PixelButton variant="primary" size="lg" onClick={checkSolution}>CHECK SOLUTION</PixelButton>
      </div>

      {message && (
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '12px',
          color: message.includes('OPENS') ? '#FFB830' : '#FF6B6B',
          animation: message.includes('OPENS') ? 'bounceSuccess 300ms ease' : 'shakeFailure 400ms ease',
        }}>
          {message}
        </div>
      )}
    </div>
  );
};
