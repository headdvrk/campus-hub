import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppTheme, fontSizes, themes } from '../theme/themes';
import { TranslationKey, translations } from '../i18n/translations';
import {
  FONT_SCALES,
  FontScale,
  Language,
  LANGUAGES,
  Settings,
  THEME_MODES,
  ThemeMode,
} from '../types/settings';

type SettingsContextValue = Settings & {
  colors: AppTheme;
  fontSize: number;
  isReady: boolean;
  scale: (size: number) => number;
  setTheme: (value: ThemeMode) => void;
  setFontScale: (value: FontScale) => void;
  setLanguage: (value: Language) => void;
  resetSettings: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

const STORAGE_KEY = '@campus_hub_settings';

const initialSettings: Settings = {
  theme: 'light',
  fontScale: 'normal',
  language: 'kk',
};

// Алғашқы іске қосылғанда тақырып құрылғының жүйелік тақырыбынан алынады
function getDefaultSettings(): Settings {
  const system = Appearance.getColorScheme();
  return { ...initialSettings, theme: system === 'dark' ? 'dark' : 'light' };
}

// Сақталған JSON бүлінген болса, тек рұқсат етілген мәндер қабылданады
function parseSettings(raw: string, fallback: Settings): Settings {
  try {
    const data = JSON.parse(raw) as Partial<Settings>;
    return {
      theme: THEME_MODES.includes(data.theme as ThemeMode)
        ? (data.theme as ThemeMode)
        : fallback.theme,
      fontScale: FONT_SCALES.includes(data.fontScale as FontScale)
        ? (data.fontScale as FontScale)
        : fallback.fontScale,
      language: LANGUAGES.includes(data.language as Language)
        ? (data.language as Language)
        : fallback.language,
    };
  } catch {
    return fallback;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isReady, setIsReady] = useState(false);

  // Сақталған баптауларды қосымша ашылғанда бір рет жүктеу
  useEffect(() => {
    const loadSettings = async () => {
      const defaults = getDefaultSettings();
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        setSettings(saved ? parseSettings(saved, defaults) : defaults);
      } catch {
        setSettings(defaults);
      } finally {
        setIsReady(true);
      }
    };

    loadSettings();
  }, []);

  // settings өзгерген сайын JSON ретінде сақтау
  useEffect(() => {
    if (!isReady) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(
      (error) => console.warn('Settings save failed', error)
    );
  }, [settings, isReady]);

  const setTheme = useCallback(
    (theme: ThemeMode) => setSettings((current) => ({ ...current, theme })),
    []
  );

  const setFontScale = useCallback(
    (fontScale: FontScale) =>
      setSettings((current) => ({ ...current, fontScale })),
    []
  );

  const setLanguage = useCallback(
    (language: Language) =>
      setSettings((current) => ({ ...current, language })),
    []
  );

  const resetSettings = useCallback(
    () => setSettings(getDefaultSettings()),
    []
  );

  const value = useMemo<SettingsContextValue>(() => {
    const colors = themes[settings.theme];
    const fontSize = fontSizes[settings.fontScale];
    const ratio = fontSize / fontSizes.normal;
    const dictionary = translations[settings.language];

    return {
      ...settings,
      colors,
      fontSize,
      isReady,
      scale: (size) => Math.round(size * ratio),
      setTheme,
      setFontScale,
      setLanguage,
      resetSettings,
      t: (key, vars) =>
        Object.entries(vars ?? {}).reduce(
          (text, [name, val]) => text.replace(`{${name}}`, String(val)),
          dictionary[key]
        ),
    };
  }, [settings, isReady, setTheme, setFontScale, setLanguage, resetSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const value = useContext(SettingsContext);

  if (!value) {
    throw new Error('useSettings must be inside SettingsProvider');
  }

  return value;
}
