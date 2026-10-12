import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Campus Hub</Text>
        <Text style={styles.heroText}>
          Университеттің цифрлық кампусына қош келдіңіз
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Жылдам әрекеттер</Text>

      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() =>
          navigation.navigate('Details', {
            serviceId: 'library',
            title: 'Кітапхана',
          })
        }
      >
        <Text style={styles.cardTitle}>📚 Кітапхананы ашу</Text>
        <Text style={styles.cardText}>Кітаптар мен оқу орындары</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => navigation.navigate('Services')}
      >
        <Text style={styles.cardTitle}>🧩 Барлық сервистер</Text>
        <Text style={styles.cardText}>Кампустың барлық қызметтерінің тізімі</Text>
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
  hero: {
    backgroundColor: '#0B66E4',
    borderRadius: 20,
    padding: 20,
    gap: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  heroText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
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
