import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { CURRENT_TERM, subjects, transcript } from '../data/academic';
import { useSettings } from '../context/SettingsContext';
import {
  AppText,
  Card,
  FadeIn,
  GradientIcon,
  PressableScale,
  Screen,
  ScoreBadge,
  toneFor,
} from '../components';
import { radius, spacing } from '../styles/theme';
import { admissionRating, weightedGpa } from '../utils/grades';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Journal'>,
  NativeStackScreenProps<RootStackParamList>
>;

// Аяқталған семестрлер бойынша жалпы GPA (транскрипттен)
export const overallGpa = weightedGpa(
  transcript.flatMap((term) => term.subjects.map((s) => ({ score: s.score, credits: s.credits })))
);

function Stat({ label, value, icon }: { label: string; value: string; icon: 'school' | 'trending-up' | 'calendar-clear' }) {
  const { colors } = useSettings();
  return (
    <Card style={styles.stat}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <AppText variant="title2">{value}</AppText>
      <AppText variant="caption" color="muted" numberOfLines={2}>
        {label}
      </AppText>
    </Card>
  );
}

export function JournalScreen({ navigation }: Props) {
  const { colors, language, t } = useSettings();

  const ratings = subjects
    .map((s) => admissionRating(s.rk1, s.rk2))
    .filter((r): r is number => r !== null);
  const avgRating = ratings.length
    ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
    : null;
  const absences = subjects.reduce((n, s) => n + s.marks.filter((m) => m.absent).length, 0);

  return (
    <Screen
      title={t('tabJournal')}
      subtitle={t('journalSubtitle', {
        term: CURRENT_TERM.term,
        week: CURRENT_TERM.week,
        total: CURRENT_TERM.totalWeeks,
      })}
    >
      <FadeIn style={styles.stats}>
        <Stat icon="school" label={t('overallGpa')} value={overallGpa?.toFixed(2) ?? '—'} />
        <Stat icon="trending-up" label={t('avgRating')} value={avgRating?.toString() ?? '—'} />
        <Stat icon="calendar-clear" label={t('absences')} value={String(absences)} />
      </FadeIn>

      {subjects.map((subject, index) => {
        const rating = admissionRating(subject.rk1, subject.rk2);
        const missed = subject.marks.filter((m) => m.absent).length;
        return (
          <FadeIn key={subject.id} delay={60 + index * 40}>
            <PressableScale
              scaleTo={0.98}
              onPress={() => navigation.navigate('Subject', { subjectId: subject.id })}
              accessibilityLabel={subject.title[language]}
            >
              <Card>
                <View style={styles.row}>
                  <GradientIcon icon={subject.icon} colors={[subject.color, colors.hero[1]]} size={44} />
                  <View style={styles.flex}>
                    <AppText variant="headline" numberOfLines={2}>
                      {subject.title[language]}
                    </AppText>
                    <AppText variant="footnote" color="muted">
                      {subject.teacher} · {t('credits', { n: subject.credits })}
                    </AppText>
                  </View>
                  <ScoreBadge score={rating} />
                </View>

                {/* Рейтинг шкаласы: 50 — емтиханға жіберілу шегі */}
                <View style={[styles.track, { backgroundColor: colors.input }]}>
                  {rating !== null ? (
                    <View
                      style={[
                        styles.fill,
                        { width: `${rating}%`, backgroundColor: colors[toneFor(rating)] },
                      ]}
                    />
                  ) : null}
                  <View style={[styles.threshold, { backgroundColor: colors.muted }]} />
                </View>

                <View style={styles.meta}>
                  <AppText variant="caption" color="muted">
                    {t('rk1')}: {subject.rk1 ?? '—'}   {t('rk2')}: {subject.rk2 ?? '—'}   {t('exam')}: {subject.exam ?? '—'}
                  </AppText>
                  {missed > 0 ? (
                    <AppText variant="caption" color="danger">
                      {t('absences')}: {missed}
                    </AppText>
                  ) : null}
                </View>
              </Card>
            </PressableScale>
          </FadeIn>
        );
      })}

      <AppText variant="caption" color="muted" center>
        {t('demoData')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 4,
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  threshold: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
