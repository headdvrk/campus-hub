import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { EmptyState } from '../components';
import { colors } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

// Белгісіз маршрут немесе қате параметр болғанда көрсетіледі
export function NotFoundScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <EmptyState
        icon="compass-outline"
        title="Бет табылмады"
        message="Сұралған экран жоқ немесе оған қате деректер берілді."
        actionLabel="Басты бетке қайту"
        onAction={() => navigation.navigate('Main', { screen: 'Home' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
