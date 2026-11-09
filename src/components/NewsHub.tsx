import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAnnouncement, getAnnouncements, getCachedAnnouncements } from '../api/announcements';
import { getSavedPosts, removeSaved, savePost, SavedPost, toggleRead } from '../database/favorites';
import { Announcement } from '../types/announcement';
import { TranslationKey } from '../i18n/translations';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/date';
import { AppText } from './AppText';
import { Backdrop } from './Backdrop';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { PrimaryButton } from './PrimaryButton';
import { SearchBar } from './SearchBar';
import { SegmentedControl } from './SegmentedControl';
import { BackPill, CompactHeader, LargeTitle, useScrollHeader } from './Screen';

type Section = 'latest' | 'saved';
type ReadFilter = 'all' | 'unread' | 'read';
type Props = { initialSection?: Section; onOpen: (id: number) => void; onBack?: () => void };

export function NewsHub({ initialSection = 'latest', onOpen, onBack }: Props) {
  const { colors, language, t } = useSettings();
  const header = useScrollHeader({ withBack: Boolean(onBack) });
  const [section, setSection] = useState<Section>(initialSection);
  const [filter, setFilter] = useState<ReadFilter>('all');
  const [query, setQuery] = useState('');
  const [feed, setFeed] = useState<Announcement[]>([]);
  const [saved, setSaved] = useState<SavedPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [savedError, setSavedError] = useState(false);
  const [offline, setOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [notice, setNotice] = useState<TranslationKey | null>(null);
  const [removeTarget, setRemoveTarget] = useState<SavedPost | null>(null);
  const locked = useRef(false);
  const mounted = useRef(true);
  const list = useRef<Animated.FlatList<Announcement>>(null);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useFocusEffect(useCallback(() => {
    let active = true;
    setSavedLoading(true);
    getSavedPosts().then(rows => {
      if (active) { setSaved(rows); setSavedError(false); }
    }).catch(() => { if (active) setSavedError(true); })
      .finally(() => { if (active) { setSavedLoading(false); setRefreshing(false); } });
    return () => { active = false; };
  }, [attempt]));

  useEffect(() => {
    if (section !== 'latest') return;
    const controller = new AbortController();
    setFeedLoading(true);
    setFeedError(false);
    setFeed([]);
    getAnnouncements(language, controller.signal).then(rows => {
      if (!controller.signal.aborted) { setFeed(rows); setOffline(false); }
    }).catch(async () => {
      if (controller.signal.aborted) return;
      const cached = await getCachedAnnouncements(language);
      if (controller.signal.aborted) return;
      if (cached) { setFeed(cached); setOffline(true); }
      else setFeedError(true);
    }).finally(() => {
      if (!controller.signal.aborted) { setFeedLoading(false); setRefreshing(false); }
    });
    return () => controller.abort();
  }, [language, section, attempt]);

  const savedById = useMemo(() => new Map(saved.map(item => [item.id, item])), [saved]);
  const unread = saved.filter(item => !item.isRead).length;
  const visible = useMemo(() => {
    const text = query.trim().toLocaleLowerCase();
    const rows: Announcement[] = section === 'latest' ? feed : saved
      .filter(item => filter === 'all' || item.isRead === (filter === 'read' ? 1 : 0))
      .map(item => ({ ...item, excerpt: item.body }));
    return rows.filter(item => !text || (item.title + ' ' + item.excerpt).toLocaleLowerCase().includes(text));
  }, [feed, saved, section, filter, query]);

  function changeSection(value: Section) {
    setSection(value); setQuery(''); setNotice(null);
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }

  async function mutate(id: number, action: () => Promise<unknown>, success?: TranslationKey) {
    if (locked.current) return;
    locked.current = true; setBusyId(id); setNotice(null);
    try {
      await action();
      if (!mounted.current) return;
      setRemoveTarget(null);
      if (success) setNotice(success);
      try {
        const rows = await getSavedPosts();
        if (mounted.current) { setSaved(rows); setSavedError(false); }
      } catch { if (mounted.current) setSavedError(true); }
    } catch {
      if (mounted.current) setNotice(success === 'newsSaveSuccess' ? 'newsSaveError' : 'newsChangeError');
    } finally {
      locked.current = false;
      if (mounted.current) setBusyId(null);
    }
  }

  function bookmark(item: Announcement) {
    const existing = savedById.get(item.id);
    if (existing) { setRemoveTarget(existing); return; }
    void mutate(item.id, async () => {
      const full = await getAnnouncement(item.id);
      if (!full.body?.trim()) throw new Error('Full article unavailable');
      await savePost({ ...full, body: full.body });
    }, 'newsSaveSuccess');
  }

  const loading = section === 'saved' ? savedLoading : feedLoading;
  const error = section === 'saved' ? savedError : feedError;
  const isErrorNotice = notice === 'newsSaveError' || notice === 'newsChangeError';
  const counts = { all: saved.length, unread, read: saved.length - unread };
  const filterKeys = { all: 'newsAll', unread: 'newsUnread', read: 'newsRead' } as const;

  function empty() {
    if (loading) return <View style={styles.loading}><ActivityIndicator color={colors.primary} /><AppText color="muted">{t('newsLoading')}</AppText></View>;
    if (error) return <EmptyState icon="cloud-offline-outline" title={t('newsError')}
      message={t(section === 'saved' ? 'newsStorageError' : 'newsSaveError')}
      actionLabel={t('retry')} onAction={() => setAttempt(n => n + 1)} />;
    if (query.trim()) return <EmptyState icon="search-outline" title={t('noResults')}
      message={t('newsNoResults', { query: query.trim() })} actionLabel={t('clearSearch')} onAction={() => setQuery('')} />;
    if (section === 'latest') return <EmptyState icon="newspaper-outline" title={t('newsEmptyTitle')}
      message={t('newsEmptyMessage')} actionLabel={t('retry')} onAction={() => setAttempt(n => n + 1)} />;
    return <EmptyState icon={filter === 'all' ? 'bookmarks-outline' : 'checkmark-done-outline'}
      title={t(filter === 'all' ? 'newsSavedEmpty' : filter === 'read' ? 'newsReadEmpty' : 'newsUnreadEmpty')}
      message={t(filter === 'all' ? 'newsSavedEmptyHint' : 'newsFilterEmptyHint')}
      actionLabel={t(filter === 'all' ? 'newsBrowse' : 'newsAll')}
      onAction={() => filter === 'all' ? changeSection('latest') : setFilter('all')} />;
  }

  return <View style={[styles.page, { backgroundColor: colors.background }]}>
    <Backdrop />
    <Animated.FlatList ref={list} data={visible} keyExtractor={item => String(item.id)}
      onScroll={header.onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false} refreshing={refreshing}
      onRefresh={() => { setRefreshing(true); setAttempt(n => n + 1); }}
      contentContainerStyle={[styles.content, header.contentStyle]}
      ListHeaderComponent={<View style={styles.header}>
        <LargeTitle title={t('news')} subtitle={t(section === 'saved' ? 'newsSavedCount' : 'newsCount',
          { count: section === 'saved' ? saved.length : feed.length })} scrollY={header.scrollY}
          right={<View style={[styles.titleIcon, { backgroundColor: colors.iconBackground }]}>
            <Ionicons name={section === 'saved' ? 'bookmarks-outline' : 'newspaper-outline'} size={25} color={colors.primary} />
          </View>} />
        <SegmentedControl value={section} onChange={changeSection} options={[
          { value: 'latest', label: t('newsLatest') }, { value: 'saved', label: `${t('newsSaved')} · ${saved.length}` },
        ]} />
        {section === 'saved' && <AppText variant="subhead" color="muted">{t('newsSavedHint')}</AppText>}
        <SearchBar value={query} onChangeText={setQuery} placeholder={t('newsSearch')} />
        {section === 'latest' && savedError && <Card>
          <AppText variant="subhead" color="danger">{t('newsStorageError')}</AppText>
          <PrimaryButton title={t('retry')} variant="tinted" onPress={() => setAttempt(n => n + 1)} />
        </Card>}
        {section === 'saved' && <View style={styles.filters}>
          {(['all', 'unread', 'read'] as const).map(value => <Pressable key={value} accessibilityRole="tab"
            accessibilityState={{ selected: value === filter }} accessibilityLabel={`${t(filterKeys[value])} · ${counts[value]}`} onPress={() => setFilter(value)}
            style={[styles.filter, { backgroundColor: value === filter ? colors.primary : colors.input }]}>
            <AppText variant="caption" center style={{ fontWeight: '500', color: value === filter ? colors.background : colors.text }}>
              {t(value === 'all' ? 'newsAll' : value === 'read' ? 'newsReadBadge' : 'newsUnreadBadge')}
            </AppText>
            <AppText variant="headline" center style={{ color: value === filter ? colors.background : colors.text }}>{counts[value]}</AppText>
          </Pressable>)}
        </View>}
        {section === 'latest' && offline && <View style={[styles.banner, { backgroundColor: colors.input }]}>
          <Ionicons name="cloud-offline-outline" size={18} color={colors.muted} />
          <AppText variant="footnote" color="muted" style={styles.flex}>{t('newsOffline')}</AppText>
        </View>}
        {!!notice && <View accessibilityLiveRegion="polite" style={[styles.banner, { backgroundColor: colors.input }]}>
          <Ionicons name={isErrorNotice ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={22} color={isErrorNotice ? colors.danger : colors.success} />
          <AppText variant="subhead" style={styles.flex}>{t(notice)}</AppText>
          <Pressable onPress={() => setNotice(null)} accessibilityRole="button" accessibilityLabel={t('newsDismiss')} hitSlop={10}>
            <Ionicons name="close" size={20} color={colors.muted} />
          </Pressable>
        </View>}
        {error && visible.length > 0 && <PrimaryButton title={t('retry')} variant="tinted" onPress={() => setAttempt(n => n + 1)} />}
      </View>}
      ListEmptyComponent={empty()}
      renderItem={({ item }) => {
        const stored = savedById.get(item.id);
        return <Card padded={false} style={styles.card}>
          {item.image ? <Pressable onPress={() => onOpen(item.id)} accessibilityRole="button" accessibilityLabel={item.title}>
            <Image source={{ uri: item.image }} resizeMode="cover" style={[styles.image, { backgroundColor: colors.input }]} />
          </Pressable> : null}
          <View style={styles.cardBody}>
            <View style={styles.meta}>
              <View style={styles.metaLabels}>
                {item.date && !Number.isNaN(Date.parse(item.date)) && <AppText variant="caption" color="muted">{formatDate(item.date, language)}</AppText>}
                {stored && <View style={[styles.badge, { backgroundColor: stored.isRead ? colors.input : colors.iconBackground }]}>
                  <Ionicons name={stored.isRead ? 'checkmark-done' : 'ellipse'} size={stored.isRead ? 14 : 7} color={stored.isRead ? colors.muted : colors.primary} />
                  <AppText variant="caption" color={stored.isRead ? 'muted' : 'primary'}>{t(stored.isRead ? 'newsReadBadge' : 'newsUnreadBadge')}</AppText>
                </View>}
              </View>
              <Pressable accessibilityRole="button" disabled={busyId !== null || savedLoading || savedError}
                accessibilityLabel={t(stored ? 'newsRemove' : 'newsSave')} accessibilityState={{ selected: Boolean(stored), disabled: busyId !== null || savedLoading || savedError }}
                onPress={() => bookmark(item)} style={[styles.bookmark, { backgroundColor: stored ? colors.iconBackground : colors.input }]}>
                {busyId === item.id ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name={stored ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.primary} />}
              </Pressable>
            </View>
            <Pressable accessibilityRole="button" onPress={() => onOpen(item.id)} style={styles.article}>
              <AppText variant="title3" numberOfLines={3}>{item.title}</AppText>
              <AppText variant="subhead" color="muted" numberOfLines={2}>{item.excerpt}</AppText>
              <View style={styles.readLink}><AppText variant="subhead" color="primary" style={styles.bold}>{t('newsOpen')}</AppText><Ionicons name="arrow-forward" size={17} color={colors.primary} /></View>
            </Pressable>
            {section === 'saved' && stored && <View style={[styles.cardFooter, { borderTopColor: colors.separator }]}>
              <Pressable accessibilityRole="button" accessibilityLabel={t(stored.isRead ? 'newsMarkUnread' : 'newsMarkRead')}
                disabled={busyId !== null} onPress={() => { void mutate(item.id, () => toggleRead(item.id)); }} style={styles.statusAction}>
                <Ionicons name={stored.isRead ? 'ellipse-outline' : 'checkmark-circle-outline'} size={19} color={colors.primary} />
                <AppText variant="footnote" color="primary" style={styles.flex}>{t(stored.isRead ? 'newsMarkUnread' : 'newsMarkRead')}</AppText>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={t('newsRemove')} disabled={busyId !== null} onPress={() => setRemoveTarget(stored)} style={styles.iconAction}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>}
          </View>
        </Card>;
      }} />
    <CompactHeader title={t('news')} scrollY={header.scrollY} />
    {onBack && <BackPill onPress={onBack} />}
    <Modal transparent visible={Boolean(removeTarget)} animationType="fade" onRequestClose={() => { if (busyId === null) setRemoveTarget(null); }}>
      <View style={styles.scrim}><View accessibilityViewIsModal style={[styles.dialog, { backgroundColor: colors.elevated }]}>
        <Ionicons name="bookmark-outline" size={32} color={colors.primary} />
        <AppText variant="title3">{t('newsRemoveTitle')}</AppText>
        {removeTarget && <AppText variant="subhead" numberOfLines={2}>{removeTarget.title}</AppText>}
        <AppText variant="subhead" color="muted">{t('newsRemoveHint')}</AppText>
        {notice === 'newsChangeError' && <AppText color="danger">{t(notice)}</AppText>}
        <PrimaryButton title={t('newsRemoveConfirm')} variant="danger" loading={busyId !== null}
          onPress={() => { if (removeTarget) void mutate(removeTarget.id, () => removeSaved(removeTarget.id), 'newsRemoved'); }} />
        <PrimaryButton title={t('newsCancel')} variant="tinted" disabled={busyId !== null} onPress={() => setRemoveTarget(null)} />
      </View></View>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1 }, flex: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16, width: '100%', maxWidth: 760, alignSelf: 'center' },
  header: { gap: 16, marginBottom: 4 }, titleIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  filters: { flexDirection: 'row', gap: 8 }, filter: { flex: 1, minWidth: 0, minHeight: 64, paddingHorizontal: 6, paddingVertical: 10, borderRadius: 16, justifyContent: 'center', gap: 4 },
  banner: { borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  card: { overflow: 'hidden' }, image: { width: '100%', aspectRatio: 2 }, cardBody: { padding: 18, gap: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  metaLabels: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  badge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  bookmark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  article: { gap: 9 }, readLink: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 }, bold: { fontWeight: '600' },
  cardFooter: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusAction: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  iconAction: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, loading: { alignItems: 'center', padding: 40, gap: 12 },
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 420, padding: 24, borderRadius: 26, gap: 16 },
});
