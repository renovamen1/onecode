import React, { useState, useEffect, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';

interface Level11Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

interface Customer {
  id: number;
  name: string;
  order: string;
  patience: number;
  maxPatience: number;
  isRush: boolean;
}

const NAMES = ['Luffy', 'Zoro', 'Nami', 'Sanji', 'Robin', 'Chopper', 'Franky', 'Brook', 'Jinbe', 'Usopp'];
const ORDERS = ['Sushi', 'Ramen', 'Takoyaki', 'Curry', 'Onigiri', 'Tempura', 'Miso', 'Udon', 'Gyoza', 'Katsu'];
const FACES = ['\uD83D\uDE0A', '\uD83D\uDE04', '\uD83E\uDD14', '\uD83D\uDE42', '\uD83D\uDE09', '\uD83E\uDD29', '\uD83D\uDE0E', '\uD83E\uDD20'];

export const Level11InfiniteKitchen: React.FC<Level11Props> = ({ onComplete, onFail, timeLimit }) => {
  const [queue, setQueue] = useState<Customer[]>([]);
  const [rushStack, setRushStack] = useState<Customer[]>([]);
  const [score, setScore] = useState(0);
  const [served, setServed] = useState(0);
  const [lost, setLost] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const nextId = useRef(0);
  const startTime = useRef(Date.now());

  // Spawn customers
  useEffect(() => {
    const interval = setInterval(() => {
      const isRush = Math.random() < 0.15;
      const customer: Customer = {
        id: nextId.current++,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        order: ORDERS[Math.floor(Math.random() * ORDERS.length)],
        patience: isRush ? 6 : 8 + Math.floor(Math.random() * 8),
        maxPatience: isRush ? 6 : 15,
        isRush,
      };

      if (isRush) {
        setRushStack(prev => [...prev, customer]);
      } else {
        setQueue(prev => prev.length < 8 ? [...prev, customer] : prev);
      }
    }, 2000 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, []);

  // Patience timer
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(Math.floor((Date.now() - startTime.current) / 1000));

      setQueue(prev => {
        const expired = prev.filter(c => c.patience <= 0);
        if (expired.length > 0) {
          setLost(l => l + expired.length);
          setScore(s => s - expired.length * 15);
        }
        return prev.filter(c => c.patience > 0).map(c => ({ ...c, patience: c.patience - 1 }));
      });

      setRushStack(prev => {
        const expired = prev.filter(c => c.patience <= 0);
        if (expired.length > 0) {
          setLost(l => l + expired.length);
          setScore(s => s - expired.length * 15);
        }
        return prev.filter(c => c.patience > 0).map(c => ({ ...c, patience: c.patience - 1 }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-complete after time
  useEffect(() => {
    if (gameTime >= 120) { // 2 minute game
      const accuracy = served / Math.max(served + lost, 1);
      onComplete(250, gameTime, accuracy);
    }
  }, [gameTime]);

  const handleServe = () => {
    // Serve rush first (LIFO), then queue (FIFO)
    if (rushStack.length > 0) {
      setRushStack(prev => prev.slice(0, -1));
      setServed(s => s + 1);
      setScore(s => s + 25);
    } else if (queue.length > 0) {
      setQueue(prev => prev.slice(1));
      setServed(s => s + 1);
      setScore(s => s + 25);
    }
  };

  const handleServeQueue = () => {
    if (queue.length > 0) {
      setQueue(prev => prev.slice(1));
      setServed(s => s + 1);
      setScore(s => s + 25);
    }
  };

  const handleServeRush = () => {
    if (rushStack.length > 0) {
      setRushStack(prev => prev.slice(0, -1));
      setServed(s => s + 1);
      setScore(s => s + 35);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '20px', fontFamily: "'Press Start 2P'", fontSize: '9px', width: '100%', justifyContent: 'space-between' }}>
        <span style={{ color: '#4CAF50' }}>SERVED: {served}</span>
        <span>SCORE: {score}</span>
        <span style={{ color: '#FF6B6B' }}>LOST: {lost}</span>
        <span style={{ color: '#FFB830' }}>TIME: {120 - gameTime}s</span>
      </div>

      {/* Rush orders (Stack) */}
      {rushStack.length > 0 && (
        <div style={{
          width: '100%', background: '#FFE0E0', border: '3px solid #FF6B6B',
          padding: '8px', animation: 'pulse 1s infinite',
        }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#FF6B6B', marginBottom: '8px' }}>
            \uD83D\uDEA8 RUSH ORDERS (STACK - LIFO)
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {rushStack.map(c => (
              <div key={c.id} style={{
                padding: '6px 10px', background: '#FFF', border: '2px solid #FF6B6B',
                fontFamily: "'Nunito'", fontSize: '11px',
              }}>
                \u26A1 {c.order}
                <div style={{
                  height: '3px', background: c.patience > 3 ? '#FFB830' : '#FF6B6B',
                  width: `${(c.patience / c.maxPatience) * 100}%`, marginTop: '2px',
                  transition: 'width 1s linear',
                }} />
              </div>
            ))}
          </div>
          <PixelButton variant="danger" size="sm" onClick={handleServeRush} style={{ marginTop: '8px' }}>
            SERVE RUSH ORDER
          </PixelButton>
        </div>
      )}

      {/* Queue */}
      <div style={{ width: '100%', border: '3px solid #1A1A2E', padding: '12px', background: '#FFF8E7' }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '8px' }}>
          \uD83D\uDC65 CUSTOMER QUEUE (FIFO)
        </div>
        <div style={{ display: 'flex', gap: '8px', minHeight: '80px', alignItems: 'flex-end' }}>
          {queue.length === 0 ? (
            <div style={{ fontFamily: "'Nunito'", fontSize: '13px', color: '#888' }}>Waiting for customers...</div>
          ) : (
            queue.map((c, i) => (
              <div key={c.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                animation: c.patience <= 3 ? 'shakeFailure 400ms infinite' : 'none',
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: c.patience <= 3 ? '#FFCDD2' : '#E8F5E9',
                  border: '2px solid #1A1A2E', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '24px',
                }}>
                  {c.patience <= 2 ? '\uD83D\uDE21' : FACES[i % FACES.length]}
                </div>
                <div style={{ fontFamily: "'Nunito'", fontSize: '9px', fontWeight: 700 }}>{c.order}</div>
                <div style={{
                  width: '48px', height: '4px', background: '#eee', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    background: c.patience > 5 ? '#4CAF50' : c.patience > 2 ? '#FFB830' : '#FF6B6B',
                    width: `${(c.patience / c.maxPatience) * 100}%`,
                    transition: 'width 1s linear',
                  }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <PixelButton variant="success" size="lg" onClick={handleServeQueue} disabled={queue.length === 0}>
          \uD83C\uDF5C SERVE NEXT
        </PixelButton>
      </div>

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#888', textAlign: 'center' }}>
        Serve queue customers (FIFO) and rush orders (LIFO - stack). Don't let them leave!
      </div>
    </div>
  );
};
