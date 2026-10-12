import { FontScale } from '../types/settings';

type Gradient = readonly [string, string];

// Түстер Apple Human Interface Guidelines жүйелік палитрасына негізделген
const light = {
  background: '#F2F2F7',
  card: '#FFFFFF',
  elevated: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#8E8E93',
  primary: '#007AFF',
  border: 'rgba(60, 60, 67, 0.12)',
  separator: 'rgba(60, 60, 67, 0.18)',
  input: 'rgba(118, 118, 128, 0.12)',
  segmentThumb: '#FFFFFF',
  iconBackground: 'rgba(0, 122, 255, 0.12)',
  danger: '#FF3B30',
  success: '#34C759',
  onPrimary: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.08)',
  hero: ['#007AFF', '#5856D6'] as Gradient,
  blurTint: 'light' as 'light' | 'dark',
};

export const themes = {
  light,
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    elevated: '#2C2C2E',
    text: '#FFFFFF',
    muted: '#98989F',
    primary: '#0A84FF',
    border: 'rgba(84, 84, 88, 0.45)',
    separator: 'rgba(84, 84, 88, 0.6)',
    input: 'rgba(118, 118, 128, 0.24)',
    segmentThumb: '#636366',
    iconBackground: 'rgba(10, 132, 255, 0.2)',
    danger: '#FF453A',
    success: '#30D158',
    onPrimary: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0)',
    hero: ['#0A84FF', '#BF5AF2'] as Gradient,
    blurTint: 'dark' as 'light' | 'dark',
  } satisfies typeof light,
};

export type AppTheme = typeof themes.light;

// Негізгі мәтіннің өлшемі (px): A− / A / A+
export const fontSizes: Record<FontScale, number> = {
  small: 14,
  normal: 17,
  large: 21,
};
