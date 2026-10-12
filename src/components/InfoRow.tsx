import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IconName } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { spacing } from '../styles/theme';
import { AppText } from './AppText';

type Props = {
  icon: IconName;
  label: string;
  value: string;
};

export function InfoRow({ icon, label, value }: Props) {
  const { colors } = useSettings();

  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={styles.texts}>
        <AppText size="sm" color="muted">
          {label}
        </AppText>
        <AppText bold>{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  texts: {
    flex: 1,
  },
});
