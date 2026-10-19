import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { findSubject } from '../data/academic';
import { useSettings } from '../context/SettingsContext';
import {
  AppText,
  Card,
  EmptyState,
  FadeIn,
  ListGroup,
  ListRow,
  Screen,
  ScoreBadge,
} from '../components';
import { radius, spacing } from '../styles/theme';
import { ADMISSION_MIN, admissionRating, finalScore, letterFor } from '../utils/grades';

type Props = NativeStackScreenProps<RootStackParamList, 'Subject'>;

export function SubjectScreen({ route, navigation }: Props) {
  const { colors, language, t } = useSettings();
  const subject = findSubject(route.params.subjectId);

  if (!subject) {
    return (
      <Screen title={t('tabJournal')} onBack={() => navigation.goBack()}>
        <EmptyState icon="alert-circle-outline" title={t('notFoundTitle')} />
      </Screen>
    );
  }

  const rating = admissionRating(subject.rk1, subject.rk2);
  const final = finalScore(subject.rk1, subject.rk2, subject.exam);
  const attended = subject.marks.filter((m) => !m.absent).length;
  const attendance = subject.marks.length
    ? Math.round((attended / subject.marks.length) * 100)
    : null;

  const scoreRow = (title: string, score: number | null) => (
    <ListRow title={title} right={<ScoreBadge score={score} />} chevron={false} />
  );

  return (
    <Screen title={subject.title[language]} onBack={() => navigation.goBack()}>
      <FadeIn>
        <LinearGradient
          colors={[subject.color, colors.hero[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Ionicons name={subject.icon} size={28} color="#FFFFFF" />
          <View style={styles.heroRow}>
            <View style={styles.flex}>
              <AppText variant="caption" color="onPrimary" style={styles.heroLabel}>
                {t('teacher').toUpperCase()}
              </AppText>
              <AppText variant="headline" color="onPrimary">
                {subject.teacher}
              </AppText>
            </View>
            <View style={styles.heroChip}>
              <AppText variant="footnote" color="onPrimary" style={styles.bold}>
                {t('credits', { n: subject.credits })}
              </AppText>
            </View>
          </View>
        </LinearGradient>
      </FadeIn>

      <FadeIn delay={60}>
        <ListGroup>
          {scoreRow(t('rk1'), subject.rk1)}
          {scoreRow(t('rk2'), subject.rk2)}
          {scoreRow(t('admission'), rating)}
          {scoreRow(t('exam'), subject.exam)}
          {scoreRow(t('finalGrade'), final)}
        </ListGroup>
      </FadeIn>

      <FadeIn delay={100}>
        <Card>
          <AppText variant="footnote" color="muted">
            {t('gradingNote')}
          </AppText>
          {final !== null ? (
            <AppText variant="subhead">
              GPA: {letterFor(final).points.toFixed(2)} ({letterFor(final).letter})
            </AppText>
          ) : (
            <AppText variant="subhead" color="muted">
              {t('finalGrade')}: {t('notGraded').toLowerCase()}
            </AppText>
          )}
          {rating !== null && rating < ADMISSION_MIN ? (
            <View style={styles.warning}>
              <Ionicons name="warning" size={16} color={colors.danger} />
              <AppText variant="footnote" color="danger" style={styles.flex}>
                {t('admissionRisk')}
              </AppText>
            </View>
          ) : null}
        </Card>
      </FadeIn>

      <FadeIn delay={140}>
        <AppText variant="footnote" color="muted" style={styles.section}>
          {t('attendance').toUpperCase()}
        </AppText>
        <Card>
          <View style={styles.attendanceRow}>
            <AppText variant="title2">{attendance !== null ? `${attendance}%` : '—'}</AppText>
            <AppText variant="subhead" color="muted">
              {attended} / {subject.marks.length}
            </AppText>
          </View>
          <View style={[styles.track, { backgroundColor: colors.input }]}>
            <View
              style={[
                styles.fill,
                { width: `${attendance ?? 0}%`, backgroundColor: colors.success },
              ]}
            />
          </View>
        </Card>
      </FadeIn>

      <FadeIn delay={180}>
        <AppText variant="footnote" color="muted" style={styles.section}>
          {t('weeklyMarks').toUpperCase()}
        </AppText>
        <ListGroup>
          {subject.marks.map((mark) => (
            <ListRow
              key={`${mark.week}-${mark.type}`}
              title={`${t('weekN', { n: mark.week })} · ${t(mark.type)}`}
              chevron={false}
              right={
                mark.absent ? (
                  <AppText variant="subhead" color="danger" style={styles.bold}>
                    {t('absentMark')}
                  </AppText>
                ) : (
                  <ScoreBadge score={mark.mark} />
                )
              }
            />
          ))}
        </ListGroup>
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
  hero: {
    borderRadius: radius.xl,
    padding: spacing.lg - 4,
    gap: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  heroLabel: {
    opacity: 0.85,
    letterSpacing: 0.6,
  },
  heroChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  section: {
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
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
});
