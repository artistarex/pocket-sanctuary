import { useEffect, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useAnimalStore } from '../store/animalStore';
import { useGameStore } from '../store/gameStore';
import { ANIMAL_CONFIGS } from '../constants/animals';
import { AnimalSpecies } from '../types';

const SPAWN_INTERVAL_MS = 8000;
const MOVE_INTERVAL_MS = 50;

const ALL_SPECIES = Object.keys(ANIMAL_CONFIGS) as AnimalSpecies[];

export function useAnimals() {
  const { width, height } = useWindowDimensions();
  const { animals, spawnAnimal, updateAnimal, removeAnimal } = useAnimalStore();
  const { timeOfDay, weather, isPaused } = useGameStore();

  const getEligibleSpecies = useCallback((): AnimalSpecies[] => {
    return ALL_SPECIES.filter((species) => {
      const config = ANIMAL_CONFIGS[species];
      const rightTime = config.activeAt.includes(timeOfDay);
      const okWeather = !config.avoidWeather.includes(weather);
      return rightTime && okWeather;
    });
  }, [timeOfDay, weather]);

  // Spawn loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const eligible = getEligibleSpecies();
      if (eligible.length === 0) return;
      const species = eligible[Math.floor(Math.random() * eligible.length)];
      spawnAnimal(species, width, height);
    }, SPAWN_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPaused, getEligibleSpecies, spawnAnimal, width, height]);

  // Movement & lifecycle loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      animals.forEach((animal) => {
        const config = ANIMAL_CONFIGS[animal.species];
        const dt = MOVE_INTERVAL_MS / 1000;

        // Fade in
        if (animal.opacity < 1) {
          const newOpacity = Math.min(animal.opacity + dt * 0.5, 1);
          updateAnimal(animal.id, { opacity: newOpacity });
          return;
        }

        if (animal.behavior === 'idle' || animal.behavior === 'sleeping') {
          if (Math.random() < 0.002) {
            updateAnimal(animal.id, { behavior: 'walking' });
          }
          return;
        }

        const speed = config.speed;
        const dx = animal.direction === 'right' ? speed * dt : -speed * dt;
        const newX = animal.position.x + dx;

        if (newX > width + config.size * 2 || newX < -config.size * 2) {
          updateAnimal(animal.id, { opacity: 0 });
          setTimeout(() => removeAnimal(animal.id), 500);
          return;
        }

        updateAnimal(animal.id, { position: { ...animal.position, x: newX } });

        if (Math.random() < 0.003) {
          updateAnimal(animal.id, { behavior: 'idle' });
          setTimeout(() => updateAnimal(animal.id, { behavior: 'walking' }), 2000 + Math.random() * 3000);
        }
      });
    }, MOVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPaused, animals, updateAnimal, removeAnimal, width]);

  return { animals };
}
