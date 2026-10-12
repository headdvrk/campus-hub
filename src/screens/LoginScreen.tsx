import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { PrimaryButton } from '../components';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!login.trim() || password.length < 6) {
      Alert.alert('Қате', 'Логинді және кемінде 6 таңбалы құпиясөзді енгізіңіз');
      return;
    }
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Ionicons
          name="school"
          size={56}
          color={colors.primary}
          style={styles.logo}
        />
        <Text style={styles.title}>Campus Hub</Text>
        <Text style={styles.subtitle}>Жүйеге кіру</Text>

        <TextInput
          style={styles.input}
          placeholder="Логин"
          placeholderTextColor={colors.muted}
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Құпиясөз (кемінде 6 таңба)"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        <PrimaryButton title="Кіру" onPress={handleLogin} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md - 4,
  },
  logo: {
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: fontSize.md,
    color: colors.text,
  },
});
