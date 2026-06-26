import { create } from 'zustand';
import { WeatherType } from '../types';

interface WeatherTransition {
  from: WeatherType;
  to: WeatherType;
  progress: number; // 0–1
}

interface WeatherStore {
  current: WeatherType;
  next: WeatherType | null;
  transition: WeatherTransition | null;
  intensity: number; // 0–1, how heavy rain/snow is
  isTransitioning: boolean;

  startTransition: (to: WeatherType) => void;
  updateTransitionProgress: (progress: number) => void;
  completeTransition: () => void;
  setIntensity: (intensity: number) => void;
  rollRandomWeather: (season: string) => WeatherType;
}

const WEATHER_WEIGHTS: Record<string, Array<{ weather: WeatherType; weight: number }>> = {
  spring: [
    { weather: 'sunny', weight: 40 },
    { weather: 'rainy', weight: 30 },
    { weather: 'cloudy', weight: 20 },
    { weather: 'rainbow', weight: 10 },
  ],
  summer: [
    { weather: 'sunny', weight: 60 },
    { weather: 'cloudy', weight: 20 },
    { weather: 'rainy', weight: 15 },
    { weather: 'rainbow', weight: 5 },
  ],
  autumn: [
    { weather: 'cloudy', weight: 35 },
    { weather: 'rainy', weight: 30 },
    { weather: 'foggy', weight: 20 },
    { weather: 'sunny', weight: 15 },
  ],
  winter: [
    { weather: 'snowy', weight: 45 },
    { weather: 'cloudy', weight: 30 },
    { weather: 'foggy', weight: 15 },
    { weather: 'sunny', weight: 10 },
  ],
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  current: 'sunny',
  next: null,
  transition: null,
  intensity: 0.5,
  isTransitioning: false,

  startTransition: (to) => {
    const { current } = get();
    if (current === to) return;
    set({
      next: to,
      isTransitioning: true,
      transition: { from: current, to, progress: 0 },
    });
  },

  updateTransitionProgress: (progress) =>
    set((state) => ({
      transition: state.transition ? { ...state.transition, progress } : null,
    })),

  completeTransition: () => {
    const { next } = get();
    set({
      current: next ?? get().current,
      next: null,
      transition: null,
      isTransitioning: false,
    });
  },

  setIntensity: (intensity) => set({ intensity }),

  rollRandomWeather: (season) => {
    const weights = WEATHER_WEIGHTS[season] ?? WEATHER_WEIGHTS.summer;
    const total = weights.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * total;
    for (const entry of weights) {
      roll -= entry.weight;
      if (roll <= 0) return entry.weather;
    }
    return 'sunny';
  },
}));
