import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList } from '../types/navigation';
import { IconName } from '../types/service';
import { useSettings } from '../context/SettingsContext';
import { HomeScreen } from '../screens/HomeScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, [IconName, IconName]> = {
  Home: ['home', 'home-outline'],
  Services: ['grid', 'grid-outline'],
  Profile: ['person', 'person-outline'],
  Settings: ['settings', 'settings-outline'],
};

export function MainTabs() {
  const { colors, t } = useSettings();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
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
        options={{ title: t('tabSettings'), headerShown: true }}
      />
    </Tab.Navigator>
  );
}
