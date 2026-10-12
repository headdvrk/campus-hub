import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

// Жұмсақ көлеңкесі бар дөңгелек бұрышты карточка
export function Card({ children, style, padded = true }: Props) {
  const { colors } = useSettings();

  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        { backgroundColor: colors.card, shadowColor: colors.shadow },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  padded: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
