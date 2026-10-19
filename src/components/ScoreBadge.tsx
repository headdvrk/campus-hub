import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { radius } from '../styles/theme';
import { letterFor } from '../utils/grades';
import { AppText } from './AppText';

export type Tone = 'success' | 'primary' | 'warning' | 'danger';

// Балл деңгейінің түсі: түс жалғыз белгі емес, қасында әрқашан әріп пен сан тұрады
export function toneFor(score: number): Tone {
  if (score >= 90) return 'success';
  if (score >= 75) return 'primary';
  if (score >= 50) return 'warning';
  return 'danger';
}

// "88 · B+" түріндегі белгі; балл жоқ болса "—"
export function ScoreBadge({ score, size = 'md' }: { score: number | null; size?: 'md' | 'lg' }) {
  const { colors } = useSettings();

  if (score === null) {
    return (
      <View style={[styles.badge, { backgroundColor: colors.input }]}>
        <AppText variant="subhead" color="muted" style={styles.text}>
          —
        </AppText>
      </View>
    );
  }

  const tone = colors[toneFor(score)];
  const { letter } = letterFor(score);
  return (
    <View
      style={[styles.badge, size === 'lg' && styles.large, { backgroundColor: tone + '1F' }]}
      accessibilityLabel={`${score}, ${letter}`}
    >
      <AppText variant={size === 'lg' ? 'title3' : 'subhead'} style={[styles.text, { color: tone }]}>
        {score} · {letter}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 64,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  large: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text: {
    fontWeight: '700',
  },
});
