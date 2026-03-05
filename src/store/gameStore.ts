import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, LevelResult } from '../types/game';

interface LeaderboardEntry {
  teamName: string;
  score: number;
  levelsCompleted: number;
  totalTime: number;
  timestamp: number;
}

interface GameStore extends GameState {
  levelResults: Record<number, LevelResult>;
  leaderboard: LeaderboardEntry[];

  startGame: (teamName: string, isSolo: boolean) => void;
  completeLevel: (levelId: number, score: number, timeUsed: number, accuracy: number, hintsUsed?: number) => void;
  useHint: (levelId: number) => boolean;
  unlockCrew: (index: number) => void;
  setCurrentLevel: (level: number) => void;
  resetGame: () => void;
  calculateScore: (basePoints: number, timeRemaining: number, timeLimit: number, accuracy: number) => number;
  calculateStarRating: (score: number, maxScore: number, hintsUsed: boolean) => number;
  toggleMute: () => void;
  togglePause: () => void;
  addLeaderboardEntry: (entry: LeaderboardEntry) => void;
  clearSave: () => void;
  hasSave: () => boolean;
}

const initialState: GameState = {
  currentLevel: 1,
  currentRound: 1,
  totalScore: 0,
  xp: 0,
  hintsRemaining: 6,
  teamName: '',
  isSoloMode: false,
  crewUnlocked: [true, false, false, false, false, false, false, false],
  isPaused: false,
  isMuted: false,
  skipsRemaining: 3,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      levelResults: {},
      leaderboard: [],

      startGame: (teamName: string, isSolo: boolean) => {
        set({
          ...initialState,
          teamName,
          isSoloMode: isSolo,
          levelResults: {},
        });
      },

      completeLevel: (levelId: number, score: number, timeUsed: number, accuracy: number, hintsUsed = 0) => {
        const state = get();
        const starRating = state.calculateStarRating(score, score / Math.max(accuracy, 0.01), hintsUsed > 0);

        const result: LevelResult = {
          levelId,
          score,
          timeUsed,
          accuracy,
          completed: true,
          starRating,
          hintsUsed,
          retries: (state.levelResults[levelId]?.retries || 0),
        };

        const newCrewUnlocked = [...state.crewUnlocked];
        if (levelId <= 7 && levelId >= 1) {
          newCrewUnlocked[levelId] = true;
        }

        const nextLevel = Math.min(levelId + 1, 15);
        const nextRound = nextLevel <= 8 ? 1 : nextLevel <= 12 ? 2 : 3;

        set({
          levelResults: { ...state.levelResults, [levelId]: result },
          totalScore: state.totalScore + score,
          xp: state.xp + Math.floor(score / 10),
          currentLevel: nextLevel,
          currentRound: nextRound,
          crewUnlocked: newCrewUnlocked,
        });
      },

      useHint: (_levelId: number) => {
        const state = get();
        if (state.hintsRemaining <= 0) return false;
        set({ hintsRemaining: state.hintsRemaining - 1 });
        return true;
      },

      unlockCrew: (index: number) => {
        const state = get();
        const newCrew = [...state.crewUnlocked];
        newCrew[index] = true;
        set({ crewUnlocked: newCrew });
      },

      setCurrentLevel: (level: number) => {
        set({
          currentLevel: level,
          currentRound: level <= 8 ? 1 : level <= 12 ? 2 : 3,
        });
      },

      resetGame: () => {
        set({ ...initialState, levelResults: {} });
      },

      calculateScore: (basePoints: number, timeRemaining: number, timeLimit: number, accuracy: number) => {
        const timeBonus = Math.max(timeRemaining, 0) / Math.max(timeLimit, 1);
        const score = Math.round(basePoints * (0.5 + 0.5 * timeBonus) * accuracy);
        return Math.max(score, 0);
      },

      calculateStarRating: (score: number, maxScore: number, usedHints: boolean) => {
        if (maxScore <= 0) return 1;
        const pct = score / maxScore;
        if (pct >= 0.95 && !usedHints) return 5;
        if (pct >= 0.80) return 4;
        if (pct >= 0.60) return 3;
        if (pct >= 0.40) return 2;
        return 1;
      },

      toggleMute: () => set(s => ({ isMuted: !s.isMuted })),
      togglePause: () => set(s => ({ isPaused: !s.isPaused })),

      addLeaderboardEntry: (entry: LeaderboardEntry) => {
        const state = get();
        const existing = state.leaderboard.filter(e => e.teamName !== entry.teamName);
        const updated = [...existing, entry].sort((a, b) => b.score - a.score).slice(0, 50);
        set({ leaderboard: updated });
      },

      clearSave: () => {
        localStorage.removeItem('one-code-save');
        set({ ...initialState, levelResults: {}, leaderboard: get().leaderboard });
      },

      hasSave: () => {
        const state = get();
        return state.teamName !== '' && state.currentLevel > 1;
      },
    }),
    {
      name: 'one-code-save',
    }
  )
);
