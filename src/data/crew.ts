import { CrewMember } from '../types/crew';

export const crew: CrewMember[] = [
  { id: 0, archetype: 'ZERO', role: 'Captain', spriteKey: 'zero', description: 'The fearless captain leading the voyage of reasoning.', colorScheme: '#FF6B6B', unlockedAtLevel: 0 },
  { id: 1, archetype: 'The Helmsman', role: 'Steering & Direction', spriteKey: 'helmsman', description: 'Keeps the ship on course through any storm.', colorScheme: '#FF8A65', unlockedAtLevel: 1 },
  { id: 2, archetype: 'The Navigator', role: 'Pathfinding', spriteKey: 'navigator', description: 'Finds hidden routes through fog and darkness.', colorScheme: '#42A5F5', unlockedAtLevel: 2 },
  { id: 3, archetype: 'The Gunner', role: 'Precision & Accuracy', spriteKey: 'gunner', description: 'Never misses the target. Master of precision.', colorScheme: '#1A1A2E', unlockedAtLevel: 3 },
  { id: 4, archetype: 'The Puzzler', role: 'Pattern Recognition', spriteKey: 'puzzler', description: 'Sees patterns where others see chaos.', colorScheme: '#4CAF50', unlockedAtLevel: 4 },
  { id: 5, archetype: 'The Philosopher', role: 'Logic & Deduction', spriteKey: 'philosopher', description: 'Master of truth tables and logical reasoning.', colorScheme: '#4ECDC4', unlockedAtLevel: 5 },
  { id: 6, archetype: 'The Engineer', role: 'Systems & Code', spriteKey: 'engineer', description: 'Builds and debugs the ship\'s systems.', colorScheme: '#AB47BC', unlockedAtLevel: 6 },
  { id: 7, archetype: 'The Scholar', role: 'Knowledge & Wisdom', spriteKey: 'scholar', description: 'Keeper of ancient algorithms and data structures.', colorScheme: '#FFB830', unlockedAtLevel: 7 }
];
