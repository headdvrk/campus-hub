import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Services'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ServicesScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Сервистер</Text>

      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() =>
          navigation.navigate('Details', { serviceId: 'library', title: 'Кітапхана' })
        }
      >
        <Text style={styles.cardTitle}>📚 Кітапхана</Text>
        <Text style={styles.cardText}>Кітаптар мен оқу орындары</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() =>
          navigation.navigate('Details', { serviceId: 'schedule', title: 'Кесте' })
        }
      >
        <Text style={styles.cardTitle}>📅 Кесте</Text>
        <Text style={styles.cardText}>Сабақтар мен емтихандар</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() =>
          navigation.navigate('Details', { serviceId: 'canteen', title: 'Асхана' })
        }
      >
        <Text style={styles.cardTitle}>🍽️ Асхана</Text>
        <Text style={styles.cardText}>Күнделікті мәзір мен жұмыс уақыты</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() =>
          navigation.navigate('Details', { serviceId: 'dormitory', title: 'Жатақхана' })
        }
      >
        <Text style={styles.cardTitle}>🏠 Жатақхана</Text>
        <Text style={styles.cardText}>Орналасу және өтініш беру</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F8FC',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardText: {
    fontSize: 15,
    color: '#64748B',
  },
});
