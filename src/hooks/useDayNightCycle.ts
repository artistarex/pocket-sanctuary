import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { TimeOfDay } from '../types';

// One real-world second = this many game minutes
const GAME_TIME_SCALE = 2;
const GAME_DAY_DURATION_SECONDS = (24 * 60) / GAME_TIME_SCALE; // ~720 real seconds = 12 min

const TIME_THRESHOLDS: Array<{ threshold: number; time: TimeOfDay }> = [
  { threshold: 0.0, time: 'midnight' },
  { threshold: 0.1, time: 'dawn' },
  { threshold: 0.2, time: 'morning' },
  { threshold: 0.45, time: 'afternoon' },
  { threshold: 0.65, time: 'golden_hour' },
  { threshold: 0.75, time: 'dusk' },
  { threshold: 0.85, time: 'night' },
  { threshold: 0.95, time: 'midnight' },
];

function progressToTimeOfDay(progress: number): TimeOfDay {
  let result: TimeOfDay = 'midnight';
  for (const { threshold, time } of TIME_THRESHOLDS) {
    if (progress >= threshold) result = time;
  }
  return result;
}

export function useDayNightCycle() {
  const { dayProgress, setDayProgress, setTimeOfDay, timeOfDay, isPaused } = useGameStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(dayProgress);

  useEffect(() => {
    progressRef.current = dayProgress;
  }, [dayProgress]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      progressRef.current = (progressRef.current + 1 / GAME_DAY_DURATION_SECONDS) % 1;
      setDayProgress(progressRef.current);

      const newTime = progressToTimeOfDay(progressRef.current);
      if (newTime !== timeOfDay) {
        setTimeOfDay(newTime);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, timeOfDay, setDayProgress, setTimeOfDay]);

  return { dayProgress, timeOfDay };
}
