import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList } from '../types/navigation';
import { IconName } from '../types/service';
import { HomeScreen } from '../screens/HomeScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../styles/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, [IconName, IconName]> = {
  Home: ['home', 'home-outline'],
  Services: ['grid', 'grid-outline'],
  Profile: ['person', 'person-outline'],
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = tabIcons[route.name];
          return (
            <Ionicons name={focused ? active : inactive} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Басты' }} />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: 'Сервистер' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
}
