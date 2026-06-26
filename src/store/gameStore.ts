import { create } from 'zustand';
import { GameMode, Season, TimeOfDay, WeatherType, AnimalSpecies } from '../types';

interface GameStore {
  mode: GameMode;
  season: Season;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  dayProgress: number;
  discoveredAnimals: Set<AnimalSpecies>;
  collectedItems: string[];
  totalRestTime: number;
  isPaused: boolean;

  setMode: (mode: GameMode) => void;
  setSeason: (season: Season) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setWeather: (weather: WeatherType) => void;
  setDayProgress: (progress: number) => void;
  discoverAnimal: (species: AnimalSpecies) => void;
  addCollectedItem: (item: string) => void;
  addRestTime: (seconds: number) => void;
  togglePause: () => void;
  advanceDay: () => void;
}

const TIME_SEQUENCE: TimeOfDay[] = [
  'midnight', 'dawn', 'morning', 'afternoon', 'golden_hour', 'dusk', 'night', 'midnight',
];

const SEASON_SEQUENCE: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export const useGameStore = create<GameStore>((set, get) => ({
  mode: 'explore',
  season: 'summer',
  timeOfDay: 'morning',
  weather: 'sunny',
  dayProgress: 0.3,
  discoveredAnimals: new Set(),
  collectedItems: [],
  totalRestTime: 0,
  isPaused: false,

  setMode: (mode) => set({ mode }),
  setSeason: (season) => set({ season }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setWeather: (weather) => set({ weather }),
  setDayProgress: (dayProgress) => set({ dayProgress }),

  discoverAnimal: (species) =>
    set((state) => ({
      discoveredAnimals: new Set([...state.discoveredAnimals, species]),
    })),

  addCollectedItem: (item) =>
    set((state) => ({ collectedItems: [...state.collectedItems, item] })),

  addRestTime: (seconds) =>
    set((state) => ({ totalRestTime: state.totalRestTime + seconds })),

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  advanceDay: () => {
    const { timeOfDay, season } = get();
    const currentIndex = TIME_SEQUENCE.indexOf(timeOfDay);
    const nextTime = TIME_SEQUENCE[(currentIndex + 1) % TIME_SEQUENCE.length];

    let nextSeason = season;
    if (nextTime === 'midnight' && currentIndex > 0) {
      const seasonIndex = SEASON_SEQUENCE.indexOf(season);
      // advance season every 7 game days (simplified: random chance)
      if (Math.random() < 0.14) {
        nextSeason = SEASON_SEQUENCE[(seasonIndex + 1) % SEASON_SEQUENCE.length];
      }
    }

    set({ timeOfDay: nextTime, season: nextSeason });
  },
}));
