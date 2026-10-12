import React, { ReactNode } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { AppTheme } from '../theme/themes';
import { fontSize } from '../styles/theme';

type Props = {
  children: ReactNode;
  size?: keyof typeof fontSize;
  color?: keyof AppTheme;
  bold?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
};

// Түсі тақырыптан, өлшемі таңдалған қаріп масштабынан алынатын мәтін
export function AppText({
  children,
  size = 'md',
  color = 'text',
  bold = false,
  center = false,
  style,
}: Props) {
  const { colors, scale } = useSettings();
  const scaled = scale(fontSize[size]);

  return (
    <Text
      style={[
        {
          color: colors[color],
          fontSize: scaled,
          lineHeight: Math.round(scaled * 1.35),
          fontWeight: bold ? '700' : '400',
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
