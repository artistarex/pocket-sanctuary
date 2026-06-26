import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Snowflake {
  id: number;
  x: number;
  size: number;
  delay: number;
  speed: number;
  swayAmount: number;
}

interface Props {
  intensity: number;
}

const FLAKE_COUNT = 60;

export function SnowEffect({ intensity }: Props) {
  const { width, height } = useWindowDimensions();

  const [flakes] = useState<Snowflake[]>(() =>
    Array.from({ length: FLAKE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 4000,
      speed: 3000 + Math.random() * 4000,
      swayAmount: 20 + Math.random() * 40,
    }))
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {flakes.slice(0, Math.floor(FLAKE_COUNT * intensity)).map((flake) => (
        <Snowflake key={flake.id} flake={flake} screenHeight={height} />
      ))}
    </View>
  );
}

function Snowflake({ flake, screenHeight }: { flake: Snowflake; screenHeight: number }) {
  const translateY = useSharedValue(-flake.size);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      flake.delay,
      withRepeat(
        withTiming(screenHeight + flake.size, {
          duration: flake.speed,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    translateX.value = withRepeat(
      withTiming(flake.swayAmount, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [flake.delay, flake.speed, flake.swayAmount, screenHeight, translateX, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: 'absolute',
          left: flake.x,
          top: 0,
          width: flake.size,
          height: flake.size,
          borderRadius: flake.size / 2,
          backgroundColor: 'rgba(220, 235, 255, 0.85)',
        },
      ]}
    />
  );
}
