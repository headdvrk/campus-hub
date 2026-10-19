import React, { ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LANGUAGES } from '../types/settings';
import { useSettings } from '../context/SettingsContext';
import { languageShortNames } from '../i18n/translations';
import { radius, spacing } from '../styles/theme';
import { selectionFeedback } from '../utils/motion';
import { AppText } from './AppText';
import { FadeIn } from './FadeIn';

// Кіру/тіркелу экрандары тақырыпқа қарамастан ALT-тың қою көк брендтік фонында;
// түстер сол фон үшін тексерілген (мәтін ≥ 4.5:1)
export const AUTH = {
  text: '#FFFFFF',
  muted: 'rgba(255, 255, 255, 0.78)',
  placeholder: 'rgba(255, 255, 255, 0.72)',
  // Қою көк шыны: фонның ең ашық көк жерінде де мәтін контрасты сақталады
  glass: 'rgba(9, 26, 44, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  input: 'rgba(255, 255, 255, 0.07)',
  inputBorder: 'rgba(255, 255, 255, 0.16)',
  error: '#FFB4AB',
  accent: '#FF9900',
  // Карточкадан тыс, тікелей фондағы сілтеме үшін ашығырақ реңк
  link: '#FFC266',
  onAccent: '#091A2C',
};

const backdrop = require('../../assets/backdrop-dark.png');
const logo = require('../../assets/alt-logo.png');

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  // Карточканың астындағы сілтеме (мысалы, «Тіркелу»)
  footer?: ReactNode;
  onBack?: () => void;
};

export function AuthLayout({ title, subtitle, children, footer, onBack }: Props) {
  const { language, setLanguage, t } = useSettings();
  const insets = useSafeAreaInsets();

  const cycleLanguage = () => {
    selectionFeedback();
    setLanguage(LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length]);
  };

  return (
    <View style={styles.flex}>
      <Image source={backdrop} resizeMode="cover" style={[StyleSheet.absoluteFill, styles.backdrop]} />

      <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            style={styles.pill}
            accessibilityRole="button"
            accessibilityLabel={t('back')}
          >
            <Ionicons name="chevron-back" size={20} color={AUTH.text} />
          </Pressable>
        ) : (
          <View />
        )}
        <Pressable
          onPress={cycleLanguage}
          hitSlop={6}
          style={styles.pill}
          accessibilityRole="button"
          accessibilityLabel={t('language')}
        >
          <Ionicons name="globe-outline" size={16} color={AUTH.text} />
          <AppText variant="footnote" style={styles.pillText}>
            {languageShortNames[language]}
          </AppText>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 64, paddingBottom: insets.bottom + spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeIn style={styles.header}>
            <Image
              source={logo}
              style={styles.logo}
              resizeMode="contain"
              tintColor="#FFFFFF"
              accessibilityLabel="ALT University"
            />
            <AppText variant="largeTitle" style={styles.title} center>
              {title}
            </AppText>
            {subtitle ? (
              <AppText style={styles.subtitle} center>
                {subtitle}
              </AppText>
            ) : null}
          </FadeIn>

          <FadeIn delay={120} offset={24}>
            <View style={styles.card}>{children}</View>
          </FadeIn>

          {footer ? <FadeIn delay={200}>{footer}</FadeIn> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: '#040B16',
  },
  topBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 44,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: AUTH.glass,
    borderWidth: 1,
    borderColor: AUTH.glassBorder,
  },
  pillText: {
    color: AUTH.text,
    fontWeight: '700',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    width: 132,
    height: 76,
    marginBottom: spacing.sm,
  },
  title: {
    color: AUTH.text,
    fontWeight: '800',
  },
  subtitle: {
    color: AUTH.muted,
  },
  card: {
    borderRadius: radius.xl + 4,
    padding: spacing.lg - 4,
    gap: spacing.md,
    backgroundColor: AUTH.glass,
    borderWidth: 1,
    borderColor: AUTH.glassBorder,
  },
});
