import React, { forwardRef, ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IconName } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { radius, spacing, typography } from '../styles/theme';
import { AppText } from './AppText';
import { AUTH } from './AuthLayout';

type Props = TextInputProps & {
  label: string;
  icon: IconName;
  error?: string | null;
  // Өрістің оң жағындағы элемент (мысалы, құпиясөзді көрсету батырмасы)
  right?: ReactNode;
};

// Кіру/тіркелу өрісі: көрінетін жазу (label), белгіше және өрістің дәл астындағы қате
export const FormField = forwardRef<TextInput, Props>(function FormField(
  { label, icon, error, right, ...input },
  ref
) {
  const { scale } = useSettings();

  return (
    <View style={styles.field}>
      <AppText variant="footnote" style={styles.label}>
        {label}
      </AppText>
      <View style={[styles.row, error ? styles.rowError : null]}>
        <Ionicons name={icon} size={20} color={AUTH.muted} />
        <TextInput
          ref={ref}
          placeholderTextColor={AUTH.placeholder}
          accessibilityLabel={label}
          accessibilityHint={error ?? undefined}
          {...input}
          style={[styles.input, { fontSize: scale(typography.body.size) }]}
        />
        {right}
      </View>
      {error ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={15} color={AUTH.error} />
          <AppText variant="footnote" style={styles.errorText}>
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: AUTH.muted,
    fontWeight: '600',
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: radius.md + 2,
    backgroundColor: AUTH.input,
    borderWidth: 1,
    borderColor: AUTH.inputBorder,
  },
  rowError: {
    borderColor: AUTH.error,
  },
  input: {
    flex: 1,
    color: AUTH.text,
    paddingVertical: 14,
    outlineStyle: 'none',
  } as object,
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 4,
  },
  errorText: {
    flex: 1,
    color: AUTH.error,
  },
});
