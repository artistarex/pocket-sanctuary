import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Season } from '../../types';
import { SEASON_FOLIAGE } from '../../constants/colors';

interface Props {
  season: Season;
}

export function ForestLayer({ season }: Props) {
  const { width, height } = useWindowDimensions();
  const foliageColors = SEASON_FOLIAGE[season];

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]} pointerEvents="none">
      {/* Background tree silhouettes */}
      <View style={[styles.treeLine, { bottom: height * 0.3 }]}>
        {BG_TREES.map((tree, i) => (
          <TreeSilhouette
            key={i}
            x={tree.x * width}
            height={tree.height * height}
            width={tree.width}
            color={foliageColors[0] + '99'}
            swayDelay={tree.swayDelay}
          />
        ))}
      </View>

      {/* Midground trees */}
      <View style={[styles.treeLine, { bottom: height * 0.25 }]}>
        {MG_TREES.map((tree, i) => (
          <TreeSilhouette
            key={i}
            x={tree.x * width}
            height={tree.height * height}
            width={tree.width}
            color={foliageColors[1]}
            swayDelay={tree.swayDelay}
          />
        ))}
      </View>

      {/* Ground strip */}
      <View
        style={[
          styles.ground,
          {
            bottom: 0,
            height: height * 0.28,
            backgroundColor: season === 'winter' ? '#6B8A8A' : '#2D5A27',
          },
        ]}
      />

      {/* Water pond */}
      <View
        style={[
          styles.pond,
          {
            bottom: height * 0.18,
            left: width * 0.35,
            width: width * 0.3,
            height: height * 0.08,
          },
        ]}
      />

      {/* Foreground bush row */}
      <View style={[styles.treeLine, { bottom: height * 0.22 }]}>
        {FG_BUSHES.map((bush, i) => (
          <Bush
            key={i}
            x={bush.x * width}
            size={bush.size}
            color={foliageColors[2]}
          />
        ))}
      </View>

      {/* Cabin */}
      <Cabin bottom={height * 0.28} left={width * 0.65} />

      {/* Campfire */}
      <Campfire bottom={height * 0.27} left={width * 0.45} />
    </View>
  );
}

function TreeSilhouette({
  x, height: h, width: w, color, swayDelay,
}: {
  x: number; height: number; width: number; color: string; swayDelay: number;
}) {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2500 + swayDelay * 0.5, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1.5, { duration: 2500 + swayDelay * 0.5, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [rotate, swayDelay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
    transformOrigin: 'bottom center',
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: 'absolute',
          left: x,
          bottom: 0,
          width: w,
          height: h,
          backgroundColor: color,
          borderTopLeftRadius: w * 0.5,
          borderTopRightRadius: w * 0.5,
        },
      ]}
    />
  );
}

function Bush({ x, size, color }: { x: number; size: number; color: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        bottom: 0,
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: size * 0.5,
      }}
    />
  );
}

function Cabin({ bottom, left }: { bottom: number; left: number }) {
  return (
    <View style={{ position: 'absolute', bottom, left }}>
      {/* Roof */}
      <View style={styles.cabinRoof} />
      {/* Walls */}
      <View style={styles.cabinWall}>
        {/* Window glow */}
        <View style={styles.cabinWindow} />
      </View>
    </View>
  );
}

function Campfire({ bottom, left }: { bottom: number; left: number }) {
  const flickerOpacity = useSharedValue(1);

  useEffect(() => {
    flickerOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 150 }),
        withTiming(1, { duration: 200 }),
        withTiming(0.8, { duration: 100 })
      ),
      -1,
      true
    );
  }, [flickerOpacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: flickerOpacity.value }));

  return (
    <Animated.View style={[{ position: 'absolute', bottom, left }, animStyle]}>
      <View style={styles.fireBase} />
      <View style={styles.fireFlame} />
    </Animated.View>
  );
}

const BG_TREES = [
  { x: 0.02, height: 0.22, width: 45, swayDelay: 0 },
  { x: 0.1, height: 0.26, width: 55, swayDelay: 300 },
  { x: 0.2, height: 0.20, width: 40, swayDelay: 600 },
  { x: 0.55, height: 0.24, width: 50, swayDelay: 150 },
  { x: 0.7, height: 0.28, width: 60, swayDelay: 450 },
  { x: 0.85, height: 0.22, width: 45, swayDelay: 200 },
  { x: 0.95, height: 0.25, width: 50, swayDelay: 700 },
];

const MG_TREES = [
  { x: 0.0, height: 0.18, width: 55, swayDelay: 100 },
  { x: 0.08, height: 0.21, width: 60, swayDelay: 400 },
  { x: 0.75, height: 0.19, width: 58, swayDelay: 250 },
  { x: 0.88, height: 0.23, width: 65, swayDelay: 550 },
];

const FG_BUSHES = [
  { x: 0.0, size: 70 },
  { x: 0.12, size: 55 },
  { x: 0.25, size: 65 },
  { x: 0.67, size: 60 },
  { x: 0.78, size: 75 },
  { x: 0.9, size: 50 },
];

const styles = StyleSheet.create({
  treeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pond: {
    position: 'absolute',
    backgroundColor: '#4A9B8E',
    borderRadius: 60,
    opacity: 0.75,
  },
  cabinRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 35,
    borderRightWidth: 35,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#5C3D1E',
  },
  cabinWall: {
    width: 60,
    height: 45,
    backgroundColor: '#8B5E3C',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  cabinWindow: {
    width: 16,
    height: 16,
    backgroundColor: '#FFD280',
    opacity: 0.9,
    borderRadius: 2,
    marginBottom: 5,
  },
  fireBase: {
    width: 20,
    height: 8,
    backgroundColor: '#8B5E3C',
    borderRadius: 4,
    alignSelf: 'center',
  },
  fireFlame: {
    width: 14,
    height: 20,
    backgroundColor: '#FF6B35',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    alignSelf: 'center',
    marginBottom: -2,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});
