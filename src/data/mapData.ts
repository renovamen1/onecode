import { Island } from '../types/map';

export const islands: Island[] = [
  { id: 1, name: 'Storm the Keyboard', position: { x: 200, y: 500 }, state: 'active', zone: 'east-blue', roundId: 1, levelId: 1, size: 'small', isBoss: false },
  { id: 2, name: 'Lost in the Fog', position: { x: 420, y: 380 }, state: 'locked', zone: 'east-blue', roundId: 1, levelId: 2, size: 'small', isBoss: false },
  { id: 3, name: 'The Cipher Crosswords', position: { x: 620, y: 520 }, state: 'locked', zone: 'east-blue', roundId: 1, levelId: 3, size: 'small', isBoss: false },
  { id: 4, name: 'Shattered Compass', position: { x: 830, y: 350 }, state: 'locked', zone: 'east-blue', roundId: 1, levelId: 4, size: 'small', isBoss: false },
  { id: 5, name: "The Admiral's Gambit", position: { x: 1020, y: 480 }, state: 'locked', zone: 'east-blue', roundId: 1, levelId: 5, size: 'small', isBoss: false },
  { id: 6, name: "The Liar's Island", position: { x: 1220, y: 340 }, state: 'locked', zone: 'east-blue', roundId: 1, levelId: 6, size: 'small', isBoss: false },
  { id: 7, name: 'Signal in the Static', position: { x: 1420, y: 500 }, state: 'locked', zone: 'east-blue', roundId: 1, levelId: 7, size: 'small', isBoss: false },
  { id: 8, name: 'The Ancient Gate', position: { x: 1650, y: 400 }, state: 'locked', zone: 'east-blue', roundId: 1, levelId: 8, size: 'large', isBoss: true },
  { id: 9, name: 'The Cipher Stone', position: { x: 1950, y: 480 }, state: 'locked', zone: 'grand-line', roundId: 2, levelId: 9, size: 'medium', isBoss: false },
  { id: 10, name: 'The Density Chamber', position: { x: 2200, y: 350 }, state: 'locked', zone: 'grand-line', roundId: 2, levelId: 10, size: 'medium', isBoss: false },
  { id: 11, name: 'The Infinite Kitchen', position: { x: 2450, y: 500 }, state: 'locked', zone: 'grand-line', roundId: 2, levelId: 11, size: 'medium', isBoss: false },
  { id: 12, name: 'The Haunted Lighthouse', position: { x: 2720, y: 380 }, state: 'locked', zone: 'grand-line', roundId: 2, levelId: 12, size: 'large', isBoss: true },
  { id: 13, name: 'The Corrupted System', position: { x: 3050, y: 460 }, state: 'locked', zone: 'new-world', roundId: 3, levelId: 13, size: 'medium', isBoss: false },
  { id: 14, name: 'The Ice Wall', position: { x: 3350, y: 350 }, state: 'locked', zone: 'new-world', roundId: 3, levelId: 14, size: 'medium', isBoss: false },
  { id: 15, name: 'The One Code', position: { x: 3650, y: 440 }, state: 'locked', zone: 'new-world', roundId: 3, levelId: 15, size: 'large', isBoss: true },
];

export const shipPath = [
  { x: 200, y: 500 }, { x: 310, y: 440 }, { x: 420, y: 380 },
  { x: 520, y: 450 }, { x: 620, y: 520 }, { x: 725, y: 435 },
  { x: 830, y: 350 }, { x: 925, y: 415 }, { x: 1020, y: 480 },
  { x: 1120, y: 410 }, { x: 1220, y: 340 }, { x: 1320, y: 420 },
  { x: 1420, y: 500 }, { x: 1535, y: 450 }, { x: 1650, y: 400 },
  { x: 1800, y: 440 }, { x: 1950, y: 480 }, { x: 2075, y: 415 },
  { x: 2200, y: 350 }, { x: 2325, y: 425 }, { x: 2450, y: 500 },
  { x: 2585, y: 440 }, { x: 2720, y: 380 }, { x: 2885, y: 420 },
  { x: 3050, y: 460 }, { x: 3200, y: 405 }, { x: 3350, y: 350 },
  { x: 3500, y: 395 }, { x: 3650, y: 440 }
];
