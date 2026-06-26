import { TimeOfDay, WeatherType, Season } from '../types';

export const PALETTE = {
  warmAmber: '#F5A623',
  forestGreen: '#2D5A27',
  deepEmerald: '#1B4332',
  softBlue: '#A8C5DA',
  cream: '#FFF8E7',
  earthBrown: '#8B5E3C',
  softLavender: '#C3A8D1',
  fireGlow: '#FF6B35',
  moonWhite: '#E8EFF5',
  waterTeal: '#4A9B8E',
  mistyGray: '#B0BEC5',
  sunsetPink: '#F48B7D',
} as const;

export const SKY_COLORS: Record<TimeOfDay, { top: string; bottom: string }> = {
  dawn: { top: '#1a1035', bottom: '#e87461' },
  morning: { top: '#87CEEB', bottom: '#FFF0C8' },
  afternoon: { top: '#4A90D9', bottom: '#87CEEB' },
  golden_hour: { top: '#FF8C00', bottom: '#FFD700' },
  dusk: { top: '#2D1B69', bottom: '#FF6B6B' },
  night: { top: '#0a0a2e', bottom: '#1a1a4e' },
  midnight: { top: '#050510', bottom: '#0a0a2e' },
};

export const WEATHER_TINTS: Record<WeatherType, string> = {
  sunny: 'transparent',
  rainy: 'rgba(70, 100, 130, 0.25)',
  snowy: 'rgba(200, 220, 255, 0.20)',
  rainbow: 'transparent',
  cloudy: 'rgba(100, 110, 120, 0.30)',
  foggy: 'rgba(200, 210, 220, 0.45)',
};

export const SEASON_FOLIAGE: Record<Season, string[]> = {
  spring: ['#7BC67E', '#A8E6A3', '#C8F5CC'],
  summer: ['#2D6A4F', '#40916C', '#52B788'],
  autumn: ['#D4780A', '#E09B3D', '#C05C1A'],
  winter: ['#8FA8A8', '#B0C4C4', '#D0DEDE'],
};
