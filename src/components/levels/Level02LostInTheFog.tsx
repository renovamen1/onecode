import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Level02Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

type Cell = { top: boolean; right: boolean; bottom: boolean; left: boolean; visited?: boolean };

function generateMaze(w: number, h: number): Cell[][] {
  const grid: Cell[][] = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => ({ top: true, right: true, bottom: true, left: true }))
  );
  const visited = Array.from({ length: h }, () => Array(w).fill(false));
  const stack: [number, number][] = [];
  const dirs: [number, number, string, string][] = [
    [-1, 0, 'top', 'bottom'], [1, 0, 'bottom', 'top'],
    [0, -1, 'left', 'right'], [0, 1, 'right', 'left'],
  ];

  const visit = (r: number, c: number) => {
    visited[r][c] = true;
    stack.push([r, c]);
    while (stack.length > 0) {
      const [cr, cc] = stack[stack.length - 1];
      const neighbors = dirs.filter(([dr, dc]) => {
        const nr = cr + dr, nc = cc + dc;
        return nr >= 0 && nr < h && nc >= 0 && nc < w && !visited[nr][nc];
      });
      if (neighbors.length === 0) { stack.pop(); continue; }
      const [dr, dc, wall1, wall2] = neighbors[Math.floor(Math.random() * neighbors.length)];
      const nr = cr + dr, nc = cc + dc;
      (grid[cr][cc] as any)[wall1] = false;
      (grid[nr][nc] as any)[wall2] = false;
      visited[nr][nc] = true;
      stack.push([nr, nc]);
    }
  };
  visit(0, 0);

  // Remove a few extra walls for multiple paths
  for (let i = 0; i < 8; i++) {
    const r = Math.floor(Math.random() * (h - 1));
    const c = Math.floor(Math.random() * (w - 1));
    if (Math.random() > 0.5) {
      grid[r][c].right = false;
      grid[r][c + 1].left = false;
    } else {
      grid[r][c].bottom = false;
      grid[r + 1][c].top = false;
    }
  }
  return grid;
}

export const Level02LostInTheFog: React.FC<Level02Props> = ({ onComplete, onFail, timeLimit }) => {
  const SIZE = 15;
  const CELL = 32;
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [steps, setSteps] = useState(0);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set(['0,0']));
  const startTime = useRef(Date.now());

  useEffect(() => {
    setMaze(generateMaze(SIZE, SIZE));
  }, []);

  const canMove = useCallback((r: number, c: number, dr: number, dc: number) => {
    if (!maze.length) return false;
    const nr = r + dr, nc = c + dc;
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) return false;
    if (dr === -1) return !maze[r][c].top;
    if (dr === 1) return !maze[r][c].bottom;
    if (dc === -1) return !maze[r][c].left;
    if (dc === 1) return !maze[r][c].right;
    return false;
  }, [maze]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      let dr = 0, dc = 0;
      if (e.key === 'ArrowUp' || e.key === 'w') dr = -1;
      else if (e.key === 'ArrowDown' || e.key === 's') dr = 1;
      else if (e.key === 'ArrowLeft' || e.key === 'a') dc = -1;
      else if (e.key === 'ArrowRight' || e.key === 'd') dc = 1;
      else return;
      e.preventDefault();

      setPlayerPos(prev => {
        if (canMove(prev.r, prev.c, dr, dc)) {
          const nr = prev.r + dr, nc = prev.c + dc;
          setSteps(s => s + 1);
          setVisitedCells(v => new Set(v).add(`${nr},${nc}`));

          // Check win
          if (nr === SIZE - 1 && nc === SIZE - 1) {
            const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
            const optimalPath = (SIZE - 1) * 2;
            const accuracy = Math.min(optimalPath / Math.max(steps + 1, optimalPath), 1);
            onComplete(100, timeUsed, accuracy);
          }
          return { r: nr, c: nc };
        }
        return prev;
      });
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [canMove, steps]);

  if (!maze.length) return <div>Generating maze...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '20px', fontFamily: "'Press Start 2P'", fontSize: '10px' }}>
        <span>STEPS: {steps}</span>
        <span style={{ color: '#FFB830' }}>EXIT: ({SIZE - 1},{SIZE - 1})</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZE}, ${CELL}px)`,
        gridTemplateRows: `repeat(${SIZE}, ${CELL}px)`,
        background: '#1A1A2E',
        border: '3px solid #1A1A2E',
        position: 'relative',
      }}>
        {maze.map((row, r) => row.map((cell, c) => {
          const dist = Math.abs(r - playerPos.r) + Math.abs(c - playerPos.c);
          const isVisible = dist <= 3;
          const isDim = dist === 4;
          const isPlayer = r === playerPos.r && c === playerPos.c;
          const isExit = r === SIZE - 1 && c === SIZE - 1;
          const isVisited = visitedCells.has(`${r},${c}`);

          return (
            <div
              key={`${r},${c}`}
              style={{
                width: CELL, height: CELL,
                background: isPlayer ? '#FF6B6B'
                  : isExit && isVisible ? '#FFB830'
                  : isVisible ? '#FFFDF0'
                  : isDim ? 'rgba(255,253,240,0.15)'
                  : '#1A1A2E',
                borderTop: cell.top ? '2px solid #1A1A2E' : '2px solid transparent',
                borderRight: cell.right ? '2px solid #1A1A2E' : '2px solid transparent',
                borderBottom: cell.bottom ? '2px solid #1A1A2E' : '2px solid transparent',
                borderLeft: cell.left ? '2px solid #1A1A2E' : '2px solid transparent',
                opacity: isVisible ? 1 : isDim ? 0.3 : 0,
                transition: 'opacity 150ms, background 100ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
            >
              {isPlayer && <div style={{ width: 16, height: 16, background: '#FF6B6B', border: '2px solid #FFF' }} />}
              {isExit && isVisible && !isPlayer && (
                <div style={{ width: 16, height: 16, background: '#FFB830', animation: 'pulse 1s infinite' }} />
              )}
              {isVisited && !isPlayer && !isExit && isVisible && (
                <div style={{ width: 4, height: 4, background: '#FF6B6B', opacity: 0.5 }} />
              )}
            </div>
          );
        }))}
      </div>

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#888' }}>
        Use WASD or Arrow Keys to navigate through the fog
      </div>
    </div>
  );
};
