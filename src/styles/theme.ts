// Түстер src/theme/themes.ts ішінде (ашық және қараңғы тақырып).
// Мұнда тақырыпқа тәуелсіз өлшемдер мен типография қалады.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

// Apple типографиясы ("Қалыпты" масштабта); useSettings().scale() арқылы өзгереді
export const typography = {
  largeTitle: { size: 34, weight: '700' },
  title1: { size: 28, weight: '700' },
  title2: { size: 22, weight: '700' },
  title3: { size: 20, weight: '600' },
  headline: { size: 17, weight: '600' },
  body: { size: 17, weight: '400' },
  callout: { size: 16, weight: '400' },
  subhead: { size: 15, weight: '400' },
  footnote: { size: 13, weight: '400' },
  caption: { size: 12, weight: '500' },
} as const;

export type TextVariant = keyof typeof typography;
