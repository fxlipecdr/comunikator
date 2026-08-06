export type ThemeMode = 'vibrant' | 'sensory_soft';

export interface ThemePalette {
  mode: ThemeMode;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
}

export const VIBRANT_PALETTE: ThemePalette = {
  mode: 'vibrant',
  background: '#F1F5F9',
  cardBackground: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  border: '#CBD5E1',
  accent: '#2563EB',
};

export const SENSORY_SOFT_PALETTE: ThemePalette = {
  mode: 'sensory_soft',
  background: '#F7F6F0', // Tom bege/creme suave anti-fotofobia
  cardBackground: '#EFECE6',
  textPrimary: '#2C302E',
  textSecondary: '#5C635F',
  border: '#D8D4CA',
  accent: '#7C9082', // Verde sábia suave
};
