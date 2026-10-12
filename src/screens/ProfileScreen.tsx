import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { student } from '../data/student';
import { InfoRow, PrimaryButton, ProfileHeader } from '../components';
import { colors, radius, spacing } from '../styles/theme';

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
      <ProfileHeader student={student} />

      <View style={styles.card}>
        <InfoRow icon="school-outline" label="Білім беру бағдарламасы" value={student.program} />
        <InfoRow icon="people-outline" label="Тобы" value={student.group} />
        <InfoRow icon="ribbon-outline" label="Курс" value={`${student.course}-курс`} />
      </View>

      <PrimaryButton title="Шығу" variant="danger" onPress={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
