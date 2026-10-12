import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Student } from '../types/student';
import { colors, fontSize, spacing } from '../styles/theme';

type Props = { student: Student };

export function ProfileHeader({ student }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{student.initials}</Text>
      </View>
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.group}>{student.group}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  initials: {
    color: colors.onPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  group: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
});
