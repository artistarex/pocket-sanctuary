import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SanctuaryScene } from '../src/components/scene/SanctuaryScene';
import { HUD } from '../src/components/ui/HUD';
import { ModeSelector } from '../src/components/ui/ModeSelector';

export default function SanctuaryScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <SanctuaryScene />
      <HUD />
      <ModeSelector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a2e',
  },
});
