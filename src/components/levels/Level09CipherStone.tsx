import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level09Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

const cipherText = 'KHOOR ZRUOG';
const correctShift = 3;
const plainText = 'HELLO WORLD';

function caesarDecode(text: string, shift: number): string {
  return text.split('').map(c => {
    if (c >= 'A' && c <= 'Z') {
      return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
    }
    return c;
  }).join('');
}

export const Level09CipherStone: React.FC<Level09Props> = ({ onComplete, onFail, timeLimit }) => {
  const [shift, setShift] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusInput, setBonusInput] = useState('');
  const [bonusSolved, setBonusSolved] = useState(false);
  const [mainSolved, setMainSolved] = useState(false);
  const startTime = useRef(Date.now());

  const decoded = caesarDecode(cipherText, shift);

  // Bonus: ROT13
  const bonusCipher = 'PBQVAT VF SHA';
  const bonusAnswer = 'CODING IS FUN';

  const handleSubmit = () => {
    setAttempts(a => a + 1);
    if (input.toUpperCase().trim() === plainText) {
      setMainSolved(true);
      setShowBonus(true);
    }
  };

  const handleBonusSubmit = () => {
    if (bonusInput.toUpperCase().trim() === bonusAnswer) {
      setBonusSolved(true);
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = attempts <= 1 ? 1 : attempts <= 2 ? 0.8 : 0.6;
      onComplete(300, timeUsed, accuracy); // +50 bonus
    }
  };

  const handleSkipBonus = () => {
    const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
    const accuracy = attempts <= 1 ? 1 : attempts <= 2 ? 0.8 : 0.6;
    onComplete(250, timeUsed, accuracy);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {!showBonus ? (
        <>
          {/* Stone tablet */}
          <PixelCard style={{
            width: '100%', background: '#D7CCC8', textAlign: 'center',
            border: '4px solid #5D4037', boxShadow: '6px 6px 0px #3E2723',
          }}>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#5D4037', marginBottom: '12px' }}>
              \uD83D\uDDFF ANCIENT CIPHER STONE
            </div>
            <div style={{
              fontFamily: "'Press Start 2P'", fontSize: '18px', color: '#3E2723',
              textShadow: '1px 1px 0px #A1887F, -1px -1px 0px #EFEBE9',
              letterSpacing: '4px', padding: '16px',
            }}>
              {cipherText}
            </div>
          </PixelCard>

          {/* Shift slider */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: '10px' }}>SHIFT: {shift}</span>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: shift === correctShift ? '#4CAF50' : '#888' }}>
                {shift === correctShift ? '\u2713' : ''}
              </span>
            </div>
            <input
              type="range" min="0" max="25" value={shift}
              onChange={e => setShift(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#FFB830' }}
            />
          </div>

          {/* Preview */}
          <PixelCard variant="info" style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#888', marginBottom: '8px' }}>
              DECODED PREVIEW
            </div>
            <div style={{ fontFamily: "'Nunito'", fontSize: '20px', fontWeight: 700, letterSpacing: '4px' }}>
              {decoded}
            </div>
          </PixelCard>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Type the decoded message..."
              style={{
                flex: 1, padding: '10px', fontFamily: "'Fira Code'", fontSize: '14px',
                border: '3px solid #1A1A2E', textTransform: 'uppercase',
              }}
            />
            <PixelButton variant="primary" onClick={handleSubmit}>SUBMIT</PixelButton>
          </div>
        </>
      ) : !bonusSolved ? (
        /* Bonus round */
        <PixelCard style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '12px', color: '#FFB830', marginBottom: '16px' }}>
            \u2B50 BONUS: ROT-13 (+50 pts)
          </div>
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#3E2723',
            padding: '16px', background: '#D7CCC8', marginBottom: '16px',
          }}>
            {bonusCipher}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <input
              value={bonusInput} onChange={e => setBonusInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBonusSubmit()}
              placeholder="Decode ROT-13..."
              style={{
                padding: '10px', fontFamily: "'Fira Code'", fontSize: '14px',
                border: '3px solid #1A1A2E', textTransform: 'uppercase', width: '250px',
              }}
            />
            <PixelButton variant="success" onClick={handleBonusSubmit}>DECODE</PixelButton>
          </div>
          <div style={{ marginTop: '12px' }}>
            <PixelButton variant="ghost" size="sm" onClick={handleSkipBonus}>SKIP BONUS</PixelButton>
          </div>
        </PixelCard>
      ) : (
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#4CAF50', animation: 'bounceSuccess 300ms ease' }}>
          BOTH CIPHERS CRACKED! \uD83C\uDF89
        </div>
      )}
    </div>
  );
};
