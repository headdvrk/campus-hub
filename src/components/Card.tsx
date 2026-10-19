import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

// "Liquid Glass" карточкасы: фон көрініп тұратын мөлдір бет және жарық жиек
export function Card({ children, style, padded = true }: Props) {
  const { colors } = useSettings();

  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    // Android-та elevation мөлдір беттің ішінен сұр дақ болып көрінеді
    elevation: 0,
  },
  padded: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
