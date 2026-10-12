import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSettings } from '../context/SettingsContext';
import { languageNames } from '../i18n/translations';
import { FONT_SCALES, FontScale, LANGUAGES } from '../types/settings';
import { AppText, Card, OptionButton, PrimaryButton } from '../components';
import { spacing } from '../styles/theme';

const fontButtonLabel: Record<FontScale, string> = {
  small: 'A−',
  normal: 'A',
  large: 'A+',
};

export function SettingsScreen() {
  const {
    theme,
    fontScale,
    language,
    colors,
    setTheme,
    setFontScale,
    setLanguage,
    resetSettings,
    t,
  } = useSettings();
  const [showResetMessage, setShowResetMessage] = useState(false);

  useEffect(() => {
    if (!showResetMessage) return;
    const timer = setTimeout(() => setShowResetMessage(false), 2500);
    return () => clearTimeout(timer);
  }, [showResetMessage]);

  const handleReset = () => {
    resetSettings();
    setShowResetMessage(true);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Card>
        <AppText size="lg" bold>
          {t('theme')}
        </AppText>
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Ionicons
              name={theme === 'dark' ? 'moon' : 'sunny'}
              size={22}
              color={colors.primary}
            />
            <AppText>{theme === 'dark' ? t('themeDark') : t('themeLight')}</AppText>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={(enabled) => setTheme(enabled ? 'dark' : 'light')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
            accessibilityLabel={t('darkMode')}
          />
        </View>
      </Card>

      <Card>
        <AppText size="lg" bold>
          {t('fontSize')}
        </AppText>
        <View style={styles.optionRow}>
          {FONT_SCALES.map((scale) => (
            <OptionButton
              key={scale}
              label={fontButtonLabel[scale]}
              selected={fontScale === scale}
              onPress={() => setFontScale(scale)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <AppText size="lg" bold>
          {t('language')}
        </AppText>
        <View style={styles.optionRow}>
          {LANGUAGES.map((lang) => (
            <OptionButton
              key={lang}
              label={languageNames[lang]}
              selected={language === lang}
              onPress={() => setLanguage(lang)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <AppText size="lg" bold>
          {t('preview')}
        </AppText>
        <AppText>{t('previewText')}</AppText>
        <View style={styles.hint}>
          <Ionicons name="save-outline" size={16} color={colors.muted} />
          <AppText size="sm" color="muted" style={styles.flex}>
            {t('savedHint')}
          </AppText>
        </View>
      </Card>

      <PrimaryButton title={t('reset')} variant="outline" onPress={handleReset} />
      {showResetMessage ? (
        <AppText size="sm" color="muted" center>
          ✓ {t('resetDone')}
        </AppText>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  flex: {
    flex: 1,
  },
});
