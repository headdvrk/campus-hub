import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { student } from '../data/student';
import { useSettings } from '../context/SettingsContext';
import { languageNames } from '../i18n/translations';
import {
  AppText,
  Card,
  InfoRow,
  PrimaryButton,
  ProfileHeader,
} from '../components';
import { spacing } from '../styles/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const fontScaleKey = {
  small: 'fontSmall',
  normal: 'fontNormal',
  large: 'fontLarge',
} as const;

export function ProfileScreen({ navigation }: Props) {
  const { colors, theme, fontScale, language, t } = useSettings();

  // Шығу: тарихты тазалап, Login экранына қайтару
  const handleLogout = () => {
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <ProfileHeader student={student} />

      <Card style={styles.infoCard}>
        <InfoRow icon="school-outline" label={t('program')} value={student.program[language]} />
        <InfoRow icon="people-outline" label={t('group')} value={student.group} />
        <InfoRow
          icon="ribbon-outline"
          label={t('course')}
          value={t('courseValue', { n: student.course })}
        />
      </Card>

      <Card>
        <AppText size="lg" bold>
          {t('currentSettings')}
        </AppText>
        <InfoRow
          icon={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
          label={t('theme')}
          value={theme === 'dark' ? t('themeDark') : t('themeLight')}
        />
        <InfoRow
          icon="text-outline"
          label={t('fontSize')}
          value={t(fontScaleKey[fontScale])}
        />
        <InfoRow
          icon="language-outline"
          label={t('language')}
          value={languageNames[language]}
        />
      </Card>

      <PrimaryButton title={t('logout')} variant="danger" onPress={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  infoCard: {
    paddingVertical: spacing.sm,
    gap: 0,
  },
});
