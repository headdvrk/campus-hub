import React, { ReactNode, useRef } from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  Animated,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { tapFeedback, useNativeDriver } from '../utils/motion';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  // Сыртқы Pressable стилі (мысалы, бағанда flex: 1)
  containerStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
  disabled?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
};

// Басқанда серіппе (spring) анимациясымен сәл кішірейетін батырма
export function PressableScale({
  children,
  onPress,
  style,
  containerStyle,
  scaleTo = 0.96,
  haptic = true,
  disabled,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityState,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver,
      speed: 40,
      bounciness: value === 1 ? 8 : 0,
    }).start();

  return (
    <Pressable
      onPress={() => {
        if (haptic) tapFeedback();
        onPress?.();
      }}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      disabled={disabled}
      style={containerStyle}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, ...accessibilityState }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
