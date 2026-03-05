import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';

interface Level10Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

function getOptimalSwaps(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const visited = new Array(arr.length).fill(false);
  let swaps = 0;
  for (let i = 0; i < arr.length; i++) {
    if (visited[i] || arr[i] === sorted[i]) continue;
    let cycleSize = 0;
    let j = i;
    while (!visited[j]) {
      visited[j] = true;
      j = sorted.indexOf(arr[j]);
      cycleSize++;
    }
    if (cycleSize > 0) swaps += cycleSize - 1;
  }
  return swaps;
}

function getColor(val: number): string {
  const ratio = (val - 10) / 89;
  const r = Math.round(66 + ratio * 189);
  const g = Math.round(165 - ratio * 100);
  const b = Math.round(245 - ratio * 200);
  return `rgb(${r},${g},${b})`;
}

export const Level10DensityChamber: React.FC<Level10Props> = ({ onComplete, onFail, timeLimit }) => {
  const [beakers, setBeakers] = useState<number[]>(() => {
    const arr: number[] = [];
    while (arr.length < 8) {
      const n = Math.floor(Math.random() * 90) + 10;
      if (!arr.includes(n)) arr.push(n);
    }
    return arr;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [sorted, setSorted] = useState(false);
  const optimalRef = useRef(0);
  const startTime = useRef(Date.now());

  React.useEffect(() => {
    optimalRef.current = getOptimalSwaps([...beakers]);
  }, []);

  const handleClick = (index: number) => {
    if (sorted) return;
    if (selected === null) {
      setSelected(index);
    } else if (selected === index) {
      setSelected(null);
    } else {
      const newBeakers = [...beakers];
      [newBeakers[selected], newBeakers[index]] = [newBeakers[index], newBeakers[selected]];
      setBeakers(newBeakers);
      setSwaps(s => s + 1);
      setSelected(null);

      // Check if sorted
      const isSorted = newBeakers.every((v, i) => i === 0 || newBeakers[i - 1] <= v);
      if (isSorted) {
        setSorted(true);
        const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
        const accuracy = Math.min(optimalRef.current / Math.max(swaps + 1, 1), 1);
        setTimeout(() => onComplete(250, timeUsed, accuracy), 1000);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', fontFamily: "'Press Start 2P'", fontSize: '10px' }}>
        <span>SWAPS: {swaps}</span>
        <span style={{ color: '#FFB830' }}>OPTIMAL: ~{optimalRef.current}</span>
      </div>

      {swaps > optimalRef.current * 3 && !sorted && (
        <div style={{ fontFamily: "'Nunito'", fontSize: '12px', color: '#FFB830', fontStyle: 'italic' }}>
          Tip: Try comparing adjacent beakers and swapping neighbors!
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '300px', padding: '0 20px' }}>
        {beakers.map((val, i) => {
          const height = 40 + (val / 99) * 200;
          const isSelected = selected === i;

          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                cursor: sorted ? 'default' : 'pointer',
                transition: 'transform 300ms ease',
                transform: isSelected ? 'translateY(-10px)' : 'none',
              }}
            >
              {/* Beaker */}
              <div style={{
                width: '60px', height: `${height}px`,
                background: `linear-gradient(180deg, ${getColor(val)}88 0%, ${getColor(val)} 100%)`,
                border: isSelected ? '3px solid #FFB830' : '3px solid #1A1A2E',
                borderRadius: '0 0 4px 4px',
                boxShadow: isSelected ? '0 0 12px #FFB830' : '2px 2px 0px #1A1A2E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                transition: 'border-color 100ms, box-shadow 100ms',
              }}>
                {/* Liquid level markers */}
                {Array.from({ length: Math.floor(height / 20) }).map((_, j) => (
                  <div key={j} style={{
                    position: 'absolute', left: '2px', right: '2px',
                    top: `${j * 20}px`, height: '1px', background: 'rgba(255,255,255,0.3)',
                  }} />
                ))}
                <span style={{
                  fontFamily: "'Press Start 2P'", fontSize: '12px', color: '#FFF',
                  textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
                }}>
                  {val}
                </span>
              </div>
              {/* Beaker base */}
              <div style={{
                width: '70px', height: '6px', background: '#1A1A2E',
              }} />
            </div>
          );
        })}
      </div>

      {sorted && (
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#4CAF50',
          animation: 'bounceSuccess 300ms ease',
        }}>
          PERFECTLY SORTED! \uD83E\uDDEA
        </div>
      )}

      <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#888' }}>
        Click two beakers to swap them. Sort in ascending order.
      </div>
    </div>
  );
};
