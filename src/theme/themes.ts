import { FontScale } from '../types/settings';

export const themes = {
  light: {
    background: '#F4F8FC',
    card: '#FFFFFF',
    text: '#102A43',
    primary: '#0B66E4',
    muted: '#627D98',
    border: '#D9E2EC',
    iconBackground: '#E8F1FD',
    danger: '#DC2626',
    onPrimary: '#FFFFFF',
  },
  dark: {
    background: '#101827',
    card: '#1B2638',
    text: '#F7FAFC',
    primary: '#20C5F5',
    muted: '#9FB3C8',
    border: '#2C3A52',
    iconBackground: '#22324A',
    danger: '#F87171',
    onPrimary: '#101827',
  },
};

export type AppTheme = typeof themes.light;

// Негізгі мәтіннің өлшемі (px)
export const fontSizes: Record<FontScale, number> = {
  small: 14,
  normal: 17,
  large: 21,
};
