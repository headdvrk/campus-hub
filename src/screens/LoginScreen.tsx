import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { AppText, AUTH, AuthLayout, FormField, PrimaryButton } from '../components';
import { TranslationKey } from '../i18n/translations';
import { isValidEmail } from '../utils/validation';
import { errorFeedback } from '../utils/motion';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { t } = useSettings();
  const { signIn, isDemo } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: TranslationKey; password?: TranslationKey }>({});
  const [formError, setFormError] = useState<TranslationKey | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = 'errEmail';
    if (!password) next.password = 'errRequired';
    setErrors(next);
    setFormError(null);
    if (next.email || next.password) {
      errorFeedback();
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.unconfirmed) {
      // Пошта расталмаған: сервер жаңа код жіберді, растау экранына өтеміз
      navigation.navigate('VerifyEmail', { email: email.trim() });
      return;
    }
    if (result.error) {
      errorFeedback();
      setFormError(result.error);
    }
    // Сәтті болса, RootNavigator сессияны көріп, басты экранға өзі ауысады
  };

  return (
    <AuthLayout
      title={t('authWelcome')}
      subtitle={t('authLoginSubtitle')}
      footer={
        <View style={styles.footer}>
          <AppText style={styles.footerText}>{t('authNoAccount')}</AppText>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            hitSlop={12}
            accessibilityRole="button"
          >
            <AppText variant="headline" style={styles.link}>
              {t('authRegister')}
            </AppText>
          </Pressable>
        </View>
      }
    >
      <FormField
        label={t('authEmail')}
        icon="mail-outline"
        placeholder="student@alt.edu.kz"
        value={email}
        onChangeText={setEmail}
        error={errors.email ? t(errors.email) : null}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <FormField
        ref={passwordRef}
        label={t('passwordPlaceholder')}
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        error={errors.password ? t(errors.password) : null}
        secureTextEntry={!showPassword}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleLogin}
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

      {formError ? (
        <View style={styles.formError} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={18} color={AUTH.error} />
          <AppText variant="subhead" style={styles.formErrorText}>
            {t(formError)}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        title={t('loginButton')}
        variant="accent"
        onPress={handleLogin}
        loading={loading}
      />
      {isDemo ? (
        <AppText variant="caption" style={styles.footerText} center>
          {t('demoModeHint')}
        </AppText>
      ) : null}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: AUTH.muted,
  },
  link: {
    color: AUTH.link,
  },
  formError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 180, 171, 0.10)',
  },
  formErrorText: {
    flex: 1,
    color: AUTH.error,
  },
});
