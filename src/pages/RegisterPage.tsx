import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { useGameStore } from '../store/gameStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const startGame = useGameStore(s => s.startGame);
  const [teamName, setTeamName] = useState('');
  const [isSolo, setIsSolo] = useState(false);
  const [member1, setMember1] = useState('');
  const [member2, setMember2] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    const name = teamName.trim();
    if (!name || name.length < 3 || name.length > 20) {
      setError('Team name must be 3-20 characters');
      return;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      setError('Only letters, numbers, and spaces allowed');
      return;
    }
    startGame(name, isSolo);
    navigate('/map');
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif", fontSize: '14px', padding: '10px 14px',
    border: '2px solid #1A1A2E', borderRadius: 0, background: '#FFF',
    width: '100%', outline: 'none',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: '20px', animation: 'pixelFadeIn 600ms ease',
    }}>
      <PixelCard style={{ maxWidth: '460px', width: '100%' }}>
        <h2 style={{
          fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--color-primary)',
          marginBottom: '24px', textAlign: 'center',
        }}>
          \u2693 CREW REGISTRATION
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', marginBottom: '6px', display: 'block' }}>
              TEAM NAME
            </label>
            <input
              value={teamName} onChange={e => { setTeamName(e.target.value); setError(''); }}
              placeholder="Enter crew name..." maxLength={20}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', marginBottom: '8px', display: 'block' }}>
              MODE
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <PixelCard
                variant={!isSolo ? 'info' : 'level'}
                onClick={() => setIsSolo(false)}
                style={{
                  flex: 1, textAlign: 'center', cursor: 'pointer', padding: '12px',
                  border: !isSolo ? '3px solid var(--color-primary)' : '3px solid #1A1A2E',
                }}
              >
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>\uD83D\uDC65 TEAM</div>
                <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>2 players</div>
              </PixelCard>
              <PixelCard
                variant={isSolo ? 'info' : 'level'}
                onClick={() => setIsSolo(true)}
                style={{
                  flex: 1, textAlign: 'center', cursor: 'pointer', padding: '12px',
                  border: isSolo ? '3px solid var(--color-primary)' : '3px solid #1A1A2E',
                }}
              >
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>\uD83D\uDC64 SOLO</div>
                <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>+20% time</div>
              </PixelCard>
            </div>
          </div>

          {!isSolo && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', marginBottom: '4px', display: 'block' }}>
                  MEMBER 1
                </label>
                <input value={member1} onChange={e => setMember1(e.target.value)} placeholder="Name..." style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', marginBottom: '4px', display: 'block' }}>
                  MEMBER 2
                </label>
                <input value={member2} onChange={e => setMember2(e.target.value)} placeholder="Name..." style={inputStyle} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-primary)', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <PixelButton variant="primary" size="lg" onClick={handleStart} style={{ width: '100%', marginTop: '8px' }}>
            \u26F5 BEGIN VOYAGE
          </PixelButton>

          <PixelButton variant="ghost" size="sm" onClick={() => navigate('/')} style={{ width: '100%' }}>
            BACK
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};
