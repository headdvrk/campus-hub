import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Service } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { AppText } from './AppText';
import { GradientIcon } from './GradientIcon';
import { PressableScale } from './PressableScale';

type Props = {
  service: Service;
  onPress: (service: Service) => void;
};

// Сервис плиткасы: градиентті белгіше, атауы және қысқа сипаттамасы
export function ServiceCard({ service, onPress }: Props) {
  const { colors, language } = useSettings();

  return (
    <PressableScale
      onPress={() => onPress(service)}
      accessibilityLabel={service.title[language]}
      containerStyle={styles.container}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.top}>
        <GradientIcon icon={service.icon} colors={service.gradient} size={44} />
        <Ionicons name="arrow-forward-circle" size={22} color={colors.muted} />
      </View>
      <View style={styles.texts}>
        <AppText variant="headline" numberOfLines={1}>
          {service.title[language]}
        </AppText>
        <AppText variant="footnote" color="muted" numberOfLines={2}>
          {service.description[language]}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    minHeight: 150,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.md,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  texts: {
    gap: 2,
  },
});
