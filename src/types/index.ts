export type WeatherType = 'sunny' | 'rainy' | 'snowy' | 'rainbow' | 'cloudy' | 'foggy';

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'golden_hour' | 'dusk' | 'night' | 'midnight';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type GameMode = 'explore' | 'collect' | 'rest' | 'touch' | 'capture';

export type AnimalSpecies =
  | 'deer'
  | 'fox'
  | 'rabbit'
  | 'squirrel'
  | 'owl'
  | 'duck'
  | 'swan'
  | 'hedgehog'
  | 'frog'
  | 'koi'
  | 'butterfly';

export type AnimalBehavior = 'idle' | 'walking' | 'eating' | 'sleeping' | 'playing' | 'fleeing';

export interface Position {
  x: number;
  y: number;
}

export interface Animal {
  id: string;
  species: AnimalSpecies;
  position: Position;
  behavior: AnimalBehavior;
  direction: 'left' | 'right';
  scale: number;
  opacity: number;
}

export interface WeatherParticle {
  id: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

export interface GameState {
  mode: GameMode;
  season: Season;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  dayProgress: number; // 0–1, fraction of current day
  discoveredAnimals: Set<AnimalSpecies>;
  collectedItems: string[];
  totalRestTime: number; // seconds
}
