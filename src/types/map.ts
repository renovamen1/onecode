export interface Island {
  id: number;
  name: string;
  position: { x: number; y: number };
  state: 'locked' | 'active' | 'complete' | 'boss';
  zone: 'east-blue' | 'grand-line' | 'new-world';
  roundId: number;
  levelId: number;
  size: 'small' | 'medium' | 'large';
  isBoss: boolean;
}

export interface ShipPath {
  waypoints: { x: number; y: number }[];
}
