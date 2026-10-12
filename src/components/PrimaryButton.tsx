import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
};

export function PrimaryButton({ title, onPress, variant = 'primary' }: Props) {
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
      <Text style={[styles.text, { color: filled ? colors.onPrimary : accent }]}>
        {title}
      </Text>
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
  text: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
