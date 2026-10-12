import React, { useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { services } from '../data/services';
import { useSettings } from '../context/SettingsContext';
import {
  CompactHeader,
  EmptyState,
  FadeIn,
  LargeTitle,
  ServiceCard,
  useScrollHeader,
} from '../components';
import { radius, spacing, typography } from '../styles/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Services'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ServicesScreen({ navigation }: Props) {
  const { colors, language, scale, t } = useSettings();
  const header = useScrollHeader();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const text = query.trim().toLocaleLowerCase();
    if (!text) return services;
    return services.filter(
      (service) =>
        service.title[language].toLocaleLowerCase().includes(text) ||
        service.description[language].toLocaleLowerCase().includes(text)
    );
  }, [query, language]);

  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title[language],
    });
  };

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Animated.FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onScroll={header.onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, header.contentStyle]}
        columnWrapperStyle={styles.column}
        ListHeaderComponent={
          <View style={styles.header}>
            <LargeTitle
              title={t('servicesTitle')}
              subtitle={t('servicesCount', { count: services.length })}
              scrollY={header.scrollY}
            />
            <View style={[styles.search, { backgroundColor: colors.input }]}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t('searchPlaceholder')}
                placeholderTextColor={colors.muted}
                style={[
                  styles.searchInput,
                  { color: colors.text, fontSize: scale(typography.body.size) },
                ]}
                autoCorrect={false}
                returnKeyType="search"
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityRole="button">
                  <Ionicons name="close-circle" size={18} color={colors.muted} />
                </Pressable>
              ) : null}
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <FadeIn delay={60 + index * 50} style={styles.flex}>
            <ServiceCard service={item} onPress={openService} />
          </FadeIn>
        )}
        ListEmptyComponent={
          query ? (
            <EmptyState
              icon="search"
              title={t('noResults')}
              message={t('noResultsMessage', { query: query.trim() })}
            />
          ) : (
            <EmptyState
              title={t('servicesEmptyTitle')}
              message={t('servicesEmptyMessage')}
            />
          )
        }
      />
      <CompactHeader title={t('servicesTitle')} scrollY={header.scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md - 4,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  column: {
    gap: spacing.md - 4,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md - 2,
    paddingHorizontal: 10,
    minHeight: 40,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
  },
});
