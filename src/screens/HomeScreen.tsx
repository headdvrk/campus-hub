import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { services } from '../data/services';
import { student } from '../data/student';
import { PrimaryButton, SectionTitle, ServiceCard } from '../components';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const featured = services.slice(0, 2);

export function HomeScreen({ navigation }: Props) {
  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Сәлем, {student.name.split(' ')[1]}!</Text>
        <Text style={styles.heroText}>
          Campus Hub — университеттің цифрлық кампусы
        </Text>
      </View>

      <SectionTitle title="Жылдам әрекеттер" subtitle="Жиі қолданылатын сервистер" />
      {featured.map((service) => (
        <ServiceCard key={service.id} service={service} onPress={openService} />
      ))}

      <PrimaryButton
        title="Барлық сервистер"
        variant="outline"
        onPress={() => navigation.navigate('Services')}
      />
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
    gap: spacing.md - 4,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: 20,
    gap: 6,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.onPrimary,
    fontSize: 26,
    fontWeight: '700',
  },
  heroText: {
    color: colors.onPrimary,
    fontSize: fontSize.md,
  },
});
