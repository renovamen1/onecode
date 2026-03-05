import React, { useEffect, useRef, useState, useCallback } from 'react';

interface TimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  isRunning: boolean;
  isPaused?: boolean;
  onTick?: (remaining: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ totalSeconds, onTimeUp, isRunning, isPaused = false, onTick }) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeUpCalled = useRef(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    timeUpCalled.current = false;
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning || isPaused) return;
    if (remaining <= 0) return;

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0 && !timeUpCalled.current) {
          timeUpCalled.current = true;
          setTimeout(onTimeUp, 0);
        }
        return Math.max(next, 0);
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isPaused]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  let color = '#FF6B6B';
  let label = '';
  if (remaining <= 10) { color = '#F48FB1'; label = 'DANGER'; }
  else if (remaining <= 30) { color = '#F48FB1'; label = 'WARNING'; }
  else if (remaining <= 60) { color = '#FFB830'; label = ''; }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
    }}>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '16px',
          color,
          animation: remaining <= 10 && remaining > 0 ? 'timerShake 400ms ease infinite' : 'none',
          textShadow: remaining <= 10 ? '0 0 10px rgba(244,143,177,0.5)' : 'none',
        }}
        role="timer"
        aria-live="polite"
        aria-label={`${mins} minutes ${secs} seconds remaining`}
      >
        {timeStr}
      </div>
      {label && (
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color, letterSpacing: '2px' }}>
          {label}
        </span>
      )}
    </div>
  );
};
