import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { transcript } from '../data/academic';
import { useSettings } from '../context/SettingsContext';
import { AppText, FadeIn, ListGroup, ListRow, Screen, ScoreBadge } from '../components';
import { spacing } from '../styles/theme';
import { weightedGpa } from '../utils/grades';
import { overallGpa } from './JournalScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Transcript'>;

export function TranscriptScreen({ navigation }: Props) {
  const { language, t } = useSettings();

  return (
    <Screen
      title={t('transcript')}
      subtitle={`${t('overallGpa')}: ${overallGpa?.toFixed(2) ?? '—'}`}
      onBack={() => navigation.goBack()}
    >
      {transcript.map((term, index) => (
        <FadeIn key={term.term} delay={index * 60}>
          <View style={styles.header}>
            <AppText variant="footnote" color="muted" style={styles.bold}>
              {t('termN', { n: term.term }).toUpperCase()} · {term.year}
            </AppText>
            <AppText variant="footnote" color="primary" style={styles.bold}>
              GPA {weightedGpa(term.subjects)?.toFixed(2)}
            </AppText>
          </View>
          <ListGroup>
            {term.subjects.map((subject) => (
              <ListRow
                key={subject.title.en}
                title={subject.title[language]}
                right={<ScoreBadge score={subject.score} />}
                chevron={false}
              />
            ))}
          </ListGroup>
        </FadeIn>
      ))}
      <AppText variant="caption" color="muted" center>
        {t('demoData')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  bold: {
    fontWeight: '600',
  },
});
