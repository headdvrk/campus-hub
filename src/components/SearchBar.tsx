import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSettings } from '../context/SettingsContext';
import { radius, spacing, typography } from '../styles/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

// iOS стиліндегі іздеу өрісі: тазалау батырмасы мәтін болғанда ғана көрінеді
export function SearchBar({ value, onChangeText, placeholder }: Props) {
  const { colors, scale, t } = useSettings();
  const clearLabel = t('clearSearch');

  return (
    <View style={[styles.search, { backgroundColor: colors.input }]}>
      <Ionicons name="search" size={18} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={placeholder}
        accessibilityRole="search"
        style={[
          styles.searchInput,
          { color: colors.text, fontSize: scale(typography.body.size) },
        ]}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={13}
          accessibilityRole="button"
          accessibilityLabel={clearLabel}
        >
          <Ionicons name="close-circle" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md - 2,
    paddingHorizontal: 10,
    minHeight: 40,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
  },
});
