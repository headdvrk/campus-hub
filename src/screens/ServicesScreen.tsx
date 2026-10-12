import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { services } from '../data/services';
import { useSettings } from '../context/SettingsContext';
import { EmptyState, SectionTitle, ServiceCard } from '../components';
import { spacing } from '../styles/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Services'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ServicesScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();

  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title[language],
    });
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      data={services}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <SectionTitle
          title={t('servicesTitle')}
          subtitle={t('servicesCount', { count: services.length })}
        />
      }
      renderItem={({ item }) => (
        <ServiceCard service={item} onPress={openService} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <EmptyState
          title={t('servicesEmptyTitle')}
          message={t('servicesEmptyMessage')}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  separator: {
    height: spacing.md - 4,
  },
});
