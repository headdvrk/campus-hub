import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { AppText } from './AppText';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
};

export function PrimaryButton({ title, onPress, variant = 'primary' }: Props) {
  const { colors } = useSettings();
  const filled = variant === 'primary';
  const accent = variant === 'danger' ? colors.danger : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: filled ? accent : 'transparent',
          borderColor: accent,
        },
        pressed && styles.pressed,
      ]}
    >
      <AppText bold style={{ color: filled ? colors.onPrimary : accent }}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
