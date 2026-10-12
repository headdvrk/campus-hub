import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

import { useSettings } from '../context/SettingsContext';
import { languageNames } from '../i18n/translations';
import { themes } from '../theme/themes';
import { FONT_SCALES, FontScale, LANGUAGES, ThemeMode } from '../types/settings';
import {
  AppText,
  Card,
  FadeIn,
  ListGroup,
  ListRow,
  PressableScale,
  Screen,
  SegmentedControl,
} from '../components';
import { radius, spacing } from '../styles/theme';
import { useNativeDriver } from '../utils/motion';

const fontButtonLabel: Record<FontScale, string> = {
  small: 'A−',
  normal: 'A',
  large: 'A+',
};

function GroupLabel({ children }: { children: string }) {
  return (
    <AppText variant="footnote" color="muted" style={styles.groupLabel}>
      {children.toUpperCase()}
    </AppText>
  );
}

// Тақырыптың кішкентай "телефон" макеті
function ThemePreview({
  mode,
  label,
  selected,
  onPress,
}: {
  mode: ThemeMode;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useSettings();
  const palette = themes[mode];

  return (
    <PressableScale
      onPress={onPress}
      containerStyle={styles.flex}
      style={styles.previewItem}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
    >
      <View
        style={[
          styles.phone,
          {
            backgroundColor: palette.background,
            borderColor: selected ? colors.primary : colors.separator,
          },
        ]}
      >
        <View style={[styles.phoneHero, { backgroundColor: palette.primary }]} />
        <View style={[styles.phoneCard, { backgroundColor: palette.card }]}>
          <View style={[styles.phoneLine, { backgroundColor: palette.text, width: '70%' }]} />
          <View style={[styles.phoneLine, { backgroundColor: palette.muted, width: '45%' }]} />
        </View>
        <View style={[styles.phoneCard, { backgroundColor: palette.card }]}>
          <View style={[styles.phoneLine, { backgroundColor: palette.text, width: '55%' }]} />
          <View style={[styles.phoneLine, { backgroundColor: palette.muted, width: '35%' }]} />
        </View>
      </View>
      <AppText variant="subhead" center>
        {label}
      </AppText>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={selected ? colors.primary : colors.separator}
      />
    </PressableScale>
  );
}

// Төменнен шығып, біраздан кейін жоғалатын хабарлама
function Toast({ text, visible }: { text: string; visible: boolean }) {
  const { colors } = useSettings();
  const tabBarHeight = React.useContext(BottomTabBarHeightContext) ?? 0;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: visible ? 1 : 0,
      useNativeDriver,
      speed: 14,
      bounciness: 6,
    }).start();
  }, [progress, visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          bottom: tabBarHeight + spacing.md,
          backgroundColor: colors.text,
          opacity: progress,
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
          ],
        },
      ]}
    >
      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      <AppText variant="subhead" style={{ color: colors.background, fontWeight: '600' }}>
        {text}
      </AppText>
    </Animated.View>
  );
}

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
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 2200);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  const handleReset = () => {
    resetSettings();
    setToastVisible(true);
  };

  return (
    <View style={styles.flex}>
      <Screen title={t('tabSettings')}>
        <FadeIn delay={40}>
          <GroupLabel>{t('appearance')}</GroupLabel>
        </FadeIn>
        <FadeIn delay={70}>
          <Card style={styles.previewRow}>
            <ThemePreview
              mode="light"
              label={t('themeLight')}
              selected={theme === 'light'}
              onPress={() => setTheme('light')}
            />
            <ThemePreview
              mode="dark"
              label={t('themeDark')}
              selected={theme === 'dark'}
              onPress={() => setTheme('dark')}
            />
          </Card>
        </FadeIn>
        <FadeIn delay={100}>
          <ListGroup>
            <ListRow
              icon="moon"
              iconColors={['#5E5CE6', '#3634A3']}
              title={t('darkMode')}
              right={
                <Switch
                  value={theme === 'dark'}
                  onValueChange={(enabled) => setTheme(enabled ? 'dark' : 'light')}
                  trackColor={{ false: colors.input, true: colors.success }}
                  thumbColor="#FFFFFF"
                  // react-native-web қосулы күйдегі бегунок түсін бөлек алады
                  {...({ activeThumbColor: '#FFFFFF' } as object)}
                  accessibilityLabel={t('darkMode')}
                />
              }
            />
          </ListGroup>
        </FadeIn>

        <FadeIn delay={140}>
          <GroupLabel>{t('fontSize')}</GroupLabel>
        </FadeIn>
        <FadeIn delay={170}>
          <Card style={styles.fontCard}>
            <SegmentedControl
              options={FONT_SCALES.map((scale) => ({
                value: scale,
                label: fontButtonLabel[scale],
              }))}
              value={fontScale}
              onChange={setFontScale}
            />
            <View style={[styles.previewBox, { backgroundColor: colors.input }]}>
              <AppText variant="headline">{t('preview')}</AppText>
              <AppText>{t('previewText')}</AppText>
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={210}>
          <GroupLabel>{t('language')}</GroupLabel>
        </FadeIn>
        <FadeIn delay={240}>
          <SegmentedControl
            options={LANGUAGES.map((lang) => ({
              value: lang,
              label: languageNames[lang],
            }))}
            value={language}
            onChange={setLanguage}
          />
        </FadeIn>

        <FadeIn delay={280}>
          <ListGroup>
            <ListRow
              title={t('reset')}
              destructive
              chevron={false}
              onPress={handleReset}
            />
          </ListGroup>
          <View style={styles.hint}>
            <Ionicons name="cloud-done-outline" size={14} color={colors.muted} />
            <AppText variant="footnote" color="muted">
              {t('savedHint')}
            </AppText>
          </View>
        </FadeIn>
      </Screen>
      <Toast text={t('resetDone')} visible={toastVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  groupLabel: {
    marginLeft: spacing.md,
    marginBottom: -spacing.sm,
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.lg - 4,
  },
  previewItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  phone: {
    width: 84,
    height: 132,
    borderRadius: 16,
    borderWidth: 2.5,
    padding: 7,
    gap: 6,
    overflow: 'hidden',
  },
  phoneHero: {
    height: 34,
    borderRadius: 8,
    opacity: 0.9,
  },
  phoneCard: {
    borderRadius: 6,
    padding: 6,
    gap: 4,
  },
  phoneLine: {
    height: 5,
    borderRadius: 3,
  },
  fontCard: {
    gap: spacing.md,
  },
  previewBox: {
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md - 4,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 12,
    borderRadius: radius.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
});
