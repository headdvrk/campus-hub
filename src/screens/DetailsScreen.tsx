import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: Props) {
  const params = route.params as Props['route']['params'] | undefined;

  // Параметрсіз ашылған қате маршрутты NotFound экранына ауыстыру
  useEffect(() => {
    if (!params?.serviceId) navigation.replace('NotFound');
  }, [params, navigation]);

  if (!params?.serviceId) return null;

  const { serviceId, title } = params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.id}>ID: {serviceId}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Артқа</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: '#F4F8FC',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  id: {
    fontSize: 15,
    color: '#64748B',
  },
  button: {
    backgroundColor: '#0B66E4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
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
