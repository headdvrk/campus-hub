import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { getSavedPost, markPostRead, savePost } from '../database/favorites';
import { BackPill } from '../components/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetails'>;

export function NewsDetailsScreen({ route, navigation }: Props) {
  const { announcementId } = route.params;
  const { colors, language, t } = useSettings();
  const insets = useSafeAreaInsets();

  const [item, setItem] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Мәні өзгергенде сұраныс қайта орындалады ("Қайталау" батырмасы)
  const [attempt, setAttempt] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [readError, setReadError] = useState(false);
  const saveLock = useRef(false);
  const activeRef = useRef(true);

  // Маршрут параметріндегі id бойынша бір хабарландыру сұралады
  useEffect(() => {
    const controller = new AbortController();
    activeRef.current = true;
    setLoading(true);
    setError(null);
    setSaved(false);
    setSaveError(false);
    setReadError(false);
    setItem(null);
    async function load() {
      try {
        const local = await getSavedPost(announcementId).catch(() => null);
        if (controller.signal.aborted) return;
        if (local) {
          setItem({ ...local, excerpt: local.body });
          setSaved(true);
          try { await markPostRead(announcementId); }
          catch { if (!controller.signal.aborted) setReadError(true); }
          return;
        }
        const remote = await getAnnouncement(announcementId, controller.signal);
        if (!controller.signal.aborted) setItem(remote);
      } catch (e) {
        if (controller.signal.aborted) return;
        const cached = (await getCachedAnnouncements(language))?.find(a => a.id === announcementId);
        if (controller.signal.aborted) return;
        if (cached) setItem(cached);
        else setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => { activeRef.current = false; controller.abort(); };
  }, [announcementId, attempt, language]);

  async function saveArticle() {
    if (!item || saveLock.current || saved) return;
    saveLock.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      const full = item.body?.trim() ? item : await getAnnouncement(item.id);
      if (!full.body?.trim()) throw new Error('Full article unavailable');
      await savePost({ ...full, body: full.body });
      await markPostRead(full.id);
      if (activeRef.current) setSaved(true);
    } catch { if (activeRef.current) setSaveError(true); }
    finally {
      saveLock.current = false;
      if (activeRef.current) setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Backdrop />
        <ActivityIndicator size="large" color={colors.primary} />
        <BackPill onPress={() => navigation.goBack()} />
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
        <BackPill onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const paragraphs = (item.body || item.excerpt).split('\n\n');

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Backdrop />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }]}>
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
          {item.date && !Number.isNaN(Date.parse(item.date)) ? <AppText variant="footnote" color="primary">
            {formatDate(item.date, language)}
          </AppText> : null}
          {saved && <AppText variant="footnote" color="success">{t('newsOfflineCopy')}</AppText>}
          <AppText variant="title2">{item.title}</AppText>
          {paragraphs.map((text, index) => (
            <AppText key={index} style={styles.paragraph}>
              {text}
            </AppText>
          ))}
        </Card>
      </FadeIn>
      <FadeIn delay={120}>
        <PrimaryButton title={t(saving ? 'newsSaving' : saved ? 'newsSavedBadge' : 'newsSave')}
          variant="tinted" disabled={saved || saving} onPress={() => { void saveArticle(); }} />
        {saveError && <AppText color="danger">{t('newsSaveError')}</AppText>}
        {readError && <AppText color="danger">{t('newsChangeError')}</AppText>}
      </FadeIn>
      {item.link ? <FadeIn delay={160}>
        <PrimaryButton
          title={t('openOnSite')}
          variant="tinted"
          onPress={() => Linking.openURL(item.link)}
        />
      </FadeIn> : null}
      </ScrollView>
      <BackPill onPress={() => navigation.goBack()} />
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
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
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
