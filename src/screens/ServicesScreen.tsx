import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { services } from '../data/services';
import { EmptyState, SectionTitle, ServiceCard } from '../components';
import { colors, spacing } from '../styles/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Services'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ServicesScreen({ navigation }: Props) {
  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title,
    });
  };

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={services}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <SectionTitle
          title="Сервистер"
          subtitle={`Кампустағы ${services.length} қызмет`}
        />
      }
      renderItem={({ item }) => (
        <ServiceCard service={item} onPress={openService} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <EmptyState
          title="Сервистер жоқ"
          message="Қазір қолжетімді сервистер табылмады"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  separator: {
    height: spacing.md - 4,
  },
});
