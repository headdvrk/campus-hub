import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IconName } from '../types/service';
import { colors, fontSize, spacing } from '../styles/theme';

type Props = {
  icon: IconName;
  label: string;
  value: string;
};

export function InfoRow({ icon, label, value }: Props) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
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
  label: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  value: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
});
