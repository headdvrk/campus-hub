import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'tinted' | 'danger';
};

export function PrimaryButton({ title, onPress, variant = 'primary' }: Props) {
  const { colors } = useSettings();

  if (variant === 'primary') {
    return (
      <PressableScale onPress={onPress} style={styles.shadow}>
        <LinearGradient
          colors={colors.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <AppText variant="headline" color="onPrimary">
            {title}
          </AppText>
        </LinearGradient>
      </PressableScale>
    );
  }

  const accent = variant === 'danger' ? colors.danger : colors.primary;

  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.button, { backgroundColor: accent + '1F' }]}>
        <AppText variant="headline" style={{ color: accent }}>
          {title}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    borderRadius: radius.md + 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
});
