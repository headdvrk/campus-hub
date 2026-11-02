import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getSavedPosts,
  toggleRead,
  removeSaved,
} from '../database/favorites';
import type { SavedPost } from '../database/favorites';
import { useSettings } from '../context/SettingsContext';

export function FavoritesScreen() {
  const { colors } = useSettings();

  const [items, setItems] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  const locked = useRef(false);

  // Экранға кірген сайын SQLite базасынан оқимыз.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError('');
      setDeleteId(null);

      getSavedPosts()
        .then(rows => {
          if (active) setItems(rows);
        })
        .catch(err => {
          if (active) {
            setError(
              'Базаны оқу қатесі: ' +
              (err instanceof Error ? err.message : String(err))
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [attempt])
  );

  // Күйін өзгерткеннен немесе жойғаннан кейін тізімді жаңарту.
  async function change(action: () => Promise<void>) {
    if (locked.current) return;

    locked.current = true;
    setBusy(true);
    setError('');

    try {
      await action();
      setDeleteId(null);

      try {
        const rows = await getSavedPosts();
        setItems(rows);
      } catch {
        setError(
          'Өзгеріс сақталды, бірақ тізім жаңармады. ' +
          '«Қайта оқу» батырмасын басыңыз.'
        );
      }
    } catch (err) {
      setError(
        'Өзгерту қатесі: ' +
        (err instanceof Error ? err.message : String(err))
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  const unreadCount = items.filter(item => item.isRead === 0).length;
  const visibleItems = onlyUnread
    ? items.filter(item => item.isRead === 0)
    : items;

  const disabled = loading || busy || !!error;

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <FlatList
        data={visibleItems}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Таңдаулылар
            </Text>

            <Text style={{ color: colors.muted }}>
              Барлығы: {items.length} · Оқылмаған: {unreadCount}
            </Text>

            <View style={styles.buttons}>
              <Button
                title="Барлығы"
                onPress={() => setOnlyUnread(false)}
                disabled={!onlyUnread}
              />
              <Button
                title="Оқылмаған"
                onPress={() => setOnlyUnread(true)}
                disabled={onlyUnread}
              />
            </View>

            {loading && (
              <ActivityIndicator color={colors.primary} />
            )}

            {!!error && (
              <View style={styles.header}>
                <Text style={{ color: colors.danger }}>{error}</Text>
                <Button
                  title="Қайта оқу"
                  disabled={loading || busy}
                  onPress={() => setAttempt(value => value + 1)}
                />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={{ color: colors.muted }}>
              {onlyUnread
                ? 'Оқылмаған жаңалық жоқ'
                : 'Әзірге сақталған жаңалық жоқ'}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.heading, { color: colors.text }]}>
              {item.title}
            </Text>

            <Text style={[styles.body, { color: colors.text }]}>
              {item.body}
            </Text>

            <Text
              style={{
                color: item.isRead ? colors.success : colors.primary,
                fontWeight: '700',
              }}
            >
              {item.isRead ? 'Оқылды' : 'Оқылмаған'}
            </Text>

            <View style={styles.buttons}>
              <Button
                title={item.isRead ? 'Оқылмаған деп белгілеу' : 'Оқылды'}
                disabled={disabled}
                onPress={() => {
                  void change(() => toggleRead(item.id));
                }}
              />
              <Button
                title="Жою"
                color={colors.danger}
                disabled={disabled}
                onPress={() => setDeleteId(item.id)}
              />
            </View>

            {deleteId === item.id && (
              <View
                style={[
                  styles.confirm,
                  { borderColor: colors.danger },
                ]}
              >
                <Text style={{ color: colors.text }}>
                  Осы жаңалықтың офлайн көшірмесін жоясыз ба?
                </Text>

                <View style={styles.buttons}>
                  <Button
                    title="Бас тарту"
                    disabled={busy}
                    onPress={() => setDeleteId(null)}
                  />
                  <Button
                    title="Иә, жою"
                    color={colors.danger}
                    disabled={disabled}
                    onPress={() => {
                      void change(() => removeSaved(item.id));
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  header: {
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    padding: 18,
    borderWidth: 1,
    borderRadius: 16,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  confirm: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
});