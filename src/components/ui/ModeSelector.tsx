import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import { GameMode } from '../../types';

const MODES: Array<{ mode: GameMode; icon: string; label: string }> = [
  { mode: 'explore', icon: '🗺️', label: 'Keşfet' },
  { mode: 'collect', icon: '🌿', label: 'Topla' },
  { mode: 'rest', icon: '😌', label: 'Dinlen' },
  { mode: 'touch', icon: '🤝', label: 'Dokun' },
  { mode: 'capture', icon: '📸', label: 'Fotoğraf' },
];

export function ModeSelector() {
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useGameStore();

  return (
    <View style={[styles.container, { bottom: insets.bottom + 16 }]}>
      {MODES.map((item) => (
        <TouchableOpacity
          key={item.mode}
          onPress={() => setMode(item.mode)}
          style={[styles.modeBtn, mode === item.mode && styles.modeActive]}
          activeOpacity={0.8}
        >
          <Text style={styles.modeIcon}>{item.icon}</Text>
          <Text style={[styles.modeLabel, mode === item.mode && styles.modeLabelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 25, 15, 0.75)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 8,
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeBtn: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 54,
  },
  modeActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  modeIcon: {
    fontSize: 20,
  },
  modeLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  modeLabelActive: {
    color: '#fff',
  },
});
