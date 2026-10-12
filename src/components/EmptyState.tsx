import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IconName } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { spacing } from '../styles/theme';
import { AppText } from './AppText';
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
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.muted} />
      <AppText size="xl" bold center>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  message: {
    marginBottom: spacing.sm,
  },
});
