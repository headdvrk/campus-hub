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
import { ServicesScreen } from '../screens/ServicesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { tapFeedback } from '../utils/motion';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, [IconName, IconName]> = {
  Home: ['home', 'home-outline'],
  Services: ['grid', 'grid-outline'],
  Profile: ['person-circle', 'person-circle-outline'],
  Settings: ['settings', 'settings-outline'],
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
        // iOS-тағыдай мөлдір, артындағы мазмұнды бұлдыратып көрсететін таб-бар
        tabBarStyle: {
          position: 'absolute',
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
          backgroundColor: 'transparent',
          borderTopColor: colors.separator,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint={colors.blurTint}
            intensity={Platform.OS === 'android' ? 60 : 90}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.card + (Platform.OS === 'android' ? 'F2' : 'B8') },
            ]}
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
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: t('tabServices') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('tabProfile') }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('tabSettings') }}
      />
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
