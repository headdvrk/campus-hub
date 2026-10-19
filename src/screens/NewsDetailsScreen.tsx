import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { Announcement } from '../types/announcement';
import { getAnnouncement, getCachedAnnouncements } from '../api/announcements';
import { useSettings } from '../context/SettingsContext';
import {
  AppText,
  Backdrop,
  Card,
  EmptyState,
  FadeIn,
  PrimaryButton,
} from '../components';
import { radius, spacing } from '../styles/theme';
import { formatDate } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetails'>;

export function NewsDetailsScreen({ route }: Props) {
  const { announcementId } = route.params;
  const { colors, language, t } = useSettings();

  const [item, setItem] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Мәні өзгергенде сұраныс қайта орындалады ("Қайталау" батырмасы)
  const [attempt, setAttempt] = useState(0);

  // Маршрут параметріндегі id бойынша бір хабарландыру сұралады
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getAnnouncement(announcementId, controller.signal)
      .then(setItem)
      .catch(async (e) => {
        if (controller.signal.aborted) return;
        // Желі жоқ болса, тізімнің кэшінен (қысқа мәтінмен) ізделеді
        const cached = (await getCachedAnnouncements(language))?.find(
          (a) => a.id === announcementId
        );
        if (cached) setItem(cached);
        else setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [announcementId, attempt, language]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Backdrop />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Backdrop />
        <EmptyState
          icon="cloud-offline-outline"
          title={t('newsError')}
          message={t('newsErrorMessage', { error: error ?? '' })}
          actionLabel={t('retry')}
          onAction={() => setAttempt((n) => n + 1)}
        />
      </View>
    );
  }

  const paragraphs = (item.body || item.excerpt).split('\n\n');

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Backdrop />
      <ScrollView contentContainerStyle={styles.content}>
      {item.image ? (
        <FadeIn>
          <Image
            source={{ uri: item.image }}
            style={[styles.image, { backgroundColor: colors.input }]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </FadeIn>
      ) : null}
      <FadeIn delay={60}>
        <Card>
          <AppText variant="footnote" color="primary">
            {formatDate(item.date, language)}
          </AppText>
          <AppText variant="title2">{item.title}</AppText>
          {paragraphs.map((text, index) => (
            <AppText key={index} style={styles.paragraph}>
              {text}
            </AppText>
          ))}
        </Card>
      </FadeIn>
      <FadeIn delay={120}>
        <PrimaryButton
          title={t('openOnSite')}
          variant="tinted"
          onPress={() => Linking.openURL(item.link)}
        />
      </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: radius.lg,
  },
  paragraph: {
    marginTop: spacing.xs,
  },
});
