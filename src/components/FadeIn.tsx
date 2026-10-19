import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

import { reduceMotion, useNativeDriver } from '../utils/motion';

type Props = {
  children: ReactNode;
  // Тізім элементтерінің кезекпен пайда болуы үшін кідіріс (мс)
  delay?: number;
  offset?: number;
  style?: StyleProp<ViewStyle>;
};

// Экран ашылғанда төменнен жоғары қарай ақырын пайда болу анимациясы
export function FadeIn({ children, delay = 0, offset = 14, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver,
    }).start();
  }, [progress, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [offset, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
