// Game Types
export interface GameState {
  currentLevel: number;
  currentRound: number;
  totalScore: number;
  xp: number;
  hintsRemaining: number;
  teamName: string;
  isSoloMode: boolean;
  crewUnlocked: boolean[];
  isPaused: boolean;
  isMuted: boolean;
  skipsRemaining: number;
}

export interface LevelResult {
  levelId: number;
  score: number;
  timeUsed: number;
  accuracy: number;
  completed: boolean;
  starRating: number;
  hintsUsed: number;
  retries: number;
  skipped?: boolean;
}

export interface Round {
  id: number;
  name: string;
  theme: string;
  levels: number[];
  timeLimit: number;
  accentColor: string;
  description: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  roundId: number;
  basePoints: number;
  timeLimit: number;
  difficulty: number;
  mechanic: string;
  story: string;
  isBoss: boolean;
  instructions: string[];
  controls: string[];
}

export type LevelState = 'transition' | 'playing' | 'complete' | 'failed';
