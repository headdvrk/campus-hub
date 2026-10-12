import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { services } from '../data/services';
import { student } from '../data/student';
import { useSettings } from '../context/SettingsContext';
import {
  AppText,
  PrimaryButton,
  SectionTitle,
  ServiceCard,
} from '../components';
import { radius, spacing } from '../styles/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const featured = services.slice(0, 2);

export function HomeScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();

  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title[language],
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <AppText size="xxl" bold color="onPrimary">
          {t('greeting', { name: student.firstName })}
        </AppText>
        <AppText color="onPrimary">{t('homeSubtitle')}</AppText>
      </View>

      <SectionTitle title={t('quickActions')} subtitle={t('quickActionsSubtitle')} />
      {featured.map((service) => (
        <ServiceCard key={service.id} service={service} onPress={openService} />
      ))}

      <PrimaryButton
        title={t('allServices')}
        variant="outline"
        onPress={() => navigation.navigate('Services')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md - 4,
  },
  hero: {
    borderRadius: radius.xl,
    padding: 20,
    gap: 6,
    marginBottom: spacing.sm,
  },
});
