import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'tinted' | 'danger' | 'accent';
  // Сұраныс жүріп жатқанда: индикатор көрсетіледі, қайта басу мүмкін емес
  loading?: boolean;
};

export function PrimaryButton({ title, onPress, variant = 'primary', loading = false }: Props) {
  const { colors } = useSettings();
  const a11y = { accessibilityLabel: title, accessibilityState: { busy: loading } };

  if (variant === 'primary' || variant === 'accent') {
    const isAccent = variant === 'accent';
    const textColor = isAccent ? colors.onAccent : colors.onPrimary;
    return (
      <PressableScale
        onPress={onPress}
        disabled={loading}
        style={[styles.shadow, { shadowColor: isAccent ? colors.accent : colors.hero[0] }]}
        {...a11y}
      >
        <LinearGradient
          colors={isAccent ? [colors.accent, '#FFB547'] : colors.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <AppText variant="headline" style={{ color: textColor }}>
              {title}
            </AppText>
          )}
        </LinearGradient>
      </PressableScale>
    );
  }

  const tint = variant === 'danger' ? colors.danger : colors.primary;

  return (
    <PressableScale onPress={onPress} disabled={loading} {...a11y}>
      <View style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }, styles.bordered]}>
        {loading ? (
          <ActivityIndicator color={tint} />
        ) : (
          <AppText variant="headline" style={{ color: tint }}>
            {title}
          </AppText>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: 1,
  },
  shadow: {
    borderRadius: radius.pill,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 4,
  },
});
