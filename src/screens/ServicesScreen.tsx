import React, { useMemo, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { services } from '../data/services';
import { useSettings } from '../context/SettingsContext';
import {
  Backdrop,
  BackPill,
  CompactHeader,
  EmptyState,
  FadeIn,
  LargeTitle,
  SearchBar,
  ServiceCard,
  useScrollHeader,
} from '../components';
import { spacing } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Services'>;

export function ServicesScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();
  const header = useScrollHeader({ withBack: true });
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
      <Backdrop />
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
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder={t('searchPlaceholder')}
            />
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
      <BackPill onPress={() => navigation.goBack()} />
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
});
