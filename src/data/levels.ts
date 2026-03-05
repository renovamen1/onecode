import { LevelConfig } from '../types/game';

export const levels: LevelConfig[] = [
  {
    id: 1, name: 'Storm the Keyboard', roundId: 1, basePoints: 100, timeLimit: 240,
    difficulty: 1, mechanic: 'typing', isBoss: false,
    story: 'A violent storm rocks your ship! Letters fly from the sails — catch them before they\'re lost to the sea!',
    instructions: ['Type falling letters before they hit the bottom', 'Build combos for bonus points', 'You have 3 lives — miss 3 letters and it\'s over'],
    controls: ['Any letter key = type that letter']
  },
  {
    id: 2, name: 'Lost in the Fog', roundId: 1, basePoints: 100, timeLimit: 240,
    difficulty: 2, mechanic: 'maze', isBoss: false,
    story: 'Dense fog blankets the sea. Navigate through the mysterious maze to find your way to shore.',
    instructions: ['Navigate through the fog-covered maze', 'Only nearby cells are visible', 'Find the golden exit to escape'],
    controls: ['WASD or Arrow Keys = move']
  },
  {
    id: 3, name: 'The Cipher Crosswords', roundId: 1, basePoints: 100, timeLimit: 240,
    difficulty: 2, mechanic: 'crossword', isBoss: false,
    story: 'Ancient stone tablets bear encrypted words. Solve three crossword puzzles to decode the island\'s secret.',
    instructions: ['Complete 3 crossword grids with CS-themed words', 'Use the clues to fill in each grid', 'Combine first letters to form the final code'],
    controls: ['Click cell to select', 'Type letters to fill', 'Tab = next cell']
  },
  {
    id: 4, name: 'Shattered Compass', roundId: 1, basePoints: 100, timeLimit: 240,
    difficulty: 2, mechanic: 'sliding-puzzle', isBoss: false,
    story: 'The ship\'s compass has shattered into pieces! Reassemble the sliding tiles to restore navigation.',
    instructions: ['Slide tiles to restore the compass image', 'Click a tile adjacent to the empty space to move it', 'Fewer moves = higher score'],
    controls: ['Click = slide tile']
  },
  {
    id: 5, name: 'The Admiral\'s Gambit', roundId: 1, basePoints: 100, timeLimit: 240,
    difficulty: 3, mechanic: 'chess', isBoss: false,
    story: 'The Admiral challenges you to a chess puzzle. Achieve checkmate in exactly 2 moves to earn passage.',
    instructions: ['Find the checkmate in 2 moves', 'Click a piece to select, then click destination', 'Only legal moves are allowed'],
    controls: ['Click = select/move piece']
  },
  {
    id: 6, name: 'The Liar\'s Island', roundId: 1, basePoints: 100, timeLimit: 240,
    difficulty: 3, mechanic: 'logic', isBoss: false,
    story: 'On this island, Knights always tell truth and Knaves always lie. Can you figure out who\'s who?',
    instructions: ['Solve 5 Knight/Knave logic puzzles', 'Knights always tell the truth', 'Knaves always lie', 'Build a streak for bonus points'],
    controls: ['Click = select answer']
  },
  {
    id: 7, name: 'Signal in the Static', roundId: 1, basePoints: 100, timeLimit: 240,
    difficulty: 3, mechanic: 'binary', isBoss: false,
    story: 'A distress signal in binary code crackles through the static. Decode the transmission to save a lost crew.',
    instructions: ['Decode binary strings to ASCII text', 'Use the reference table on the right', '5 rounds of increasing difficulty'],
    controls: ['Type = enter decoded value', 'Enter = submit answer']
  },
  {
    id: 8, name: 'The Ancient Gate', roundId: 1, basePoints: 200, timeLimit: 360,
    difficulty: 4, mechanic: 'logic-grid', isBoss: true,
    story: 'The massive gate to the Grand Line stands before you. Solve the Einstein\'s riddle to open it.',
    instructions: ['Place tokens in the 4x4 logic grid', 'Read constraint clues carefully', 'All items must be correctly assigned to columns', 'This is a BOSS level — worth double points!'],
    controls: ['Drag = place token', 'Double-click = return token', 'Check Solution = validate']
  },
  {
    id: 9, name: 'The Cipher Stone', roundId: 2, basePoints: 250, timeLimit: 480,
    difficulty: 3, mechanic: 'cipher', isBoss: false,
    story: 'An ancient stone tablet bears an encrypted message. Use the Caesar cipher to reveal its secrets.',
    instructions: ['Use the shift slider to decode the Caesar cipher', 'Find the correct shift value that reveals readable text', 'Submit the decoded plaintext'],
    controls: ['Slider = adjust shift', 'Type = enter decoded text', 'Enter = submit']
  },
  {
    id: 10, name: 'The Density Chamber', roundId: 2, basePoints: 250, timeLimit: 480,
    difficulty: 3, mechanic: 'sorting', isBoss: false,
    story: 'Beakers of different densities must be sorted. Swap them into ascending order — like a bubble sort!',
    instructions: ['Sort 8 beakers in ascending order', 'Click two beakers to swap them', 'Fewer swaps = higher score'],
    controls: ['Click = select beaker', 'Click another = swap']
  },
  {
    id: 11, name: 'The Infinite Kitchen', roundId: 2, basePoints: 250, timeLimit: 480,
    difficulty: 4, mechanic: 'queue', isBoss: false,
    story: 'Customers flood the kitchen! Serve them in order (FIFO) — but watch out for rush orders (LIFO)!',
    instructions: ['Serve customers in queue order (FIFO)', 'Rush orders go to a stack (serve first - LIFO)', 'Don\'t let customers lose patience and leave'],
    controls: ['SERVE button = serve front of queue', 'RUSH button = serve rush order stack']
  },
  {
    id: 12, name: 'The Haunted Lighthouse', roundId: 2, basePoints: 500, timeLimit: 480,
    difficulty: 5, mechanic: 'recursion', isBoss: true,
    story: 'The lighthouse holds a recursive puzzle. Choose your challenge — Fibonacci or Tower of Hanoi!',
    instructions: ['Choose between two recursive puzzles', 'Fibonacci: predict sequence and trace call stack', 'Tower of Hanoi: calculate moves and trace recursion', 'BOSS LEVEL — worth massive points!'],
    controls: ['Click = choose puzzle', 'Type = enter answers', 'Drag = fill call stack']
  },
  {
    id: 13, name: 'The Corrupted System', roundId: 3, basePoints: 500, timeLimit: 600,
    difficulty: 4, mechanic: 'debugging', isBoss: false,
    story: 'The ship\'s code system is corrupted! Find and fix 3 bugs in the Python code to bring it back online.',
    instructions: ['Find 3 bugs in the Python code', 'Click a buggy line to see fix options', 'Choose the correct fix for each bug'],
    controls: ['Click line = select for fixing', 'Click option = apply fix']
  },
  {
    id: 14, name: 'The Ice Wall', roundId: 3, basePoints: 500, timeLimit: 600,
    difficulty: 4, mechanic: 'optimization', isBoss: false,
    story: 'A glacier blocks your path, powered by slow O(n\u00B2) code. Optimize the algorithm to melt through!',
    instructions: ['Read the slow O(n\u00B2) code', 'Choose the optimal O(n) solution from 4 options', 'Correct optimization melts the ice wall'],
    controls: ['Click = select optimization option']
  },
  {
    id: 15, name: 'The One Code', roundId: 3, basePoints: 1000, timeLimit: 600,
    difficulty: 5, mechanic: 'recursion-trace', isBoss: true,
    story: 'The final vault. Only the one who can read the mind of the machine may claim the One Code.',
    instructions: ['Trace the recursive Python function', 'Determine the exact return value', 'No hints. No multiple choice. Pure reasoning.', 'FINAL BOSS — the ultimate challenge!'],
    controls: ['Type = enter the return value', 'Enter = submit answer']
  }
];
