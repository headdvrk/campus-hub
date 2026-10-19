import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Announcement } from '../types/announcement';
import { useSettings } from '../context/SettingsContext';
import { radius, spacing } from '../styles/theme';
import { formatDate } from '../utils/date';
import { AppText } from './AppText';
import { Card } from './Card';
import { PressableScale } from './PressableScale';

type Props = {
  item: Announcement;
  onPress: (item: Announcement) => void;
};

export function AnnouncementCard({ item, onPress }: Props) {
  const { colors, language } = useSettings();

  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => onPress(item)}
      accessibilityLabel={item.title}
    >
      <Card padded={false} style={styles.card}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={[styles.image, { backgroundColor: colors.input }]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : null}
        <View style={styles.body}>
          <AppText variant="footnote" color="primary">
            {formatDate(item.date, language)}
          </AppText>
          <AppText variant="headline" numberOfLines={3}>
            {item.title}
          </AppText>
          <AppText variant="subhead" color="muted" numberOfLines={3}>
            {item.excerpt}
          </AppText>
        </View>
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
});
