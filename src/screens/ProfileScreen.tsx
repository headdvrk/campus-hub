import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: Props) {
  // Шығу: тарихты тазалап, Login экранына қайтару
  const handleLogout = () => {
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ҚН</Text>
        </View>
        <Text style={styles.name}>Қазбек Нұрбек</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Тобы</Text>
        <Text style={styles.value}>ПИ-24-1К</Text>
        <Text style={styles.label}>Білім беру бағдарламасы</Text>
        <Text style={styles.value}>Программалық инженерия</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Шығу</Text>
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
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0B66E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },
  value: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  logout: {
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
});
