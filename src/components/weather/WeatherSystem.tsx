import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useSharedValue,
  useEffect,
} from 'react-native-reanimated';
import { RainEffect } from './RainEffect';
import { SnowEffect } from './SnowEffect';
import { WEATHER_TINTS } from '../../constants/colors';
import { WeatherType } from '../../types';

interface Props {
  weather: WeatherType;
  intensity: number;
  isTransitioning: boolean;
}

export function WeatherSystem({ weather, intensity, isTransitioning }: Props) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isTransitioning) {
      opacity.value = withTiming(0.6, { duration: 1500 });
    } else {
      opacity.value = withTiming(1, { duration: 1500 });
    }
  }, [isTransitioning, opacity]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const tint = WEATHER_TINTS[weather];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {tint !== 'transparent' && (
        <Animated.View
          style={[StyleSheet.absoluteFill, overlayStyle, { backgroundColor: tint }]}
        />
      )}

      {weather === 'rainy' && <RainEffect intensity={intensity} />}
      {weather === 'snowy' && <SnowEffect intensity={intensity} />}
      {weather === 'rainbow' && <RainbowArc />}
      {weather === 'foggy' && <FogLayer intensity={intensity} />}
    </View>
  );
}

function RainbowArc() {
  const colors = ['#FF0000', '#FF7700', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'];
  return (
    <View style={[StyleSheet.absoluteFill, styles.rainbowContainer]} pointerEvents="none">
      {colors.map((color, i) => (
        <View
          key={i}
          style={[
            styles.rainbowBand,
            {
              borderColor: color.replace(')', ', 0.25)').replace('rgb', 'rgba'),
              borderRadius: 300 + i * 12,
              width: 600 + i * 24,
              height: 600 + i * 24,
              top: -(300 + i * 12),
              left: '50%',
              marginLeft: -(300 + i * 12),
            },
          ]}
        />
      ))}
    </View>
  );
}

function FogLayer({ intensity }: { intensity: number }) {
  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: `rgba(200, 210, 220, ${intensity * 0.3})`,
            top: '40%',
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: `rgba(200, 210, 220, ${intensity * 0.2})`,
            top: '60%',
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  rainbowContainer: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  rainbowBand: {
    position: 'absolute',
    borderWidth: 10,
    borderStyle: 'solid',
  },
});
