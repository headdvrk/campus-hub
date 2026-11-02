import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSettings } from '../context/SettingsContext';

const eventTypes = ['Хакатон', 'Семинар', 'Шеберлік сабағы'] as const;
type EventType = (typeof eventTypes)[number] | '';

type FormErrors = {
  fullName?: string;
  group?: string;
  eventType?: string;
  eventDate?: string;
  participants?: string;
  comment?: string;
  accepted?: string;
};

function isRealDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function EventRegistrationScreen() {
  const { colors } = useSettings();

  const [fullName, setFullName] = useState('');
  const [group, setGroup] = useState('');
  const [eventType, setEventType] = useState<EventType>('');
  const [eventDate, setEventDate] = useState('');
  const [participants, setParticipants] = useState('1');
  const [comment, setComment] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [summary, setSummary] = useState('');

  function clearError(field: keyof FormErrors) {
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (fullName.trim().length < 3) {
      next.fullName = 'Кемінде 3 таңба енгізіңіз';
    }

    if (!group.trim()) {
      next.group = 'Топ атауын енгізіңіз';
    }

    if (!eventType) {
      next.eventType = 'Іс-шара түрін таңдаңыз';
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      next.eventDate = 'Күн форматы: ЖЖЖЖ-АА-КК';
    } else if (!isRealDate(eventDate)) {
      next.eventDate = 'Мұндай күн жоқ';
    } else {
      const selected = new Date(eventDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        next.eventDate = 'Өткен күнді таңдауға болмайды';
      }
    }

    const count = Number(participants);

    if (!Number.isInteger(count) || count < 1 || count > 5) {
      next.participants = '1-ден 5-ке дейін бүтін сан енгізіңіз';
    }

    if (comment.trim().length < 10) {
      next.comment = 'Кемінде 10 таңба енгізіңіз';
    }

    if (!accepted) {
      next.accepted = 'Ережелермен келісу қажет';
    }

    return next;
  }

  function handleSubmit() {
    const next = validate();
    setErrors(next);
    setSummary('');

    if (Object.keys(next).length > 0) return;

    setSummary(
      `${fullName.trim()} · ${group.trim()}\n` +
      `${eventType} · ${eventDate}\n` +
      `Қатысушылар саны: ${Number(participants)}\n` +
      comment.trim()
    );

    if (Platform.OS !== 'web') {
      Alert.alert('Дайын', 'Іс-шараға тіркелу сәтті аяқталды');
    }
  }

  function showError(field: keyof FormErrors) {
    return errors[field] ? (
      <Text style={{ color: colors.danger }}>{errors[field]}</Text>
    ) : null;
  }

  const inputStyle = (field: keyof FormErrors) => [
    styles.input,
    {
      color: colors.text,
      backgroundColor: colors.input,
      borderColor: errors[field] ? colors.danger : colors.border,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Іс-шараға тіркелу
        </Text>

        <Text style={{ color: colors.muted }}>
          Барлық өрісті толтырып, тіркелу батырмасын басыңыз.
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Аты-жөні</Text>
        <TextInput
          style={inputStyle('fullName')}
          value={fullName}
          onChangeText={value => {
            setFullName(value);
            clearError('fullName');
          }}
          placeholder="Аты-жөніңіз"
          placeholderTextColor={colors.muted}
          maxLength={80}
        />
        {showError('fullName')}

        <Text style={[styles.label, { color: colors.text }]}>Топ</Text>
        <TextInput
          style={inputStyle('group')}
          value={group}
          onChangeText={value => {
            setGroup(value);
            clearError('group');
          }}
          placeholder="Топ атауы"
          placeholderTextColor={colors.muted}
          maxLength={30}
        />
        {showError('group')}

        <Text style={[styles.label, { color: colors.text }]}>
          Іс-шара түрі
        </Text>
        <View style={styles.options}>
          {eventTypes.map(item => (
            <Pressable
              key={item}
              onPress={() => {
                setEventType(item);
                clearError('eventType');
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: eventType === item }}
              style={[
                styles.option,
                {
                  backgroundColor:
                    eventType === item ? colors.accent : colors.input,
                },
              ]}
            >
              <Text
                style={{
                  color: eventType === item ? colors.onAccent : colors.text,
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
        {showError('eventType')}

        <Text style={[styles.label, { color: colors.text }]}>
          Іс-шара күні
        </Text>
        <TextInput
          style={inputStyle('eventDate')}
          value={eventDate}
          onChangeText={value => {
            setEventDate(value);
            clearError('eventDate');
          }}
          placeholder="ЖЖЖЖ-АА-КК"
          placeholderTextColor={colors.muted}
          maxLength={10}
        />
        {showError('eventDate')}

        <Text style={[styles.label, { color: colors.text }]}>
          Қатысушылар саны
        </Text>
        <TextInput
          style={inputStyle('participants')}
          value={participants}
          onChangeText={value => {
            setParticipants(value);
            clearError('participants');
          }}
          keyboardType="number-pad"
          placeholder="1–5"
          placeholderTextColor={colors.muted}
        />
        {showError('participants')}

        <Text style={[styles.label, { color: colors.text }]}>
          Түсіндірме
        </Text>
        <TextInput
          style={[
            ...inputStyle('comment'),
            { minHeight: 100, textAlignVertical: 'top' },
          ]}
          value={comment}
          onChangeText={value => {
            setComment(value);
            clearError('comment');
          }}
          placeholder="Қатысу мақсатыңызды жазыңыз"
          placeholderTextColor={colors.muted}
          multiline
          maxLength={200}
        />
        <Text style={{ color: colors.muted }}>{comment.length}/200</Text>
        {showError('comment')}

        <Pressable
          onPress={() => {
            setAccepted(value => !value);
            clearError('accepted');
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          style={[styles.option, { backgroundColor: colors.input }]}
        >
          <Text style={{ color: colors.text }}>
            {accepted ? '☑' : '☐'} Ережелермен келісемін
          </Text>
        </Pressable>
        {showError('accepted')}

        <Pressable
          onPress={handleSubmit}
          accessibilityRole="button"
          style={[styles.button, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.buttonText, { color: colors.onAccent }]}>
            Тіркелу
          </Text>
        </Pressable>

        {!!summary && (
          <View
            style={[
              styles.result,
              { backgroundColor: colors.card, borderColor: colors.success },
            ]}
          >
            <Text style={[styles.label, { color: colors.success }]}>
              Тіркелу сәтті аяқталды!
            </Text>
            <Text style={{ color: colors.text, lineHeight: 24 }}>
              {summary}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 10,
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
  },
  title: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { padding: 14, borderRadius: 12 },
  button: { padding: 16, borderRadius: 16, alignItems: 'center' },
  buttonText: { fontSize: 17, fontWeight: '700' },
  result: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 10 },
});