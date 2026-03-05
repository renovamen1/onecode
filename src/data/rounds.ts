import { Round } from '../types/game';

export const rounds: Round[] = [
  {
    id: 1,
    name: 'ASSEMBLE THE CREW',
    theme: 'Reasoning & Logic',
    levels: [1, 2, 3, 4, 5, 6, 7, 8],
    timeLimit: 1800,
    accentColor: '#FF8A65',
    description: 'Recruit your crew by proving your reasoning skills across 8 island challenges. Each victory brings a new crew member aboard!'
  },
  {
    id: 2,
    name: 'INTO THE GRAND LINE',
    theme: 'Algorithmic Thinking',
    levels: [9, 10, 11, 12],
    timeLimit: 1800,
    accentColor: '#42A5F5',
    description: 'Navigate deeper waters with algorithmic challenges. Ciphers, sorting, queues, and recursive mysteries await.'
  },
  {
    id: 3,
    name: 'THE FINAL KEYS',
    theme: 'Code, Debug & Optimize',
    levels: [13, 14, 15],
    timeLimit: 1800,
    accentColor: '#AB47BC',
    description: 'The ultimate test. Debug corrupted code, optimize algorithms, and trace the mind of the machine itself.'
  }
];
