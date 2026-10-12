import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { services } from '../data/services';
import { news, todayLessons } from '../data/campus';
import { student } from '../data/student';
import { useSettings } from '../context/SettingsContext';
import {
  AppText,
  Card,
  FadeIn,
  GradientIcon,
  ListGroup,
  PressableScale,
  Screen,
  SectionTitle,
} from '../components';
import { radius, spacing } from '../styles/theme';
import { formatToday } from '../utils/date';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const quickServices = services.slice(0, 4);
const nextLesson = todayLessons[0];

export function HomeScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();

  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title[language],
    });
  };

  const avatar = (
    <PressableScale onPress={() => navigation.navigate('Profile')} accessibilityLabel={t('tabProfile')}>
      <LinearGradient colors={colors.hero} style={styles.avatar}>
        <AppText variant="subhead" color="onPrimary" style={styles.bold}>
          {student.initials}
        </AppText>
      </LinearGradient>
    </PressableScale>
  );

  return (
    <Screen
      title={t('greeting', { name: student.firstName })}
      subtitle={formatToday(language)}
      right={avatar}
    >
      <FadeIn delay={50}>
        <PressableScale
          scaleTo={0.98}
          onPress={() => openService(services[1])}
          style={styles.heroShadow}
        >
          <LinearGradient
            colors={colors.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroCircle} />
            <View style={styles.heroTop}>
              <AppText variant="caption" color="onPrimary" style={styles.heroLabel}>
                {t('nextLesson').toUpperCase()}
              </AppText>
              <View style={styles.heroChip}>
                <AppText variant="caption" color="onPrimary" style={styles.bold}>
                  {t('lessonsToday', { count: todayLessons.length })}
                </AppText>
              </View>
            </View>
            <AppText variant="title1" color="onPrimary">
              {nextLesson.title[language]}
            </AppText>
            <View style={styles.heroMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <AppText variant="subhead" color="onPrimary">
                  {nextLesson.start} – {nextLesson.end}
                </AppText>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={16} color="#FFFFFF" />
                <AppText variant="subhead" color="onPrimary">
                  {t('room', { room: nextLesson.room })}
                </AppText>
              </View>
            </View>
          </LinearGradient>
        </PressableScale>
      </FadeIn>

      <FadeIn delay={120}>
        <SectionTitle
          title={t('quickActions')}
          actionLabel={t('seeAll')}
          onAction={() => navigation.navigate('Services')}
        />
      </FadeIn>
      <FadeIn delay={170}>
        <Card style={styles.quickRow}>
          {quickServices.map((service) => (
            <PressableScale
              key={service.id}
              onPress={() => openService(service)}
              style={styles.quickItem}
              accessibilityLabel={service.title[language]}
            >
              <GradientIcon icon={service.icon} colors={service.gradient} size={52} />
              <AppText variant="caption" center numberOfLines={1}>
                {service.title[language]}
              </AppText>
            </PressableScale>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={230}>
        <SectionTitle title={t('schedule')} />
      </FadeIn>
      <FadeIn delay={280}>
        <ListGroup>
          {todayLessons.map((lesson, index) => (
            <View key={lesson.id} style={styles.lesson}>
              <View style={styles.lessonTime}>
                <AppText variant="subhead" style={styles.bold}>
                  {lesson.start}
                </AppText>
                <AppText variant="caption" color="muted">
                  {lesson.end}
                </AppText>
              </View>
              <View
                style={[
                  styles.lessonBar,
                  { backgroundColor: index === 0 ? colors.primary : colors.separator },
                ]}
              />
              <View style={styles.flex}>
                <AppText variant="headline" numberOfLines={1}>
                  {lesson.title[language]}
                </AppText>
                <AppText variant="footnote" color="muted">
                  {t('room', { room: lesson.room })}
                </AppText>
              </View>
            </View>
          ))}
        </ListGroup>
      </FadeIn>

      <FadeIn delay={340}>
        <SectionTitle title={t('news')} />
      </FadeIn>
      <FadeIn delay={390}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newsRow}
          style={styles.newsScroll}
        >
          {news.map((item) => (
            <Card key={item.id} style={styles.newsCard}>
              <View style={styles.newsTag}>
                <View style={[styles.newsIcon, { backgroundColor: item.color + '26' }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <AppText variant="caption" style={{ color: item.color }}>
                  {item.tag[language].toUpperCase()}
                </AppText>
              </View>
              <AppText variant="headline">{item.title[language]}</AppText>
            </Card>
          ))}
        </ScrollView>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroShadow: {
    borderRadius: radius.xl,
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 6,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.lg - 4,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -70,
    top: -90,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLabel: {
    opacity: 0.85,
    letterSpacing: 0.8,
  },
  heroChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  quickItem: {
    alignItems: 'center',
    gap: 6,
    width: 72,
  },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  lessonTime: {
    width: 46,
    alignItems: 'flex-start',
  },
  lessonBar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  newsScroll: {
    marginHorizontal: -spacing.md,
  },
  newsRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.md - 4,
    paddingBottom: spacing.sm,
  },
  newsCard: {
    width: 250,
    gap: spacing.sm + 2,
  },
  newsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  newsIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
