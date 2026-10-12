export type ThemeMode = 'light' | 'dark';

export type FontScale = 'small' | 'normal' | 'large';

export type Language = 'kk' | 'ru' | 'en';

export type Settings = {
  theme: ThemeMode;
  fontScale: FontScale;
  language: Language;
};

export const THEME_MODES: ThemeMode[] = ['light', 'dark'];
export const FONT_SCALES: FontScale[] = ['small', 'normal', 'large'];
export const LANGUAGES: Language[] = ['kk', 'ru', 'en'];
