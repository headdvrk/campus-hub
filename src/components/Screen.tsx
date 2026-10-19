import React, { ReactNode, useContext, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

import { useSettings } from '../context/SettingsContext';
import { spacing } from '../styles/theme';
import { useNativeDriver } from '../utils/motion';
import { AppText } from './AppText';
import { Backdrop } from './Backdrop';

// Үлкен тақырып пен айналдыру күйі: ScrollView де, FlatList те қолдана алады
// withBack: экранның үстінде «артқа» батырмасы тұрады, мазмұн сонша төмен түседі
export function useScrollHeader({ withBack = false } = {}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver }
  );

  return {
    scrollY,
    onScroll,
    contentStyle: {
      paddingTop: insets.top + spacing.sm + (withBack ? BACK_PILL_SPACE : 0),
      // Таб-бар төменгі шеттен көтеріліп қалқып тұрады, мазмұн оның астында қалмауы керек
      paddingBottom:
        (tabBarHeight ? tabBarHeight + Math.max(insets.bottom, spacing.sm + 4) : insets.bottom) +
        spacing.lg,
    },
  };
}

const BACK_PILL_SPACE = 44;

// Стек экрандарындағы қалқып тұратын шыны «артқа» батырмасы
export function BackPill({ onPress }: { onPress: () => void }) {
  const { colors, t } = useSettings();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={t('back')}
      style={({ pressed }) => [
        styles.backPill,
        { top: insets.top + 6, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <BlurView tint={colors.blurTint} intensity={60} style={[StyleSheet.absoluteFill, { backgroundColor: colors.bar }]} />
      <Ionicons name="chevron-back" size={20} color={colors.primary} />
      <AppText variant="subhead" color="primary" style={styles.backText}>
        {t('back')}
      </AppText>
    </Pressable>
  );
}

type LargeTitleProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  scrollY: Animated.Value;
};

// iOS "Large Title": жоғары тартқанда сәл кішірейеді
export function LargeTitle({ title, subtitle, right, scrollY }: LargeTitleProps) {
  const scale = scrollY.interpolate({
    inputRange: [-120, 0],
    outputRange: [1.12, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.largeTitle}>
      <Animated.View style={[styles.titleTexts, { transform: [{ scale }] }]}>
        {subtitle ? (
          <AppText variant="footnote" color="muted" style={styles.subtitle}>
            {subtitle.toUpperCase()}
          </AppText>
        ) : null}
        <AppText variant="largeTitle">{title}</AppText>
      </Animated.View>
      {right}
    </View>
  );
}

// Үлкен тақырып көрінбей кеткенде пайда болатын бұлдыр (blur) жолақ
export function CompactHeader({
  title,
  scrollY,
}: {
  title: string;
  scrollY: Animated.Value;
}) {
  const { colors } = useSettings();
  const insets = useSafeAreaInsets();
  const opacity = scrollY.interpolate({
    inputRange: [36, 64],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.compact, { height: insets.top + 44, opacity }]}
    >
      <BlurView
        tint={colors.blurTint}
        intensity={90}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.bar }]}
      />
      <View style={[styles.compactInner, { paddingTop: insets.top }]}>
        <AppText variant="headline" numberOfLines={1}>
          {title}
        </AppText>
      </View>
      <View style={[styles.hairline, { backgroundColor: colors.separator }]} />
    </Animated.View>
  );
}

type ScreenProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  onBack?: () => void;
};

// Үлкен тақырыбы бар, айналдырылатын стандарт экран
export function Screen({ title, subtitle, right, children, contentStyle, onBack }: ScreenProps) {
  const { colors } = useSettings();
  const header = useScrollHeader({ withBack: Boolean(onBack) });

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Backdrop />
      <Animated.ScrollView
        onScroll={header.onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.content, header.contentStyle, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        <LargeTitle
          title={title}
          subtitle={subtitle}
          right={right}
          scrollY={header.scrollY}
        />
        {children}
      </Animated.ScrollView>
      <CompactHeader title={title} scrollY={header.scrollY} />
      {onBack ? <BackPill onPress={onBack} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  largeTitle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  titleTexts: {
    flex: 1,
    transformOrigin: 'left',
  },
  subtitle: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  compact: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  compactInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPill: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 36,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  backText: {
    fontWeight: '600',
  },
  hairline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
  },
});
