import React from 'react';
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
  FadeIn,
  ListGroup,
  ListRow,
  ProfileHeader,
  Screen,
} from '../components';

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
  const { theme, fontScale, language, t } = useSettings();
  const openSettings = () => navigation.navigate('Settings');

  // Шығу: тарихты тазалап, Login экранына қайтару
  const handleLogout = () => {
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <Screen title={t('tabProfile')}>
      <FadeIn>
        <ProfileHeader student={student} />
      </FadeIn>

      <FadeIn delay={80}>
        <AppText variant="footnote" color="muted" style={{ marginLeft: 16 }}>
          {t('studentInfo').toUpperCase()}
        </AppText>
      </FadeIn>
      <FadeIn delay={110}>
        <ListGroup>
          <ListRow
            icon="school"
            iconColors={['#0A84FF', '#0060DF']}
            title={t('program')}
            value={student.program[language]}
            stacked
          />
          <ListRow
            icon="people"
            iconColors={['#5E5CE6', '#3634A3']}
            title={t('group')}
            value={student.group}
          />
          <ListRow
            icon="ribbon"
            iconColors={['#FF9F0A', '#FF6B00']}
            title={t('course')}
            value={t('courseValue', { n: student.course })}
          />
        </ListGroup>
      </FadeIn>

      <FadeIn delay={170}>
        <AppText variant="footnote" color="muted" style={{ marginLeft: 16 }}>
          {t('currentSettings').toUpperCase()}
        </AppText>
      </FadeIn>
      <FadeIn delay={200}>
        <ListGroup>
          <ListRow
            icon={theme === 'dark' ? 'moon' : 'sunny'}
            iconColors={theme === 'dark' ? ['#5E5CE6', '#1C1C3C'] : ['#FFD60A', '#FF9F0A']}
            title={t('theme')}
            value={theme === 'dark' ? t('themeDark') : t('themeLight')}
            onPress={openSettings}
          />
          <ListRow
            icon="text"
            iconColors={['#0A84FF', '#0060DF']}
            title={t('fontSize')}
            value={t(fontScaleKey[fontScale])}
            onPress={openSettings}
          />
          <ListRow
            icon="language"
            iconColors={['#30D158', '#00A86B']}
            title={t('language')}
            value={languageNames[language]}
            onPress={openSettings}
          />
        </ListGroup>
      </FadeIn>

      <FadeIn delay={260}>
        <ListGroup>
          <ListRow title={t('logout')} destructive chevron={false} onPress={handleLogout} />
        </ListGroup>
      </FadeIn>
    </Screen>
  );
}
