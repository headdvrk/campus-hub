import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { themes } from '../theme/themes';

// Баптаулар AsyncStorage-тан жүктелгенше көрсетіледі. Бұл сәтте тақырып пен
// тіл әлі белгісіз, сондықтан useSettings емес, тұрақты түстер қолданылады.
export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="school" size={72} color="#FFFFFF" />
      <Text style={styles.title}>Campus Hub</Text>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: themes.light.primary,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
