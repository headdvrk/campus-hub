import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { useSettings } from '../context/SettingsContext';
import { AppText, Card, PrimaryButton } from '../components';
import { fontSize, radius, spacing } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { colors, scale, t } = useSettings();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!login.trim() || password.length < 6) {
      Alert.alert(t('errorTitle'), t('loginError'));
      return;
    }
    navigation.replace('Main');
  };

  const inputStyle = [
    styles.input,
    {
      borderColor: colors.border,
      color: colors.text,
      backgroundColor: colors.background,
      fontSize: scale(fontSize.md),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Card style={styles.card}>
        <Ionicons
          name="school"
          size={56}
          color={colors.primary}
          style={styles.logo}
        />
        <AppText size="xxl" bold center>
          Campus Hub
        </AppText>
        <AppText color="muted" center style={styles.subtitle}>
          {t('loginSubtitle')}
        </AppText>

        <TextInput
          style={inputStyle}
          placeholder={t('loginPlaceholder')}
          placeholderTextColor={colors.muted}
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={inputStyle}
          placeholder={t('passwordPlaceholder')}
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        <PrimaryButton title={t('loginButton')} onPress={handleLogin} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md - 4,
  },
  logo: {
    alignSelf: 'center',
  },
  subtitle: {
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
