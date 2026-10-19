import { FontScale } from '../types/settings';

type Gradient = readonly [string, string];

// "Liquid Glass" (iOS 26) стилі ALT University брендімен: көк #005DAC, қою көк #091A2C,
// қызғылт сары #FF9900. Карточкалар mesh-градиент фонның үстіндегі мөлдір "шыны".
// Мәтін түстері фонның ең қанық жерінде де WCAG AA (≥ 4.5:1) талабынан өтеді
const light = {
  background: '#EEF3FA',
  // Мөлдір шыны беттер: карточкалар және тізімдер
  card: 'rgba(255, 255, 255, 0.66)',
  // Бұлдыр жолақтар (таб-бар, жинақы тақырып) үстіндегі реңк
  bar: 'rgba(255, 255, 255, 0.55)',
  elevated: '#FFFFFF',
  text: '#0B1B2B',
  muted: '#3D4756',
  primary: '#004C8C',
  // Шыны жиегіндегі жарық сызық
  border: 'rgba(255, 255, 255, 0.75)',
  separator: 'rgba(11, 27, 43, 0.12)',
  input: 'rgba(11, 27, 43, 0.06)',
  segmentThumb: '#FFFFFF',
  iconBackground: 'rgba(0, 93, 172, 0.12)',
  danger: '#A31218',
  success: '#1A6B2F',
  // Орташа балл (C, D) үшін
  warning: '#7A4300',
  accent: '#FF9900',
  onAccent: '#091A2C',
  onPrimary: '#FFFFFF',
  shadow: 'rgba(9, 26, 44, 0.10)',
  hero: ['#005DAC', '#091A2C'] as Gradient,
  blurTint: 'light' as 'light' | 'dark',
};

export const themes = {
  light,
  dark: {
    background: '#040B16',
    card: 'rgba(10, 20, 34, 0.55)',
    bar: 'rgba(10, 20, 34, 0.55)',
    elevated: '#14202F',
    text: '#FFFFFF',
    muted: '#C7D0DB',
    primary: '#9ACFFF',
    border: 'rgba(255, 255, 255, 0.14)',
    separator: 'rgba(255, 255, 255, 0.12)',
    input: 'rgba(255, 255, 255, 0.08)',
    segmentThumb: 'rgba(255, 255, 255, 0.22)',
    iconBackground: 'rgba(154, 207, 255, 0.16)',
    danger: '#FF8A80',
    success: '#4ADE80',
    warning: '#FFC266',
    accent: '#FF9900',
    onAccent: '#091A2C',
    onPrimary: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0)',
    hero: ['#005DAC', '#1A2F6B'] as Gradient,
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
