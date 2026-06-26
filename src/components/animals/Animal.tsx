import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useEffect,
} from 'react-native-reanimated';
import { Animal as AnimalType } from '../../types';
import { ANIMAL_CONFIGS } from '../../constants/animals';
import { useGameStore } from '../../store/gameStore';

interface Props {
  animal: AnimalType;
  onPress?: (animal: AnimalType) => void;
}

export function Animal({ animal, onPress }: Props) {
  const config = ANIMAL_CONFIGS[animal.species];
  const { discoverAnimal, mode } = useGameStore();

  const bobY = useSharedValue(0);
  const scale = useSharedValue(animal.scale);

  useEffect(() => {
    if (animal.behavior === 'walking') {
      bobY.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      );
    } else if (animal.behavior === 'playing') {
      bobY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 200 }),
          withTiming(0, { duration: 200 })
        ),
        -1,
        true
      );
    } else {
      bobY.value = withTiming(0, { duration: 300 });
    }
  }, [animal.behavior, bobY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bobY.value },
      { scaleX: animal.direction === 'left' ? -scale.value : scale.value },
      { scaleY: scale.value },
    ],
    opacity: animal.opacity,
  }));

  const handlePress = () => {
    discoverAnimal(animal.species);
    onPress?.(animal);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        animStyle,
        {
          left: animal.position.x,
          top: animal.position.y,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={mode === 'touch' ? 0.6 : 1}
        disabled={mode !== 'touch' && mode !== 'explore'}
      >
        <Text style={[styles.emoji, { fontSize: config.size * 0.6 }]}>
          {config.emoji}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  emoji: {
    textAlign: 'center',
  },
});
