import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { findService } from '../data/services';
import { useSettings } from '../context/SettingsContext';
import { AppText, Card, EmptyState, PrimaryButton } from '../components';
import { radius, spacing } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: Props) {
  const { colors, language, t } = useSettings();
  const params = route.params as Props['route']['params'] | undefined;
  const service = params?.serviceId ? findService(params.serviceId) : undefined;

  // Параметрсіз ашылған қате маршрутты NotFound экранына ауыстыру
  useEffect(() => {
    if (!params?.serviceId) navigation.replace('NotFound');
  }, [params, navigation]);

  // Тіл ауысқанда тақырып та аударылады
  useLayoutEffect(() => {
    navigation.setOptions({
      title: service?.title[language] ?? params?.title ?? t('detailsDefaultTitle'),
    });
  }, [navigation, service, language, params, t]);

  if (!params?.serviceId) return null;

  // Белгісіз ID берілсе, экран құламай, түсінікті хабар көрсетеді
  if (!service) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="alert-circle-outline"
          title={t('serviceNotFound')}
          message={t('serviceNotFoundMessage', { id: params.serviceId })}
          actionLabel={t('back')}
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: colors.iconBackground }]}>
          <Ionicons name={service.icon} size={36} color={colors.primary} />
        </View>
        <AppText size="xxl" bold>
          {service.title[language]}
        </AppText>
        <AppText size="sm" color="muted">
          ID: {service.id}
        </AppText>
        <AppText>{service.details[language]}</AppText>
      </Card>

      <PrimaryButton title={t('back')} onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 20,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
