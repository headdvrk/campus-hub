import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useSettings } from '../context/SettingsContext';
import {
  Backdrop,
  EmptyState,
} from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

// Белгісіз маршрут немесе қате параметр болғанда көрсетіледі
export function NotFoundScreen({ navigation }: Props) {
  const { colors, t } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Backdrop />
      <EmptyState
        icon="compass-outline"
        title={t('notFoundTitle')}
        message={t('notFoundMessage')}
        actionLabel={t('goHome')}
        onAction={() => navigation.navigate('Main', { screen: 'Home' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
