import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { findService } from '../data/services';
import { EmptyState, PrimaryButton } from '../components';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: Props) {
  const params = route.params as Props['route']['params'] | undefined;

  // Параметрсіз ашылған қате маршрутты NotFound экранына ауыстыру
  useEffect(() => {
    if (!params?.serviceId) navigation.replace('NotFound');
  }, [params, navigation]);

  if (!params?.serviceId) return null;

  const { serviceId, title } = params;
  const service = findService(serviceId);

  // Белгісіз ID берілсе, экран құламай, түсінікті хабар көрсетеді
  if (!service) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="alert-circle-outline"
          title="Сервис табылмады"
          message={`«${serviceId}» ID-і бар сервис жоқ`}
          actionLabel="Артқа"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name={service.icon} size={36} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.id}>ID: {serviceId}</Text>
        <Text style={styles.description}>{service.details}</Text>
      </View>

      <PrimaryButton title="Артқа" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    gap: spacing.sm,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  id: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 23,
    color: colors.text,
  },
});
