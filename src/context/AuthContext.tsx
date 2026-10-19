import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FACULTIES, SignUpForm, StudentProfile } from '../types/profile';
import { TranslationKey } from '../i18n/translations';
import { useSettings } from './SettingsContext';

// Campus Hub сервері (server/). Телефоннан: компьютердің IP мекенжайы немесе хостинг URL-і
export const AUTH_API = (process.env.EXPO_PUBLIC_AUTH_API ?? 'http://localhost:3000').replace(/\/$/, '');
const SESSION_KEY = '@campus_hub_session';

type AuthResult = { error: TranslationKey | null };

type AuthContextValue = {
  isReady: boolean;
  // Кірген студенттің профилі; null болса — кіру экрандары
  profile: StudentProfile | null;
  // Серверде пошта бапталмаған: код поштаға емес, экранға шығады
  isDemo: boolean;
  demoCode: string | null;
  signIn: (email: string, password: string) => Promise<AuthResult & { unconfirmed?: boolean }>;
  signUp: (form: SignUpForm) => Promise<AuthResult & { needsCode: boolean }>;
  verifyEmail: (email: string, code: string) => Promise<AuthResult>;
  resendCode: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Сервер қатесінің коды → экрандағы хабарлама
const ERRORS: Record<string, TranslationKey> = {
  bad_credentials: 'authInvalidCredentials',
  not_verified: 'authEmailNotConfirmed',
  email_taken: 'authUserExists',
  bad_code: 'authInvalidCode',
  code_wrong: 'authInvalidCode',
  code_expired: 'authInvalidCode',
  code_missing: 'authInvalidCode',
  code_attempts: 'authCodeAttempts',
  weak_password: 'authWeakPassword',
  too_many_requests: 'authRateLimit',
  code_cooldown: 'authRateLimit',
  code_hour_limit: 'authRateLimit',
  email_send_failed: 'authEmailFailed',
  bad_email: 'errEmail',
  bad_phone: 'errPhone',
  bad_name: 'errName',
  bad_group: 'errGroup',
  bad_faculty: 'errFaculty',
};

type ApiReply = { ok: boolean; status: number; data: Record<string, any> };

async function api(path: string, body?: object, token?: string): Promise<ApiReply> {
  try {
    const res = await fetch(AUTH_API + path, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(20000),
    });
    return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
  } catch {
    return { ok: false, status: 0, data: { error: 'network' } };
  }
}

const errorOf = (reply: ApiReply): TranslationKey =>
  reply.status === 0 ? 'authNetwork' : ERRORS[reply.data.error] ?? 'authUnknown';

function toProfile(user: Record<string, any>): StudentProfile {
  return {
    firstName: String(user.firstName ?? ''),
    lastName: String(user.lastName ?? ''),
    email: String(user.email ?? ''),
    phone: String(user.phone ?? ''),
    faculty: FACULTIES.includes(user.faculty) ? user.faculty : 'technology',
    group: String(user.group ?? ''),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { language } = useSettings();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const saveSession = useCallback(async (token: string, user: Record<string, any>) => {
    const next = toProfile(user);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ token, profile: next })).catch(() => {});
    setDemoCode(null);
    setProfile(next);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
    setProfile(null);
  }, []);

  // Сақталған сессия бірден көрсетіледі (желісіз де ашылады), кейін сервер токенді тексереді
  useEffect(() => {
    (async () => {
      let saved: { token?: string; profile?: StudentProfile } | null = null;
      try {
        saved = JSON.parse((await AsyncStorage.getItem(SESSION_KEY)) ?? 'null');
        if (saved?.token && saved.profile) setProfile(saved.profile);
      } catch {
        // бүлінген сессия: кіру экраны көрсетіледі
      }
      setIsReady(true);
      // Токен фонда тексеріледі: 401 болса (мерзімі өтті / барлық құрылғылардан шықты) — шығу
      if (saved?.token) {
        const me = await api('/api/me', undefined, saved.token);
        if (me.ok) await saveSession(saved.token, me.data.user);
        else if (me.status === 401) await signOut();
      }
      const health = await api('/api/health');
      setIsDemo(Boolean(health.data.demo));
    })();
  }, [saveSession, signOut]);

  // Пошта бапталмаған серверде код жауапта келеді (демо режим)
  const noteDemo = (data: Record<string, any>) => {
    if (data.demoCode) {
      setIsDemo(true);
      setDemoCode(String(data.demoCode));
    }
  };

  const signIn = useCallback(
    async (email: string, password: string) => {
      const reply = await api('/api/auth/login', { email, password });
      if (reply.ok) {
        await saveSession(reply.data.token, reply.data.user);
        return { error: null };
      }
      // Расталмаған аккаунт: сервер жаңа код жіберді, растау экраны ашылады
      noteDemo(reply.data);
      return { error: errorOf(reply), unconfirmed: reply.data.error === 'not_verified' };
    },
    [saveSession]
  );

  const signUp = useCallback(
    async (form: SignUpForm) => {
      const reply = await api('/api/auth/register', { ...form, lang: language });
      if (!reply.ok) return { error: errorOf(reply), needsCode: false };
      noteDemo(reply.data);
      return { error: null, needsCode: true };
    },
    [language]
  );

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      const reply = await api('/api/auth/verify', { email, code });
      if (!reply.ok) return { error: errorOf(reply) };
      await saveSession(reply.data.token, reply.data.user);
      return { error: null };
    },
    [saveSession]
  );

  const resendCode = useCallback(async (email: string) => {
    const reply = await api('/api/auth/resend', { email });
    if (!reply.ok) return { error: errorOf(reply) };
    noteDemo(reply.data);
    return { error: null };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isReady, profile, isDemo, demoCode, signIn, signUp, verifyEmail, resendCode, signOut }),
    [isReady, profile, isDemo, demoCode, signIn, signUp, verifyEmail, resendCode, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be inside AuthProvider');
  return value;
}

// Кіргеннен кейінгі экрандар үшін: профиль міндетті түрде бар
export function useProfile(): StudentProfile {
  const { profile } = useAuth();
  if (!profile) throw new Error('useProfile requires a signed-in user');
  return profile;
}
