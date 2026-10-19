import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { findSubject, lessonsOn } from '../data/academic';
import { useSettings } from '../context/SettingsContext';
import { AppText, Card, EmptyState, FadeIn, PressableScale, Screen } from '../components';
import { radius, spacing } from '../styles/theme';
import { clock, weekdayName, weekdayShort } from '../utils/date';
import { selectionFeedback } from '../utils/motion';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Schedule'>,
  NativeStackScreenProps<RootStackParamList>
>;

const DAYS = [1, 2, 3, 4, 5, 6];

export function ScheduleScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();
  const today = new Date().getDay();
  // Жексенбіде дүйсенбінің кестесі ашылады
  const [day, setDay] = useState(today === 0 ? 1 : today);
  const lessons = lessonsOn(day);
  const now = clock();

  return (
    <Screen title={t('tabSchedule')} subtitle={weekdayName(day, language)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.days}
        style={styles.daysScroll}
        accessibilityRole="tablist"
      >
        {DAYS.map((d) => {
          const selected = d === day;
          const count = lessonsOn(d).length;
          return (
            <Pressable
              key={d}
              onPress={() => {
                selectionFeedback();
                setDay(d);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`${weekdayName(d, language)}, ${t('lessonsCount', { n: count })}`}
              style={[
                styles.day,
                { backgroundColor: selected ? colors.primary : colors.card, borderColor: colors.border },
              ]}
            >
              <AppText
                variant="subhead"
                style={[styles.dayText, { color: selected ? colors.elevated : colors.text }]}
              >
                {weekdayShort[language][d]}
              </AppText>
              <AppText variant="caption" style={{ color: selected ? colors.elevated : colors.muted }}>
                {count || '—'}
              </AppText>
              {d === today ? (
                <View style={[styles.todayDot, { backgroundColor: selected ? colors.elevated : colors.accent }]} />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {lessons.length === 0 ? (
        <EmptyState icon="cafe-outline" title={t('restDay')} message={t('noLessonsToday')} />
      ) : (
        lessons.map((lesson, index) => {
          const subject = findSubject(lesson.subjectId);
          if (!subject) return null;
          const isNow = day === today && lesson.start <= now && now < lesson.end;
          return (
            <FadeIn key={lesson.id} delay={40 + index * 50}>
              <PressableScale
                scaleTo={0.98}
                onPress={() => navigation.navigate('Subject', { subjectId: subject.id })}
                accessibilityLabel={`${lesson.start}–${lesson.end}, ${subject.title[language]}`}
              >
                <Card style={[styles.lesson, isNow && { borderColor: colors.accent, borderWidth: 2 }]}>
                  <View style={styles.time}>
                    <AppText variant="headline">{lesson.start}</AppText>
                    <AppText variant="caption" color="muted">
                      {lesson.end}
                    </AppText>
                  </View>
                  <View style={[styles.bar, { backgroundColor: subject.color }]} />
                  <View style={styles.flex}>
                    {isNow ? (
                      <View style={[styles.nowChip, { backgroundColor: colors.accent }]}>
                        <AppText variant="caption" style={{ color: colors.onAccent, fontWeight: '700' }}>
                          {t('now').toUpperCase()}
                        </AppText>
                      </View>
                    ) : null}
                    <AppText variant="headline" numberOfLines={2}>
                      {subject.title[language]}
                    </AppText>
                    <View style={styles.metaRow}>
                      <Ionicons name="book-outline" size={14} color={colors.muted} />
                      <AppText variant="footnote" color="muted">
                        {t(lesson.type)}
                      </AppText>
                      <Ionicons name="location-outline" size={14} color={colors.muted} />
                      <AppText variant="footnote" color="muted">
                        {t('room', { room: lesson.room })}
                      </AppText>
                    </View>
                    <AppText variant="footnote" color="muted">
                      {subject.teacher}
                    </AppText>
                  </View>
                </Card>
              </PressableScale>
            </FadeIn>
          );
        })
      )}

      <AppText variant="caption" color="muted" center>
        {t('demoData')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    gap: 2,
  },
  daysScroll: {
    marginHorizontal: -spacing.md,
  },
  days: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  day: {
    width: 56,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  dayText: {
    fontWeight: '700',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 2,
  },
  lesson: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md - 4,
  },
  time: {
    width: 52,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  nowChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
});
