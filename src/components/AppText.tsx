import React, { ReactNode } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { AppTheme } from '../theme/themes';
import { TextVariant, typography } from '../styles/theme';

type ColorKey = {
  [K in keyof AppTheme]: AppTheme[K] extends string ? K : never;
}[keyof AppTheme];

type Props = {
  children: ReactNode;
  variant?: TextVariant;
  color?: ColorKey;
  center?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

// Түсі тақырыптан, өлшемі таңдалған қаріп масштабынан алынатын мәтін
export function AppText({
  children,
  variant = 'body',
  color = 'text',
  center = false,
  numberOfLines,
  style,
}: Props) {
  const { colors, scale } = useSettings();
  const { size, weight } = typography[variant];
  const fontSize = scale(size);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: colors[color],
          fontSize,
          lineHeight: Math.round(fontSize * 1.3),
          fontWeight: weight,
          letterSpacing: size >= 28 ? 0.35 : size >= 20 ? 0.2 : -0.2,
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
