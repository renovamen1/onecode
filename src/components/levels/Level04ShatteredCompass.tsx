import React, { useState, useEffect, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';

interface Level04Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}

function shuffle(arr: number[]): number[] {
  const shuffled = [...arr];
  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (!isSolvable(shuffled) || arraysEqual(shuffled, [1, 2, 3, 4, 5, 6, 7, 8, 0]));
  return shuffled;
}

function arraysEqual(a: number[], b: number[]) {
  return a.every((v, i) => v === b[i]);
}

const COLORS = ['#FF6B6B', '#FFB830', '#4ECDC4', '#4CAF50', '#42A5F5', '#B39DDB', '#F48FB1', '#FF8A65'];

export const Level04ShatteredCompass: React.FC<Level04Props> = ({ onComplete, onFail, timeLimit }) => {
  const [tiles, setTiles] = useState<number[]>(() => shuffle([1, 2, 3, 4, 5, 6, 7, 8, 0]));
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [code, setCode] = useState('');
  const startTime = useRef(Date.now());
  const TILE_SIZE = 80;

  const getEmptyIndex = () => tiles.indexOf(0);

  const canSwap = (index: number) => {
    const empty = getEmptyIndex();
    const eRow = Math.floor(empty / 3), eCol = empty % 3;
    const tRow = Math.floor(index / 3), tCol = index % 3;
    return (Math.abs(eRow - tRow) + Math.abs(eCol - tCol)) === 1;
  };

  const handleClick = (index: number) => {
    if (solved || !canSwap(index)) return;
    const newTiles = [...tiles];
    const empty = getEmptyIndex();
    [newTiles[index], newTiles[empty]] = [newTiles[empty], newTiles[index]];
    setTiles(newTiles);
    setMoves(m => m + 1);

    if (arraysEqual(newTiles, [1, 2, 3, 4, 5, 6, 7, 8, 0])) {
      setSolved(true);
    }
  };

  const handleCodeSubmit = () => {
    if (code.toUpperCase() === 'NORTH6') {
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const optimalMoves = 20; // rough estimate
      const accuracy = Math.min(optimalMoves / Math.max(moves, 1), 1);
      onComplete(100, timeUsed, accuracy);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px' }}>
        MOVES: {moves}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(3, ${TILE_SIZE}px)`,
        gap: '4px', background: '#1A1A2E', padding: '4px',
        border: '3px solid #1A1A2E',
      }}>
        {tiles.map((tile, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: TILE_SIZE, height: TILE_SIZE,
              background: tile === 0 ? '#1A1A2E' : COLORS[(tile - 1) % COLORS.length],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P'", fontSize: '20px', color: '#FFF',
              cursor: tile !== 0 && canSwap(i) ? 'pointer' : 'default',
              border: tile === 0 ? 'none' : '2px solid #1A1A2E',
              transition: 'transform 150ms ease',
              textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
            }}
          >
            {tile !== 0 && tile}
          </div>
        ))}
      </div>

      {solved && (
        <div style={{ textAlign: 'center', animation: 'bounceSuccess 300ms ease' }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '12px', color: '#4CAF50', marginBottom: '12px' }}>
            COMPASS RESTORED!
          </div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', marginBottom: '8px', color: '#FFB830' }}>
            Code revealed: N _ _ _ _ 6
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <input
              value={code} onChange={e => setCode(e.target.value)}
              placeholder="Enter code..."
              style={{
                fontFamily: "'Fira Code'", fontSize: '16px', padding: '8px',
                border: '3px solid #1A1A2E', textTransform: 'uppercase', width: '160px',
                textAlign: 'center',
              }}
            />
            <PixelButton variant="primary" onClick={handleCodeSubmit}>SUBMIT</PixelButton>
          </div>
        </div>
      )}

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#888' }}>
        Click tiles adjacent to the empty space to slide them
      </div>
    </div>
  );
};
