import React, { useEffect } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TimeOfDay } from '../../types';
import { SKY_COLORS } from '../../constants/colors';

interface Props {
  timeOfDay: TimeOfDay;
  dayProgress: number;
}

export function SkyLayer({ timeOfDay, dayProgress }: Props) {
  const { width, height } = useWindowDimensions();
  const colors = SKY_COLORS[timeOfDay];

  const sunY = useSharedValue(0);
  const moonY = useSharedValue(0);
  const starOpacity = useSharedValue(0);

  useEffect(() => {
    const isNight = timeOfDay === 'night' || timeOfDay === 'midnight' || timeOfDay === 'dawn';
    // Sun arcs from bottom to top to bottom across day
    const sunProgress = dayProgress < 0.5 ? dayProgress * 2 : 2 - dayProgress * 2;
    sunY.value = withTiming(height * (1 - sunProgress * 0.7), { duration: 2000 });
    moonY.value = withTiming(isNight ? height * 0.15 : -100, { duration: 2000 });
    starOpacity.value = withTiming(isNight ? 1 : 0, { duration: 3000 });
  }, [timeOfDay, dayProgress, height, sunY, moonY, starOpacity]);

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sunY.value }],
  }));
  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: moonY.value }],
  }));
  const starStyle = useAnimatedStyle(() => ({ opacity: starOpacity.value }));

  return (
    <LinearGradient
      colors={[colors.top, colors.bottom]}
      style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
    >
      {/* Stars */}
      <Animated.View style={[StyleSheet.absoluteFill, starStyle]} pointerEvents="none">
        {STAR_POSITIONS.map((star, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: star.x * width,
              top: star.y * height * 0.6,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              backgroundColor: `rgba(255, 255, 240, ${star.opacity})`,
            }}
          />
        ))}
      </Animated.View>

      {/* Sun */}
      <Animated.View style={[styles.celestialBody, { right: width * 0.2 }, sunStyle]} pointerEvents="none">
        <Animated.View style={styles.sun} />
      </Animated.View>

      {/* Moon */}
      <Animated.View style={[styles.celestialBody, { right: width * 0.25 }, moonStyle]} pointerEvents="none">
        <Animated.View style={styles.moon} />
      </Animated.View>
    </LinearGradient>
  );
}

const STAR_POSITIONS = Array.from({ length: 40 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: 1 + Math.random() * 2.5,
  opacity: 0.4 + Math.random() * 0.6,
}));

const styles = StyleSheet.create({
  celestialBody: {
    position: 'absolute',
  },
  sun: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
  },
  moon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8EFF5',
    shadowColor: '#B0C0D0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
});
