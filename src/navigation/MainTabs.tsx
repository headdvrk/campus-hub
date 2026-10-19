import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTabParamList } from '../types/navigation';
import { IconName } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { HomeScreen } from '../screens/HomeScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { tapFeedback } from '../utils/motion';
import { spacing } from '../styles/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TAB_BAR_HEIGHT = 64;

const tabIcons: Record<keyof MainTabParamList, [IconName, IconName]> = {
  Home: ['home', 'home-outline'],
  Journal: ['school', 'school-outline'],
  Schedule: ['calendar', 'calendar-outline'],
  News: ['newspaper', 'newspaper-outline'],
  Profile: ['person-circle', 'person-circle-outline'],
};

export function MainTabs() {
  const { colors, t } = useSettings();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenListeners={{ tabPress: () => tapFeedback() }}
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        // iOS 26 стиліндегі қалқып тұратын шыны "капсула" таб-бар
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: spacing.md,
          bottom: Math.max(insets.bottom, spacing.sm + 4),
          height: TAB_BAR_HEIGHT,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: TAB_BAR_HEIGHT / 2,
          borderTopWidth: 1,
          borderWidth: 1,
          borderTopColor: colors.border,
          borderColor: colors.border,
          backgroundColor: 'transparent',
          overflow: 'hidden',
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint={colors.blurTint}
            intensity={Platform.OS === 'android' ? 60 : 80}
            experimentalBlurMethod="dimezisBlurView"
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.bar }]}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = tabIcons[route.name];
          return (
            <Ionicons name={focused ? active : inactive} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabHome') }} />
      <Tab.Screen name="Journal" component={JournalScreen} options={{ title: t('tabJournal') }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: t('tabSchedule') }} />
      <Tab.Screen name="News" component={NewsScreen} options={{ title: t('news') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('tabProfile') }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    flexShrink: 0,
  },
});
