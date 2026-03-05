import React, { useState, useRef } from 'react';
import { Chess } from 'chess.js';
import { PixelButton } from '../ui/PixelButton';

interface Level05Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

// Mate in 2 puzzle: White to play and mate in 2
// FEN: White has Kf1, Qd1, Rh1; Black has Kg8, Pa7,b7,f7,g7,h6
const PUZZLE_FEN = 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4';
// Solution: 1.Qxf7# (Scholar's mate position)

const PIECES: Record<string, string> = {
  'K': '\u2654', 'Q': '\u2655', 'R': '\u2656', 'B': '\u2657', 'N': '\u2658', 'P': '\u2659',
  'k': '\u265A', 'q': '\u265B', 'r': '\u265C', 'b': '\u265D', 'n': '\u265E', 'p': '\u265F',
};

export const Level05AdmiralsGambit: React.FC<Level05Props> = ({ onComplete, onFail, timeLimit }) => {
  const [game] = useState(() => new Chess(PUZZLE_FEN));
  const [board, setBoard] = useState(() => game.board());
  const [selected, setSelected] = useState<string | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [message, setMessage] = useState('White to move. Find checkmate!');
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const startTime = useRef(Date.now());

  const handleSquareClick = (row: number, col: number) => {
    if (solved) return;
    const file = String.fromCharCode(97 + col);
    const rank = String(8 - row);
    const square = `${file}${rank}`;

    if (selected) {
      try {
        const move = game.move({ from: selected, to: square, promotion: 'q' });
        if (move) {
          setMoveCount(m => m + 1);
          setBoard(game.board());

          if (game.isCheckmate()) {
            setSolved(true);
            setMessage(`CHECKMATE! The move: ${move.san}`);
            const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
            const accuracy = attempts === 0 ? 1 : Math.max(0.5, 1 - attempts * 0.15);
            setTimeout(() => onComplete(100, timeUsed, accuracy), 1500);
          } else if (game.turn() === 'b') {
            // Let black respond (make a reasonable move)
            const moves = game.moves();
            if (moves.length > 0) {
              game.move(moves[Math.floor(Math.random() * moves.length)]);
              setBoard(game.board());
              setMoveCount(m => m + 1);
              setMessage('Your turn again. Find the checkmate!');
            }
          }
        }
      } catch {
        setMessage('Invalid move! Try again.');
        setAttempts(a => a + 1);
      }
      setSelected(null);
    } else {
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setSelected(square);
      }
    }
  };

  const handleReset = () => {
    game.load(PUZZLE_FEN);
    setBoard(game.board());
    setSelected(null);
    setMoveCount(0);
    setMessage('White to move. Find checkmate!');
    setAttempts(a => a + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: solved ? '#4CAF50' : '#1A1A2E' }}>
        {message}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(8, 60px)',
        border: '3px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E',
      }}>
        {board.map((row, r) => row.map((piece, c) => {
          const file = String.fromCharCode(97 + c);
          const rank = String(8 - r);
          const square = `${file}${rank}`;
          const isLight = (r + c) % 2 === 0;
          const isSelected = selected === square;

          return (
            <div
              key={`${r},${c}`}
              onClick={() => handleSquareClick(r, c)}
              style={{
                width: 60, height: 60,
                background: isSelected ? '#FFB830'
                  : isLight ? '#FFF8E7' : '#FFCDD2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '36px',
                transition: 'background 100ms',
              }}
            >
              {piece && PIECES[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}
            </div>
          );
        }))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <PixelButton variant="ghost" size="sm" onClick={handleReset}>RESET BOARD</PixelButton>
      </div>

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#888' }}>
        Click a piece to select, then click destination to move
      </div>
    </div>
  );
};
