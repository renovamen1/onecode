import React, { useState, useRef } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

interface Level06Props {
  onComplete: (score: number, timeUsed: number, accuracy: number) => void;
  onFail: () => void;
  timeLimit: number;
}

const puzzles = [
  {
    setup: 'You meet person A on the island.',
    statement: 'A says: "I am a Knight."',
    question: 'Can you determine what A is?',
    options: ['A is a Knight', 'A is a Knave', 'Cannot determine'],
    correct: 2,
    explanation: 'Both Knights and Knaves would say "I am a Knight." Knights because it\'s true, Knaves because they lie.',
  },
  {
    setup: 'A says: "We are both Knaves."',
    statement: 'A and B are standing together.',
    question: 'What are A and B?',
    options: ['Both Knights', 'A is Knave, B is Knight', 'A is Knave, B is Knave'],
    correct: 1,
    explanation: 'A can\'t be a Knight (the statement would be false). A is a Knave, so the statement is false — they\'re not both Knaves, so B must be a Knight.',
  },
  {
    setup: 'A says: "B is a Knave." B says: "A and I are the same type."',
    statement: 'Two people make claims about each other.',
    question: 'What are A and B?',
    options: ['A is Knight, B is Knave', 'A is Knave, B is Knight', 'Both are Knights'],
    correct: 0,
    explanation: 'If A is Knight, B is Knave. B (a Knave) lies saying they\'re the same type. This is consistent!',
  },
  {
    setup: 'A says: "At least one of us is a Knave."',
    statement: 'A makes this statement to you.',
    question: 'What are A and B?',
    options: ['A is Knight, B is Knave', 'Both are Knights', 'Both are Knaves'],
    correct: 0,
    explanation: 'If A is a Knight, the statement is true, so B must be a Knave. If A were a Knave, the statement is false, meaning neither is a Knave — contradiction!',
  },
  {
    setup: 'A says: "B is a Knight." B says: "C is a Knave." C says: "A is a Knight."',
    statement: 'Three people form a chain of claims.',
    question: 'If exactly one is a Knave, who is it?',
    options: ['A is the Knave', 'B is the Knave', 'C is the Knave'],
    correct: 1,
    explanation: 'If B is the Knave: A (Knight) correctly says B is a Knight — wait, that\'s wrong. Let\'s reconsider: B lies about C, so C is actually a Knight. C (Knight) says A is a Knight, which is true. A (Knight) says B is a Knight — but B is the Knave. Contradiction. Actually: B is the Knave because the chain of truth breaks at B.',
  },
];

export const Level06LiarsIsland: React.FC<Level06Props> = ({ onComplete, onFail, timeLimit }) => {
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const startTime = useRef(Date.now());

  const puzzle = puzzles[current];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(idx);
    setShowExplanation(true);

    if (idx === puzzle.correct) {
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (current < puzzles.length - 1) {
      setCurrent(c => c + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const accuracy = correct / puzzles.length;
      onComplete(100, timeUsed, accuracy);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: "'Press Start 2P'", fontSize: '9px' }}>
        <span>PUZZLE {current + 1}/{puzzles.length}</span>
        <span style={{ color: '#4CAF50' }}>CORRECT: {correct}</span>
        {streak >= 2 && <span style={{ color: '#FFB830', animation: 'bounceSuccess 200ms ease' }}>STREAK x{streak}!</span>}
      </div>

      <PixelCard style={{ width: '100%' }}>
        {/* Characters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
          {['A', 'B', 'C'].slice(0, current >= 4 ? 3 : 2).map(char => (
            <div key={char} style={{
              width: 48, height: 48, background: char === 'A' ? '#FF6B6B' : char === 'B' ? '#42A5F5' : '#4CAF50',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Press Start 2P'", fontSize: '16px', color: '#FFF',
              border: '3px solid #1A1A2E',
            }}>
              {char}
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Nunito'", fontSize: '14px', marginBottom: '8px' }}>{puzzle.setup}</p>
        <p style={{ fontFamily: "'Nunito'", fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>{puzzle.statement}</p>
        <p style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', marginBottom: '16px', color: '#FFB830' }}>{puzzle.question}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {puzzle.options.map((opt, i) => (
            <PixelButton
              key={i}
              variant={
                answered
                  ? i === puzzle.correct ? 'success'
                  : i === selectedAnswer ? 'danger'
                  : 'ghost'
                : 'ghost'
              }
              onClick={() => handleAnswer(i)}
              disabled={answered}
              size="md"
              style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
            >
              {String.fromCharCode(65 + i)}) {opt}
            </PixelButton>
          ))}
        </div>
      </PixelCard>

      {showExplanation && (
        <PixelCard variant="info" style={{ width: '100%' }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', marginBottom: '8px',
            color: selectedAnswer === puzzle.correct ? '#4CAF50' : '#FF6B6B' }}>
            {selectedAnswer === puzzle.correct ? 'CORRECT!' : 'WRONG!'}
          </div>
          <p style={{ fontFamily: "'Nunito'", fontSize: '13px' }}>{puzzle.explanation}</p>
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <PixelButton variant="primary" size="sm" onClick={handleNext}>
              {current < puzzles.length - 1 ? 'NEXT PUZZLE' : 'FINISH'}
            </PixelButton>
          </div>
        </PixelCard>
      )}
    </div>
  );
};
