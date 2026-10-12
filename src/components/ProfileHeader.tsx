import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Student } from '../types/student';
import { useSettings } from '../context/SettingsContext';
import { spacing } from '../styles/theme';
import { AppText } from './AppText';

type Props = { student: Student };

export function ProfileHeader({ student }: Props) {
  const { colors } = useSettings();

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <AppText size="xxl" bold color="onPrimary">
          {student.initials}
        </AppText>
      </View>
      <AppText size="xl" bold>
        {student.name}
      </AppText>
      <AppText color="muted">{student.group}</AppText>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
});
