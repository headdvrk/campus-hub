import React, { ReactNode, useContext, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

import { useSettings } from '../context/SettingsContext';
import { spacing } from '../styles/theme';
import { useNativeDriver } from '../utils/motion';
import { AppText } from './AppText';

// Үлкен тақырып пен айналдыру күйі: ScrollView де, FlatList те қолдана алады
export function useScrollHeader() {
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
      paddingTop: insets.top + spacing.sm,
      paddingBottom: Math.max(tabBarHeight, insets.bottom) + spacing.lg,
    },
  };
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
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.background + 'B3' }]}
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
};

// Үлкен тақырыбы бар, айналдырылатын стандарт экран
export function Screen({ title, subtitle, right, children, contentStyle }: ScreenProps) {
  const { colors } = useSettings();
  const header = useScrollHeader();

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
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
  hairline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
  },
});
