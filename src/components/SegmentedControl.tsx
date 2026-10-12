import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { selectionFeedback, useNativeDriver } from '../utils/motion';
import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

const PADDING = 2;

// iOS UISegmentedControl: таңдалған нұсқаға жылжитын анимациялы "бегунок"
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const { colors } = useSettings();
  const [width, setWidth] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const position = useRef(new Animated.Value(selectedIndex)).current;
  const segmentWidth = width > 0 ? (width - PADDING * 2) / options.length : 0;

  useEffect(() => {
    Animated.spring(position, {
      toValue: selectedIndex,
      useNativeDriver,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [position, selectedIndex]);

  return (
    <View
      style={[styles.track, { backgroundColor: colors.input }]}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.thumb,
            {
              width: segmentWidth,
              backgroundColor: colors.segmentThumb,
              transform: [
                { translateX: Animated.multiply(position, segmentWidth) },
              ],
            },
          ]}
        />
      ) : null}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={styles.segment}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => {
              if (selected) return;
              selectionFeedback();
              onChange(option.value);
            }}
          >
            <AppText
              variant="subhead"
              center
              numberOfLines={1}
              style={{ fontWeight: selected ? '600' : '500' }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: PADDING,
    minHeight: 36,
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
});
