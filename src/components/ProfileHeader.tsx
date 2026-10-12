import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Student } from '../types/student';
import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { AppText } from './AppText';

type Props = { student: Student };

// Градиентті сақинасы бар аватар, аты-жөні және тобы
export function ProfileHeader({ student }: Props) {
  const { colors } = useSettings();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ring}
      >
        <View style={[styles.avatarInner, { backgroundColor: colors.background }]}>
          <LinearGradient
            colors={colors.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <AppText variant="title1" color="onPrimary">
              {student.initials}
            </AppText>
          </LinearGradient>
        </View>
      </LinearGradient>
      <AppText variant="title2" center>
        {student.name}
      </AppText>
      <View style={[styles.chip, { backgroundColor: colors.iconBackground }]}>
        <AppText variant="footnote" color="primary" style={styles.chipText}>
          {student.group}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  ring: {
    width: 112,
    height: 112,
    borderRadius: 56,
    padding: 3,
    marginBottom: spacing.xs,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 54,
    padding: 3,
  },
  avatar: {
    flex: 1,
    borderRadius: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: {
    fontWeight: '600',
  },
});
