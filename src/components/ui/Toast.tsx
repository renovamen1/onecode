import React, { useState, useEffect } from 'react';

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

const typeStyles: Record<string, { icon: string; border: string; bg: string }> = {
  info: { icon: 'ℹ️', border: '#4ECDC4', bg: '#F0FFFE' },
  warning: { icon: '⚠️', border: '#FFB830', bg: '#FFFCF0' },
  success: { icon: '✅', border: '#4CAF50', bg: '#F0FFF0' },
};

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
      {toasts.map(t => {
        const ts = typeStyles[t.type];
        return (
          <div key={t.id} style={{
            background: ts.bg,
            border: `3px solid ${ts.border}`,
            borderLeft: `6px solid ${ts.border}`,
            padding: '10px 20px',
            fontFamily: 'var(--font-body)', fontSize: '13px',
            boxShadow: '4px 4px 0px rgba(26,26,46,0.15)',
            animation: 'slideUp 300ms ease',
            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
            color: '#1A1A2E',
          }}>
            <span>{ts.icon}</span>
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};
