import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IconName } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { spacing } from '../styles/theme';
import { AppText } from './AppText';
import { FadeIn } from './FadeIn';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  title: string;
  message?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
};

// Тізім бос болғанда немесе дерек табылмағанда көрсетілетін компонент
export function EmptyState({
  title,
  message,
  icon = 'file-tray-outline',
  actionLabel,
  onAction,
}: Props) {
  const { colors } = useSettings();

  return (
    <FadeIn style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.iconBackground }]}>
        <Ionicons name={icon} size={40} color={colors.primary} />
      </View>
      <AppText variant="title2" center>
        {title}
      </AppText>
      {message ? (
        <AppText color="muted" center style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} />
      ) : null}
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    marginBottom: spacing.md,
    maxWidth: 320,
  },
});
