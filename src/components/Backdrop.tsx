import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { useSettings } from '../context/SettingsContext';

// Алдын ала салынған mesh-градиент: әр экранда blur есептеуден арзан
const images = {
  light: require('../../assets/backdrop-light.png'),
  dark: require('../../assets/backdrop-dark.png'),
};

// Экранның түбіндегі түрлі-түсті фон; мөлдір шыны карточкалар соның үстінде тұрады
export function Backdrop() {
  const { theme, colors } = useSettings();

  return (
    <Image
      source={images[theme]}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
      style={[StyleSheet.absoluteFill, styles.fill, { backgroundColor: colors.background }]}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
});
