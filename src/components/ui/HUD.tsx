import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import { useWeatherStore } from '../../store/weatherStore';
import { ANIMAL_CONFIGS } from '../../constants/animals';

const WEATHER_ICONS: Record<string, string> = {
  sunny: '☀️',
  rainy: '🌧️',
  snowy: '❄️',
  rainbow: '🌈',
  cloudy: '☁️',
  foggy: '🌫️',
};

const TIME_ICONS: Record<string, string> = {
  midnight: '🌑',
  dawn: '🌅',
  morning: '🌤️',
  afternoon: '☀️',
  golden_hour: '🌇',
  dusk: '🌆',
  night: '🌙',
};

const SEASON_ICONS: Record<string, string> = {
  spring: '🌸',
  summer: '🌿',
  autumn: '🍂',
  winter: '❄️',
};

export function HUD() {
  const insets = useSafeAreaInsets();
  const { timeOfDay, season, discoveredAnimals, isPaused, togglePause } = useGameStore();
  const { current: weather } = useWeatherStore();

  return (
    <>
      {/* Top status bar */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <View style={styles.statusRow}>
          <StatusChip icon={TIME_ICONS[timeOfDay]} />
          <StatusChip icon={WEATHER_ICONS[weather]} />
          <StatusChip icon={SEASON_ICONS[season]} />
        </View>

        <TouchableOpacity onPress={togglePause} style={styles.pauseBtn}>
          <Text style={styles.pauseIcon}>{isPaused ? '▶' : '⏸'}</Text>
        </TouchableOpacity>
      </View>

      {/* Discovery counter */}
      <View style={[styles.discoveryBadge, { top: insets.top + 8, right: 70 }]}>
        <Text style={styles.discoveryText}>
          🐾 {discoveredAnimals.size}/{Object.keys(ANIMAL_CONFIGS).length}
        </Text>
      </View>
    </>
  );
}

function StatusChip({ icon }: { icon: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipIcon}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipIcon: {
    fontSize: 18,
  },
  pauseBtn: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: {
    color: '#fff',
    fontSize: 14,
  },
  discoveryBadge: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  discoveryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
