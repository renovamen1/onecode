# ONE CODE: The Voyage of Reasoning

A competitive puzzle game testing computational thinking skills through 15 epic challenges across the Grand Line.

## Project Overview
- **Name**: ONE CODE: The Voyage of Reasoning
- **Goal**: A browser-based competitive puzzle game for hackathons, coding events, and CS education
- **Tech Stack**: React 18 + TypeScript + Vite + Zustand + Tailwind-style CSS

## Features

### 15 Unique Puzzle Levels Across 3 Rounds

**Round 1: Assemble the Crew (Reasoning & Logic)**
1. Storm the Keyboard - Typing speed challenge with falling letters
2. Lost in the Fog - Maze navigation with fog of war
3. The Cipher Crosswords - CS-themed crossword puzzles
4. Shattered Compass - Sliding tile puzzle
5. The Admiral's Gambit - Chess mate-in-2 puzzle
6. The Liar's Island - Knight/Knave logic puzzles
7. Signal in the Static - Binary to ASCII decoder
8. The Ancient Gate (BOSS) - Einstein's riddle logic grid

**Round 2: Into the Grand Line (Algorithmic Thinking)**
9. The Cipher Stone - Caesar cipher decoder
10. The Density Chamber - Visual bubble sort
11. The Infinite Kitchen - Queue/Stack simulation
12. The Haunted Lighthouse (BOSS) - Recursion challenges (Fibonacci/Hanoi)

**Round 3: The Final Keys (Code, Debug & Optimize)**
13. The Corrupted System - Python debugging puzzle
14. The Ice Wall - Algorithm optimization (O(n^2) to O(n))
15. The One Code (FINAL BOSS) - Recursive function tracing

### Core Game Systems
- Real-time scoring with time bonus and accuracy multiplier
- XP progression bar
- 8 collectible crew members (unlocked through Round 1)
- 5-star rating system per level
- Hint system (2 per round, halves score)
- Solo mode (+20% time bonus)
- Local leaderboard with persistence
- Save/resume functionality

### UI/UX
- Pixel-art aesthetic with Press Start 2P font
- Grand Line world map with animated islands and ship
- Level transition countdowns
- Victory animations with treasure chest opening
- Combo counter for sequential correct answers
- Toast notifications

## URLs
- **Local Dev**: http://localhost:3000
- **Production**: Deploy to Cloudflare Pages or Vercel

## Quick Start
```bash
npm install
npm run build
npm run preview
```

## Project Structure
```
src/
  components/
    levels/      - All 15 level components
    ui/          - Reusable UI (PixelCard, PixelButton, Timer, etc.)
  data/          - Level configs, crew data, map data, rounds
  hooks/         - Custom hooks
  pages/         - Route pages (Title, Register, Map, Level, Victory, Leaderboard)
  store/         - Zustand game state store
  styles/        - Global CSS with pixel-art design system
  types/         - TypeScript type definitions
```

## Data Architecture
- **State Management**: Zustand with localStorage persistence
- **Game Store**: Tracks currentLevel, score, XP, crew, hints, level results
- **Leaderboard**: Local leaderboard stored in Zustand persistent store
- **Storage**: All data client-side via localStorage (no backend required)

## Scoring Formula
```
score = basePoints * (0.5 + 0.5 * (timeRemaining / timeLimit)) * accuracy
```

## Star Rating
- 5 stars: >= 95% score, no hints
- 4 stars: >= 80% score
- 3 stars: >= 60% score
- 2 stars: >= 40% score
- 1 star: < 40% score

## Deployment
- **Platform**: Vite static build (deployable to any static host)
- **Build**: `npm run build` creates optimized `dist/` directory
- **Status**: Active
- **Bundle Size**: ~375KB (116KB gzipped)

## Event Hosting
This game is designed for competitive events:
- Teams of 2 or solo play
- Real-time leaderboard display
- Save/resume for browser crashes
- No backend required - runs entirely in the browser
