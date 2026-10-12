import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { AppText } from './AppText';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// Бірнеше нұсқаның бірін таңдауға арналған батырма (A− / A / A+, тілдер)
export function OptionButton({ label, selected, onPress }: Props) {
  const { colors } = useSettings();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.option,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primary : colors.card,
        },
        pressed && styles.pressed,
      ]}
    >
      <AppText bold center color={selected ? 'onPrimary' : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
