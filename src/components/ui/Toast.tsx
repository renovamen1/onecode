import React, { useState, useEffect, useCallback } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
}

let toastId = 0;
const listeners: ((msg: ToastMessage) => void)[] = [];

export function showToast(message: string, type: 'info' | 'warning' | 'success' = 'info') {
  const msg: ToastMessage = { id: ++toastId, message, type };
  listeners.forEach(fn => fn(msg));
}

const icons = { info: '\u2139\uFE0F', warning: '\u26A0\uFE0F', success: '\u2705' };

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id));
      }, 2500);
    };
    listeners.push(handler);
    return () => { const idx = listeners.indexOf(handler); if (idx >= 0) listeners.splice(idx, 1); };
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: '#FFF8E7', border: '2px solid #1A1A2E', padding: '10px 20px',
          fontFamily: "'Nunito', sans-serif", fontSize: '13px',
          boxShadow: '4px 4px 0px #1A1A2E', animation: 'slideUp 300ms ease',
          display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
        }}>
          <span>{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
