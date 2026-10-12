import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { IconName } from '../types/service';

type Props = {
  icon: IconName;
  colors: readonly [string, string];
  size?: number;
};

// iOS баптауларындағыдай градиентті шаршы белгіше
export function GradientIcon({ icon, colors, size = 30 }: Props) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.box,
        { width: size, height: size, borderRadius: size * 0.27 },
      ]}
    >
      <Ionicons name={icon} size={size * 0.56} color="#FFFFFF" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
