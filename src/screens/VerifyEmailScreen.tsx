import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { AppText, AUTH, AuthLayout, PrimaryButton } from '../components';
import { TranslationKey } from '../i18n/translations';
import { radius } from '../styles/theme';
import { errorFeedback } from '../utils/motion';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

// Supabase әдепкіде 6 таңбалы код жібереді (жоба баптауында 6–10 болуы мүмкін)
const MIN_CODE = 6;
const MAX_CODE = 10;
const RESEND_SECONDS = 60;

export function VerifyEmailScreen({ route, navigation }: Props) {
  const { email } = route.params;
  const { t, scale } = useSettings();
  const { verifyEmail, resendCode, isDemo, demoCode } = useAuth();

  const [code, setCode] = useState('');
  const [error, setError] = useState<TranslationKey | null>(null);
  const [info, setInfo] = useState<TranslationKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  // Кодты қайта жіберуге дейінгі кері санақ
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (code.length < MIN_CODE) {
      errorFeedback();
      setError('errCode');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await verifyEmail(email, code);
    setLoading(false);
    if (result.error) {
      errorFeedback();
      setError(result.error);
    }
    // Сәтті болса, сессия ашылып, RootNavigator басты экранға ауысады
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    const result = await resendCode(email);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo('authCodeResent');
    setCooldown(RESEND_SECONDS);
    setCode('');
  };

  return (
    <AuthLayout
      title={t('authVerifyTitle')}
      subtitle={t('authVerifySubtitle', { email })}
      onBack={() => navigation.goBack()}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="mail-unread-outline" size={36} color={AUTH.accent} />
      </View>

      {isDemo && demoCode ? (
        <View style={styles.demo} accessibilityLiveRegion="polite">
          <Ionicons name="information-circle" size={18} color={AUTH.link} />
          <AppText variant="subhead" style={styles.infoText}>
            {t('demoCodeNotice', { code: demoCode })}
          </AppText>
        </View>
      ) : null}

      <TextInput
        value={code}
        onChangeText={(text) => {
          setCode(text.replace(/\D/g, '').slice(0, MAX_CODE));
          setError(null);
        }}
        placeholder="••••••"
        placeholderTextColor={AUTH.placeholder}
        accessibilityLabel={t('authCodeLabel')}
        accessibilityHint={error ? t(error) : undefined}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={MAX_CODE}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleVerify}
        style={[
          styles.codeInput,
          { fontSize: scale(30) },
          error ? styles.codeInputError : null,
        ]}
      />

      {error ? (
        <View style={styles.message} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={16} color={AUTH.error} />
          <AppText variant="footnote" style={styles.errorText}>
            {t(error)}
          </AppText>
        </View>
      ) : null}
      {info ? (
        <View style={styles.message} accessibilityLiveRegion="polite">
          <Ionicons name="checkmark-circle" size={16} color={AUTH.text} />
          <AppText variant="footnote" style={styles.infoText}>
            {t(info)}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        title={t('authVerifyButton')}
        variant="accent"
        onPress={handleVerify}
        loading={loading}
      />

      <Pressable
        onPress={handleResend}
        disabled={cooldown > 0}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityState={{ disabled: cooldown > 0 }}
        style={styles.resend}
      >
        <AppText variant="subhead" style={cooldown > 0 ? styles.resendDisabled : styles.resendActive}>
          {cooldown > 0 ? t('authResendIn', { s: cooldown }) : t('authResend')}
        </AppText>
      </Pressable>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 153, 0, 0.14)',
  },
  codeInput: {
    color: AUTH.text,
    fontWeight: '700',
    letterSpacing: 10,
    textAlign: 'center',
    minHeight: 64,
    borderRadius: radius.md + 2,
    backgroundColor: AUTH.input,
    borderWidth: 1,
    borderColor: AUTH.inputBorder,
    outlineStyle: 'none',
  } as object,
  codeInputError: {
    borderColor: AUTH.error,
  },
  demo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 194, 102, 0.12)',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    flex: 1,
    color: AUTH.error,
  },
  infoText: {
    flex: 1,
    color: AUTH.text,
  },
  resend: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  resendActive: {
    color: AUTH.accent,
    fontWeight: '700',
  },
  resendDisabled: {
    color: AUTH.muted,
  },
});
