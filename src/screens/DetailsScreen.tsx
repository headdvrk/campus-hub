import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types/navigation';
import { findService } from '../data/services';
import { useSettings } from '../context/SettingsContext';
import {
  AppText,
  Card,
  EmptyState,
  FadeIn,
  ListGroup,
  ListRow,
  PrimaryButton,
} from '../components';
import { radius, spacing } from '../styles/theme';
import { tapFeedback, useNativeDriver } from '../utils/motion';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const HERO_HEIGHT = 300;

export function DetailsScreen({ route, navigation }: Props) {
  const { colors, language, t } = useSettings();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const params = route.params as Props['route']['params'] | undefined;
  const service = params?.serviceId ? findService(params.serviceId) : undefined;

  // Параметрсіз ашылған қате маршрутты NotFound экранына ауыстыру
  useEffect(() => {
    if (!params?.serviceId) navigation.replace('NotFound');
  }, [params, navigation]);

  if (!params?.serviceId) return null;

  const goBack = () => {
    tapFeedback();
    navigation.goBack();
  };

  // Белгісіз ID берілсе, экран құламай, түсінікті хабар көрсетеді
  if (!service) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="alert-circle-outline"
          title={t('serviceNotFound')}
          message={t('serviceNotFoundMessage', { id: params.serviceId })}
          actionLabel={t('back')}
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  // Төмен тартқанда бас бөлік үлкейеді (parallax)
  const heroScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [1.5, 1],
    extrapolateRight: 'clamp',
  });
  const heroTranslate = scrollY.interpolate({
    inputRange: [-200, 0, HERO_HEIGHT],
    outputRange: [-100, 0, HERO_HEIGHT * 0.45],
  });

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.hero,
          {
            height: HERO_HEIGHT + insets.top,
            transform: [{ translateY: heroTranslate }, { scale: heroScale }],
          },
        ]}
      >
        <LinearGradient
          colors={service.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroCircle, { right: -80, top: -60 }]} />
        <View style={[styles.heroCircle, { left: -120, bottom: -140 }]} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={[styles.heroContent, { paddingTop: insets.top + 64, minHeight: HERO_HEIGHT + insets.top }]}>
          <FadeIn>
            <View style={styles.bigIcon}>
              <Ionicons name={service.icon} size={44} color="#FFFFFF" />
            </View>
          </FadeIn>
          <FadeIn delay={80}>
            <AppText variant="largeTitle" color="onPrimary">
              {service.title[language]}
            </AppText>
            <AppText color="onPrimary" style={styles.heroDescription}>
              {service.description[language]}
            </AppText>
          </FadeIn>
        </View>

        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <FadeIn delay={140}>
            <Card>
              <AppText variant="headline">{t('about')}</AppText>
              <AppText color="muted">{service.details[language]}</AppText>
            </Card>
          </FadeIn>

          <FadeIn delay={200}>
            <ListGroup>
              <ListRow
                icon="time"
                iconColors={['#FF9F0A', '#FF6B00']}
                title={t('hours')}
                value={service.hours}
              />
              <ListRow
                icon="location"
                iconColors={['#30D158', '#00A86B']}
                title={t('location')}
                value={service.location[language]}
                stacked
              />
              <ListRow
                icon="pricetag"
                iconColors={['#8E8E93', '#636366']}
                title="ID"
                value={service.id}
              />
            </ListGroup>
          </FadeIn>

          <FadeIn delay={260}>
            <PrimaryButton title={t('back')} variant="tinted" onPress={() => navigation.goBack()} />
          </FadeIn>
        </View>
      </Animated.ScrollView>

      <Pressable
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel={t('back')}
        style={({ pressed }) => [
          styles.backButton,
          { top: insets.top + spacing.sm, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  heroContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  bigIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDescription: {
    opacity: 0.88,
    marginTop: 2,
  },
  sheet: {
    marginTop: -spacing.lg,
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    padding: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.md,
    minHeight: 500,
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
