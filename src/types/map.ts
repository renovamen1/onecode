export interface Island {
  id: number;
  name: string;
  position: { x: number; y: number };
  // `state` is computed at runtime in MapPage via the game store. The raw data
  // now omits it to avoid confusion. If a default is desired for editors, use
  // `defaultState` or simply ignore this field.
  zone: 'east-blue' | 'grand-line' | 'new-world';
  roundId: number;
  levelId: number;
  size: 'small' | 'medium' | 'large';
  isBoss: boolean;
}

export interface ShipPath {
  waypoints: { x: number; y: number }[];
}
