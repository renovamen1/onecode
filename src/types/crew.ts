export interface CrewMember {
  id: number;
  archetype: string;
  role: string;
  spriteKey: string;
  description: string;
  colorScheme: string;
  unlockedAtLevel: number;
  isUnlocked?: boolean;
}
