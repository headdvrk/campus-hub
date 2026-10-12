import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useSettings } from '../context/SettingsContext';
import { MainTabs } from './MainTabs';
import { LoginScreen } from '../screens/LoginScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { t } = useSettings();

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params?.title ?? t('detailsDefaultTitle'),
          headerBackTitle: t('back'),
        })}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: t('notFoundHeader') }}
      />
    </Stack.Navigator>
  );
}
