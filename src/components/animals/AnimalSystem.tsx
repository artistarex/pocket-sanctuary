import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Animal } from './Animal';
import { useAnimals } from '../../hooks/useAnimals';
import { Animal as AnimalType } from '../../types';
import { ANIMAL_CONFIGS } from '../../constants/animals';

export function AnimalSystem() {
  const { animals } = useAnimals();

  const handleAnimalPress = useCallback((animal: AnimalType) => {
    const config = ANIMAL_CONFIGS[animal.species];
    Alert.alert(`${config.emoji} ${config.name}`, `Bir ${config.name.toLowerCase()} keşfettin!`, [
      { text: 'Harika!', style: 'default' },
    ]);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {animals.map((animal) => (
        <Animal key={animal.id} animal={animal} onPress={handleAnimalPress} />
      ))}
    </View>
  );
}
