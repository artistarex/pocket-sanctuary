import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface RainDrop {
  id: number;
  x: number;
  delay: number;
  speed: number;
  opacity: number;
  length: number;
}

interface Props {
  intensity: number; // 0–1
}

const DROP_COUNT = 80;

export function RainEffect({ intensity }: Props) {
  const { width, height } = useWindowDimensions();

  const [drops] = useState<RainDrop[]>(() =>
    Array.from({ length: DROP_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      delay: Math.random() * 2000,
      speed: 800 + Math.random() * 600,
      opacity: 0.3 + Math.random() * 0.5,
      length: 15 + Math.random() * 25,
    }))
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {drops.slice(0, Math.floor(DROP_COUNT * intensity)).map((drop) => (
        <RainDrop key={drop.id} drop={drop} screenHeight={height} />
      ))}
    </View>
  );
}

function RainDrop({ drop, screenHeight }: { drop: RainDrop; screenHeight: number }) {
  const translateY = useSharedValue(-drop.length);

  useEffect(() => {
    translateY.value = withDelay(
      drop.delay,
      withRepeat(
        withTiming(screenHeight + drop.length, {
          duration: drop.speed,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [drop.delay, drop.speed, screenHeight, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: 'absolute',
          left: drop.x,
          top: 0,
          width: 1.5,
          height: drop.length,
          backgroundColor: `rgba(180, 210, 240, ${drop.opacity})`,
          transform: [{ skewX: '-15deg' }],
        },
      ]}
    />
  );
}
