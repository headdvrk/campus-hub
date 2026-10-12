import React, { Children, Fragment, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IconName } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { tapFeedback } from '../utils/motion';
import { AppText } from './AppText';
import { Card } from './Card';
import { GradientIcon } from './GradientIcon';

// iOS баптауларындағыдай топталған тізім: жолдар арасында жіңішке сызық
export function ListGroup({ children }: { children: ReactNode }) {
  const { colors } = useSettings();
  const rows = Children.toArray(children).filter(Boolean);

  return (
    <Card padded={false} style={styles.group}>
      {rows.map((row, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <View style={[styles.separator, { backgroundColor: colors.separator }]} />
          ) : null}
          {row}
        </Fragment>
      ))}
    </Card>
  );
}

type RowProps = {
  title: string;
  value?: string;
  icon?: IconName;
  iconColors?: readonly [string, string];
  onPress?: () => void;
  right?: ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  // Ұзын мән үшін: тақырып үстінде кішкентай, мән астында толық
  stacked?: boolean;
};

export function ListRow({
  title,
  value,
  icon,
  iconColors = ['#8E8E93', '#636366'],
  onPress,
  right,
  chevron = Boolean(onPress),
  destructive = false,
  stacked = false,
}: RowProps) {
  const { colors } = useSettings();

  const content = stacked ? (
    <View style={styles.row}>
      {icon ? <GradientIcon icon={icon} colors={iconColors} /> : null}
      <View style={styles.title}>
        <AppText variant="footnote" color="muted">
          {title}
        </AppText>
        <AppText>{value}</AppText>
      </View>
      {right}
    </View>
  ) : (
    <View style={styles.row}>
      {icon ? <GradientIcon icon={icon} colors={iconColors} /> : null}
      <AppText
        color={destructive ? 'danger' : 'text'}
        style={[styles.title, destructive && !icon && styles.centered]}
        numberOfLines={1}
      >
        {title}
      </AppText>
      {value ? (
        <AppText color="muted" numberOfLines={1} style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {right}
      {chevron ? (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => pressed && { backgroundColor: colors.input }}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    overflow: 'hidden',
    borderRadius: radius.lg,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 58,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
    minHeight: 50,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  title: {
    flex: 1,
  },
  centered: {
    textAlign: 'center',
  },
  value: {
    maxWidth: '55%',
    textAlign: 'right',
  },
});
