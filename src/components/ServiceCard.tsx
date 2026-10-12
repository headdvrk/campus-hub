import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Service } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { AppText } from './AppText';

type Props = {
  service: Service;
  onPress: (service: Service) => void;
};

export function ServiceCard({ service, onPress }: Props) {
  const { colors, language } = useSettings();

  return (
    <Pressable
      onPress={() => onPress(service)}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.iconBackground }]}>
        <Ionicons name={service.icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.texts}>
        <AppText size="lg" bold>
          {service.title[language]}
        </AppText>
        <AppText size="sm" color="muted">
          {service.description[language]}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
