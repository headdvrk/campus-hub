import React from 'react';
import { Linking } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { facultyKey } from '../types/profile';
import { useSettings } from '../context/SettingsContext';
import { useAuth, useProfile } from '../context/AuthContext';
import { overallGpa } from './JournalScreen';
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
  const { signOut } = useAuth();
  const profile = useProfile();
  const openSettings = () => navigation.navigate('Settings');

  return (
    <Screen title={t('tabProfile')}>
      <FadeIn>
        <ProfileHeader profile={profile} />
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
            iconColors={['#005DAC', '#091A2C']}
            title={t('authFaculty')}
            value={t(facultyKey[profile.faculty])}
            stacked
          />
          <ListRow
            icon="people"
            iconColors={['#5E5CE6', '#3634A3']}
            title={t('group')}
            value={profile.group}
          />
          <ListRow
            icon="ribbon"
            iconColors={['#FF9900', '#C46A00']}
            title={t('transcript')}
            value={`GPA ${overallGpa?.toFixed(2) ?? '—'}`}
            onPress={() => navigation.navigate('Transcript')}
          />
          <ListRow
            icon="mail"
            iconColors={['#0C71C3', '#005DAC']}
            title={t('authEmail')}
            value={profile.email}
            stacked
          />
          <ListRow
            icon="call"
            iconColors={['#30D158', '#00A86B']}
            title={t('authPhone')}
            value={profile.phone}
            onPress={() => Linking.openURL('tel:' + profile.phone.replace(/\s/g, ''))}
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
          <ListRow title={t('logout')} destructive chevron={false} onPress={signOut} />
        </ListGroup>
      </FadeIn>
    </Screen>
  );
}
