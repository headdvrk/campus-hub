import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types/navigation';
import { IconName } from '../types/service';
import { LANGUAGES } from '../types/settings';
import { useSettings } from '../context/SettingsContext';
import { languageShortNames } from '../i18n/translations';
import { AppText, FadeIn, PrimaryButton } from '../components';
import { radius, spacing, typography } from '../styles/theme';
import { errorFeedback, selectionFeedback, useNativeDriver } from '../utils/motion';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Фондағы ақырын қалқып жүретін безендіру шеңбері
function FloatingBlob({ size, top, left, duration }: {
  size: number;
  top: number;
  left: number;
  duration: number;
}) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float, duration]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.blob,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
          transform: [
            { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }) },
            { scale: float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) },
          ],
        },
      ]}
    />
  );
}

function InputRow({
  icon,
  children,
  right,
}: {
  icon: IconName;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  const { colors } = useSettings();
  return (
    <View style={[styles.inputRow, { backgroundColor: colors.input }]}>
      <Ionicons name={icon} size={20} color={colors.muted} />
      {children}
      {right}
    </View>
  );
}

export function LoginScreen({ navigation }: Props) {
  const { colors, scale, language, setLanguage, t } = useSettings();
  const insets = useSafeAreaInsets();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;
  const logo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(logo, {
      toValue: 1,
      useNativeDriver,
      speed: 6,
      bounciness: 12,
    }).start();
  }, [logo]);

  const runShake = () => {
    shake.setValue(0);
    Animated.sequence(
      [10, -10, 8, -8, 4, 0].map((toValue) =>
        Animated.timing(shake, { toValue, duration: 50, useNativeDriver })
      )
    ).start();
  };

  const handleLogin = () => {
    if (!login.trim() || password.length < 6) {
      setError(true);
      runShake();
      errorFeedback();
      // Браузерде Alert көрсетілмейді, сондықтан қате формада да шығады
      if (Platform.OS !== 'web') Alert.alert(t('errorTitle'), t('loginError'));
      return;
    }
    setError(false);
    navigation.replace('Main');
  };

  const cycleLanguage = () => {
    selectionFeedback();
    const next = LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length];
    setLanguage(next);
  };

  const inputStyle = [
    styles.input,
    { color: colors.text, fontSize: scale(typography.body.size) },
  ];

  return (
    <LinearGradient
      colors={colors.hero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.flex}
    >
      <FloatingBlob size={260} top={-60} left={-80} duration={4200} />
      <FloatingBlob size={200} top={180} left={220} duration={5200} />
      <FloatingBlob size={320} top={520} left={-120} duration={6000} />

      <Pressable
        onPress={cycleLanguage}
        style={[styles.langPill, { top: insets.top + spacing.sm }]}
        accessibilityRole="button"
        accessibilityLabel={t('language')}
      >
        <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
        <AppText variant="footnote" style={styles.langText}>
          {languageShortNames[language]}
        </AppText>
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 56, paddingBottom: insets.bottom + spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.header,
              {
                opacity: logo,
                transform: [
                  { scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                ],
              },
            ]}
          >
            <View style={styles.logo}>
              <Ionicons name="school" size={44} color={colors.hero[0]} />
            </View>
            <AppText variant="largeTitle" color="onPrimary" center>
              Campus Hub
            </AppText>
            <AppText color="onPrimary" center style={styles.subtitle}>
              {t('loginSubtitle')}
            </AppText>
          </Animated.View>

          <FadeIn delay={150} offset={30}>
            <Animated.View
              style={[
                styles.card,
                { backgroundColor: colors.card, transform: [{ translateX: shake }] },
              ]}
            >
              <InputRow icon="person-outline">
                <TextInput
                  style={inputStyle}
                  placeholder={t('loginPlaceholder')}
                  placeholderTextColor={colors.muted}
                  value={login}
                  onChangeText={(text) => {
                    setLogin(text);
                    setError(false);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </InputRow>
              <InputRow
                icon="lock-closed-outline"
                right={
                  <Pressable
                    onPress={() => setShowPassword((value) => !value)}
                    hitSlop={10}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.muted}
                    />
                  </Pressable>
                }
              >
                <TextInput
                  style={inputStyle}
                  placeholder={t('passwordPlaceholder')}
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(false);
                  }}
                  secureTextEntry={!showPassword}
                  onSubmitEditing={handleLogin}
                  returnKeyType="go"
                />
              </InputRow>

              {error ? (
                <FadeIn offset={-6} style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <AppText variant="footnote" color="danger" style={styles.flex}>
                    {t('loginError')}
                  </AppText>
                </FadeIn>
              ) : null}

              <View style={styles.buttonWrap}>
                <PrimaryButton title={t('loginButton')} onPress={handleLogin} />
              </View>

              <AppText variant="caption" color="muted" center>
                {t('loginHint')}
              </AppText>
            </Animated.View>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  langPill: {
    position: 'absolute',
    right: spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  langText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  subtitle: {
    opacity: 0.85,
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg - 4,
    gap: spacing.md - 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    outlineStyle: 'none',
  } as object,
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonWrap: {
    marginTop: spacing.xs,
  },
});
