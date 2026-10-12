import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../styles/theme';
import { AppText } from './AppText';

type Props = { title: string; subtitle?: string };

export function SectionTitle({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <AppText size="xl" bold>
        {title}
      </AppText>
      {subtitle ? (
        <AppText size="sm" color="muted">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
    marginBottom: spacing.sm,
  },
});
