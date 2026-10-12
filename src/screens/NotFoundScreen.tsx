import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

// Белгісіз маршрут немесе қате параметр болғанда көрсетіледі
export function NotFoundScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🧭</Text>
      <Text style={styles.title}>Бет табылмады</Text>
      <Text style={styles.text}>
        Сұралған экран жоқ немесе оған қате деректер берілді.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => navigation.navigate('Main', { screen: 'Home' })}
      >
        <Text style={styles.buttonText}>Басты бетке қайту</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#F4F8FC',
  },
  icon: {
    fontSize: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  text: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0B66E4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
