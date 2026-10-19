import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { FACULTIES, Faculty, facultyKey } from '../types/profile';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { AppText, AUTH, AuthLayout, FormField, PrimaryButton } from '../components';
import { TranslationKey } from '../i18n/translations';
import { radius, spacing } from '../styles/theme';
import { errorFeedback, selectionFeedback } from '../utils/motion';
import {
  isStrongPassword,
  isValidEmail,
  isValidGroup,
  isValidName,
  normalizePhone,
} from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

type Field = 'firstName' | 'lastName' | 'email' | 'phone' | 'faculty' | 'group' | 'password' | 'confirm';

export function RegisterScreen({ navigation }: Props) {
  const { t } = useSettings();
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    group: '',
    password: '',
    confirm: '',
  });
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, TranslationKey>>>({});
  const [formError, setFormError] = useState<TranslationKey | null>(null);
  const [loading, setLoading] = useState(false);

  const refs = {
    lastName: useRef<TextInput>(null),
    email: useRef<TextInput>(null),
    phone: useRef<TextInput>(null),
    group: useRef<TextInput>(null),
    password: useRef<TextInput>(null),
    confirm: useRef<TextInput>(null),
  };

  // Өріс өзгергенде оның қатесі бірден жойылады
  const update = (field: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<Field, TranslationKey>> = {};
    if (!isValidName(form.firstName)) next.firstName = 'errName';
    if (!isValidName(form.lastName)) next.lastName = 'errName';
    if (!isValidEmail(form.email)) next.email = 'errEmail';
    if (!normalizePhone(form.phone)) next.phone = 'errPhone';
    if (!faculty) next.faculty = 'errFaculty';
    if (!isValidGroup(form.group)) next.group = 'errGroup';
    if (!isStrongPassword(form.password)) next.password = 'errPassword';
    if (form.confirm !== form.password) next.confirm = 'errConfirm';
    return next;
  };

  const handleRegister = async () => {
    const next = validate();
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) {
      errorFeedback();
      setFormError('errFixFields');
      return;
    }

    setLoading(true);
    const result = await signUp({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: normalizePhone(form.phone)!,
      faculty: faculty!,
      group: form.group,
      password: form.password,
    });
    setLoading(false);
    if (result.error) {
      errorFeedback();
      setFormError(result.error);
      return;
    }
    if (result.needsCode) navigation.navigate('VerifyEmail', { email: form.email.trim() });
  };

  const err = (field: Field) => (errors[field] ? t(errors[field]!) : null);

  return (
    <AuthLayout
      title={t('authRegisterTitle')}
      subtitle={t('authRegisterSubtitle')}
      onBack={() => navigation.goBack()}
    >
      <View style={styles.row}>
        <View style={styles.flex}>
          <FormField
            label={t('authFirstName')}
            icon="person-outline"
            value={form.firstName}
            onChangeText={update('firstName')}
            error={err('firstName')}
            autoComplete="given-name"
            textContentType="givenName"
            returnKeyType="next"
            onSubmitEditing={() => refs.lastName.current?.focus()}
          />
        </View>
        <View style={styles.flex}>
          <FormField
            ref={refs.lastName}
            label={t('authLastName')}
            icon="person-outline"
            value={form.lastName}
            onChangeText={update('lastName')}
            error={err('lastName')}
            autoComplete="family-name"
            textContentType="familyName"
            returnKeyType="next"
            onSubmitEditing={() => refs.email.current?.focus()}
          />
        </View>
      </View>

      <FormField
        ref={refs.email}
        label={t('authEmail')}
        icon="mail-outline"
        placeholder="name@example.com"
        value={form.email}
        onChangeText={update('email')}
        error={err('email')}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => refs.phone.current?.focus()}
      />

      <FormField
        ref={refs.phone}
        label={t('authPhone')}
        icon="call-outline"
        placeholder="+7 7__ ___ __ __"
        value={form.phone}
        onChangeText={update('phone')}
        // Өрістен шыққанда нөмір бірыңғай форматқа келтіріледі
        onBlur={() => {
          const normalized = normalizePhone(form.phone);
          if (normalized) update('phone')(normalized);
        }}
        error={err('phone')}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="next"
        onSubmitEditing={() => refs.group.current?.focus()}
      />

      <View style={styles.field}>
        <AppText variant="footnote" style={styles.label}>
          {t('authFaculty')}
        </AppText>
        <View style={styles.chips} accessibilityRole="radiogroup">
          {FACULTIES.map((item) => {
            const selected = faculty === item;
            return (
              <Pressable
                key={item}
                onPress={() => {
                  selectionFeedback();
                  setFaculty(item);
                  setErrors((current) => ({ ...current, faculty: undefined }));
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.chip, selected && styles.chipSelected, errors.faculty && styles.chipError]}
              >
                {selected ? (
                  <Ionicons name="checkmark-circle" size={18} color={AUTH.onAccent} />
                ) : null}
                <AppText
                  variant="subhead"
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {t(facultyKey[item])}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        {errors.faculty ? (
          <AppText variant="footnote" style={styles.error}>
            {t(errors.faculty)}
          </AppText>
        ) : null}
      </View>

      <FormField
        ref={refs.group}
        label={t('group')}
        icon="people-outline"
        placeholder="660Р"
        value={form.group}
        onChangeText={update('group')}
        error={err('group')}
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => refs.password.current?.focus()}
      />

      <FormField
        ref={refs.password}
        label={t('passwordPlaceholder')}
        icon="lock-closed-outline"
        value={form.password}
        onChangeText={update('password')}
        error={err('password')}
        placeholder={t('authPasswordHint')}
        secureTextEntry={!showPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => refs.confirm.current?.focus()}
        right={
          <Pressable
            onPress={() => setShowPassword((value) => !value)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={t(showPassword ? 'hidePassword' : 'showPassword')}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={AUTH.muted}
            />
          </Pressable>
        }
      />
      <FormField
        ref={refs.confirm}
        label={t('authConfirmPassword')}
        icon="shield-checkmark-outline"
        value={form.confirm}
        onChangeText={update('confirm')}
        error={err('confirm')}
        secureTextEntry={!showPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleRegister}
      />

      {formError ? (
        <View style={styles.formError} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={18} color={AUTH.error} />
          <AppText variant="subhead" style={styles.error}>
            {t(formError)}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        title={t('authCreateAccount')}
        variant="accent"
        onPress={handleRegister}
        loading={loading}
      />
      <AppText variant="caption" style={styles.note} center>
        {t('authCodeNote')}
      </AppText>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md - 4,
  },
  field: {
    gap: 6,
  },
  label: {
    color: AUTH.muted,
    fontWeight: '600',
    marginLeft: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: AUTH.input,
    borderWidth: 1,
    borderColor: AUTH.inputBorder,
  },
  chipSelected: {
    backgroundColor: AUTH.accent,
    borderColor: AUTH.accent,
  },
  chipError: {
    borderColor: AUTH.error,
  },
  chipText: {
    color: AUTH.text,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: AUTH.onAccent,
  },
  error: {
    flex: 1,
    color: AUTH.error,
    marginLeft: 4,
  },
  formError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 180, 171, 0.10)',
  },
  note: {
    color: AUTH.muted,
  },
});
