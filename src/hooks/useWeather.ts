import { useEffect, useRef } from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { useGameStore } from '../store/gameStore';

const WEATHER_CHANGE_INTERVAL_MS = 4 * 60 * 1000; // every 4 real minutes
const TRANSITION_DURATION_MS = 3000;

export function useWeather() {
  const { current, isTransitioning, startTransition, updateTransitionProgress, completeTransition, rollRandomWeather, intensity } =
    useWeatherStore();
  const { season, isPaused, setWeather } = useGameStore();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setTimeout(() => {
      const nextWeather = rollRandomWeather(season);
      startTransition(nextWeather);
    }, WEATHER_CHANGE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, season, current, startTransition, rollRandomWeather]);

  useEffect(() => {
    if (!isTransitioning) return;

    const startTime = Date.now();

    transitionRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / TRANSITION_DURATION_MS, 1);
      updateTransitionProgress(progress);

      if (progress >= 1) {
        if (transitionRef.current) clearInterval(transitionRef.current);
        completeTransition();
        setWeather(useWeatherStore.getState().current);
      }
    }, 16);

    return () => {
      if (transitionRef.current) clearInterval(transitionRef.current);
    };
  }, [isTransitioning, updateTransitionProgress, completeTransition, setWeather]);

  return { weather: current, intensity, isTransitioning };
}
