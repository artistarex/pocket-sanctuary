import { create } from 'zustand';
import { Animal, AnimalSpecies, AnimalBehavior } from '../types';
import { ANIMAL_CONFIGS } from '../constants/animals';

interface AnimalStore {
  animals: Animal[];
  addAnimal: (animal: Animal) => void;
  removeAnimal: (id: string) => void;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  clearAnimals: () => void;
  spawnAnimal: (species: AnimalSpecies, screenWidth: number, screenHeight: number) => void;
}

let animalIdCounter = 0;

export const useAnimalStore = create<AnimalStore>((set, get) => ({
  animals: [],

  addAnimal: (animal) =>
    set((state) => ({ animals: [...state.animals, animal] })),

  removeAnimal: (id) =>
    set((state) => ({ animals: state.animals.filter((a) => a.id !== id) })),

  updateAnimal: (id, updates) =>
    set((state) => ({
      animals: state.animals.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  clearAnimals: () => set({ animals: [] }),

  spawnAnimal: (species, screenWidth, screenHeight) => {
    const config = ANIMAL_CONFIGS[species];
    const existing = get().animals.filter((a) => a.species === species);
    if (existing.length >= config.maxCount) return;
    if (Math.random() > config.spawnChance) return;

    const zones = {
      ground: { y: screenHeight * 0.62, yVariance: screenHeight * 0.08 },
      water: { y: screenHeight * 0.72, yVariance: screenHeight * 0.04 },
      air: { y: screenHeight * 0.35, yVariance: screenHeight * 0.12 },
      tree: { y: screenHeight * 0.45, yVariance: screenHeight * 0.06 },
    };

    const zone = zones[config.preferredZone];
    const fromRight = Math.random() > 0.5;

    const behaviors: AnimalBehavior[] = ['idle', 'walking', 'eating', 'playing'];
    const randomBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];

    const newAnimal: Animal = {
      id: `animal_${++animalIdCounter}`,
      species,
      position: {
        x: fromRight ? screenWidth + config.size : -config.size,
        y: zone.y + (Math.random() - 0.5) * zone.yVariance,
      },
      behavior: randomBehavior,
      direction: fromRight ? 'left' : 'right',
      scale: 0.8 + Math.random() * 0.4,
      opacity: 0,
    };

    get().addAnimal(newAnimal);
  },
}));
