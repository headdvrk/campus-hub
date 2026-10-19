import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Service } from '../types/service';
import { Announcement } from '../types/announcement';
import { services } from '../data/services';
import { findSubject, lessonsOn } from '../data/academic';
import { getAnnouncements, getCachedAnnouncements } from '../api/announcements';
import { useSettings } from '../context/SettingsContext';
import { useProfile } from '../context/AuthContext';
import {
  AppText,
  Card,
  FadeIn,
  GradientIcon,
  initials,
  ListGroup,
  PressableScale,
  Screen,
  SectionTitle,
} from '../components';
import { radius, spacing } from '../styles/theme';
import { clock, formatDate, formatToday } from '../utils/date';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const quickServices = services.slice(0, 4);

export function HomeScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();
  const profile = useProfile();
  const [latestNews, setLatestNews] = useState<Announcement[]>([]);

  // Бүгінгі кесте және әлі аяқталмаған ең жақын сабақ
  const todayLessons = lessonsOn(new Date().getDay());
  const now = clock();
  const nextLesson = todayLessons.find((lesson) => lesson.end > now) ?? null;
  const nextSubject = nextLesson ? findSubject(nextLesson.subjectId) : undefined;

  // Алдымен кэш бірден көрсетіледі, кейін сайттан жаңартылады;
  // қате болса бөлім жай ғана кэшпен (немесе бос) қалады
  useEffect(() => {
    const controller = new AbortController();
    let fresh = false;
    getCachedAnnouncements(language).then((cached) => {
      if (cached && !fresh && !controller.signal.aborted) setLatestNews(cached);
    });
    getAnnouncements(language, controller.signal)
      .then((data) => {
        fresh = true;
        setLatestNews(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [language]);

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
          {initials(profile)}
        </AppText>
      </LinearGradient>
    </PressableScale>
  );

  return (
    <Screen
      title={t('greeting', { name: profile.firstName })}
      subtitle={formatToday(language)}
      right={avatar}
    >
      <FadeIn delay={50}>
        <PressableScale
          scaleTo={0.98}
          onPress={() =>
            nextSubject
              ? navigation.navigate('Subject', { subjectId: nextSubject.id })
              : navigation.navigate('Schedule')
          }
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
                {(nextSubject ? t('nextLesson') : t('tabSchedule')).toUpperCase()}
              </AppText>
              <View style={styles.heroChip}>
                <AppText variant="caption" color="onPrimary" style={styles.bold}>
                  {t('lessonsToday', { count: todayLessons.length })}
                </AppText>
              </View>
            </View>
            <AppText variant="title1" color="onPrimary">
              {nextSubject
                ? nextSubject.title[language]
                : t(todayLessons.length ? 'lessonsOver' : 'noLessonsToday')}
            </AppText>
            {nextLesson ? (
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
            ) : null}
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
              <AppText variant="caption" center numberOfLines={2}>
                {service.title[language]}
              </AppText>
            </PressableScale>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={230}>
        <SectionTitle
          title={t('schedule')}
          actionLabel={t('seeAll')}
          onAction={() => navigation.navigate('Schedule')}
        />
      </FadeIn>
      <FadeIn delay={280}>
        {todayLessons.length === 0 ? (
          <Card>
            <AppText color="muted">{t('noLessonsToday')}</AppText>
          </Card>
        ) : (
          <ListGroup>
            {todayLessons.map((lesson) => {
              const subject = findSubject(lesson.subjectId);
              const isNext = lesson.id === nextLesson?.id;
              return (
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
                      { backgroundColor: isNext ? colors.accent : subject?.color ?? colors.separator },
                    ]}
                  />
                  <View style={styles.flex}>
                    <AppText variant="headline" numberOfLines={1}>
                      {subject?.title[language]}
                    </AppText>
                    <AppText variant="footnote" color="muted">
                      {t(lesson.type)} · {t('room', { room: lesson.room })}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </ListGroup>
        )}
      </FadeIn>

      <FadeIn delay={340}>
        <SectionTitle
          title={t('news')}
          actionLabel={t('seeAll')}
          onAction={() => navigation.navigate('News')}
        />
      </FadeIn>
      <FadeIn delay={390}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newsRow}
          style={styles.newsScroll}
        >
          {latestNews.slice(0, 5).map((item) => (
            <PressableScale
              key={item.id}
              scaleTo={0.97}
              onPress={() => navigation.navigate('NewsDetails', { announcementId: item.id })}
              accessibilityLabel={item.title}
            >
              <Card padded={false} style={styles.newsCard}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={[styles.newsImage, { backgroundColor: colors.input }]}
                    accessibilityIgnoresInvertColors
                  />
                ) : null}
                <View style={styles.newsBody}>
                  <AppText variant="caption" color="primary">
                    {formatDate(item.date, language)}
                  </AppText>
                  <AppText variant="headline" numberOfLines={3}>
                    {item.title}
                  </AppText>
                </View>
              </Card>
            </PressableScale>
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 130,
  },
  newsBody: {
    padding: spacing.md - 4,
    gap: spacing.xs,
  },
});
