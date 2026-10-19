import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { MainTabs } from './MainTabs';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SubjectScreen } from '../screens/SubjectScreen';
import { TranscriptScreen } from '../screens/TranscriptScreen';
import { NewsDetailsScreen } from '../screens/NewsDetailsScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Сессия бар-жоғына қарай экрандар жиыны ауысады: кіргенде немесе шыққанда
// навигация тарихы өздігінен тазаланады, "артқа" басып кіру бетіне қайту мүмкін емес
export function RootNavigator() {
  const { t } = useSettings();
  const { profile } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
      {profile ? (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false, animation: 'fade' }}
          />
          {/* Өз үлкен тақырыбы мен шыны «артқа» батырмасы бар экрандар */}
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Services" component={ServicesScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Subject" component={SubjectScreen} />
            <Stack.Screen name="Transcript" component={TranscriptScreen} />
          </Stack.Group>
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            // Details өз градиент тақырыбын және "артқа" батырмасын салады
            options={({ route }) => ({
              headerShown: false,
              title: route.params?.title ?? t('detailsDefaultTitle'),
            })}
          />
          <Stack.Screen
            name="NewsDetails"
            component={NewsDetailsScreen}
            options={{ title: t('newsDetailsTitle'), headerBackTitle: t('back') }}
          />
        </>
      ) : (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </Stack.Group>
      )}
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: t('notFoundHeader'), headerShadowVisible: false }}
      />
    </Stack.Navigator>
  );
}
