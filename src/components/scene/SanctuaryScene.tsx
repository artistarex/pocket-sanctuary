import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkyLayer } from './SkyLayer';
import { ForestLayer } from './ForestLayer';
import { WeatherSystem } from '../weather/WeatherSystem';
import { AnimalSystem } from '../animals/AnimalSystem';
import { useGameStore } from '../../store/gameStore';
import { useWeatherStore } from '../../store/weatherStore';
import { useDayNightCycle } from '../../hooks/useDayNightCycle';
import { useWeather } from '../../hooks/useWeather';

export function SanctuaryScene() {
  const { season } = useGameStore();
  const { current: weather, intensity, isTransitioning } = useWeatherStore();

  const { timeOfDay, dayProgress } = useDayNightCycle();
  useWeather();

  return (
    <View style={styles.scene}>
      <SkyLayer timeOfDay={timeOfDay} dayProgress={dayProgress} />
      <ForestLayer season={season} />
      <AnimalSystem />
      <WeatherSystem weather={weather} intensity={intensity} isTransitioning={isTransitioning} />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    overflow: 'hidden',
  },
});
