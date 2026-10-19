import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Announcement } from '../types/announcement';
import { getAnnouncements, getCachedAnnouncements } from '../api/announcements';
import { useSettings } from '../context/SettingsContext';
import {
  AnnouncementCard,
  AppText,
  Backdrop,
  Card,
  CompactHeader,
  EmptyState,
  FadeIn,
  LargeTitle,
  SearchBar,
  useScrollHeader,
} from '../components';
import { spacing } from '../styles/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'News'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function NewsScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();
  const header = useScrollHeader();

  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Желі жоқ кезде кэштен алынған деректер көрсетіліп тұр ма
  const [offline, setOffline] = useState(false);
  const [query, setQuery] = useState('');
  const controllerRef = useRef<AbortController | null>(null);

  const loadData = async () => {
    // Алдыңғы аяқталмаған сұраныс тоқтатылады, жауаптар араласпайды
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setError(null);
      const data = await getAnnouncements(language, controller.signal);
      setItems(data);
      setOffline(false);
    } catch (e) {
      if (controller.signal.aborted) return;
      const cached = await getCachedAnnouncements(language);
      if (cached) {
        setItems(cached);
        setOffline(true);
      } else {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Экран ашылғанда және тіл ауысқанда (сайттағы сол тілдің жаңалықтары);
  // экран жабылғанда сұраныс тоқтатылады
  useEffect(() => {
    setLoading(true);
    loadData();
    return () => controllerRef.current?.abort();
  }, [language]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const retry = () => {
    setLoading(true);
    loadData();
  };

  const filtered = useMemo(() => {
    const text = query.trim().toLocaleLowerCase();
    if (!text) return items;
    return items.filter((item) => item.title.toLocaleLowerCase().includes(text));
  }, [items, query]);

  const openAnnouncement = (item: Announcement) => {
    navigation.navigate('NewsDetails', { announcementId: item.id });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Backdrop />
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText color="muted">{t('newsLoading')}</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Backdrop />
        <EmptyState
          icon="cloud-offline-outline"
          title={t('newsError')}
          message={t('newsErrorMessage', { error })}
          actionLabel={t('retry')}
          onAction={retry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Backdrop />
      <Animated.FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={header.onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, header.contentStyle]}
        ListHeaderComponent={
          <View style={styles.header}>
            <LargeTitle
              title={t('news')}
              subtitle={t('newsCount', { count: items.length })}
              scrollY={header.scrollY}
            />
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder={t('newsSearch')}
            />
            {offline ? (
              <Card style={styles.offline}>
                <Ionicons name="cloud-offline-outline" size={20} color={colors.danger} />
                <AppText variant="subhead" color="muted" style={styles.flex}>
                  {t('newsOffline')}
                </AppText>
              </Card>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <FadeIn delay={60 + index * 40}>
            <AnnouncementCard item={item} onPress={openAnnouncement} />
          </FadeIn>
        )}
        ListEmptyComponent={
          query ? (
            <EmptyState
              icon="search"
              title={t('noResults')}
              message={t('newsNoResults', { query: query.trim() })}
            />
          ) : (
            <EmptyState
              icon="newspaper-outline"
              title={t('newsEmptyTitle')}
              message={t('newsEmptyMessage')}
              actionLabel={t('retry')}
              onAction={retry}
            />
          )
        }
      />
      <CompactHeader title={t('news')} scrollY={header.scrollY} />
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
    gap: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md - 4,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
