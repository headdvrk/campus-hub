import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  createNavigationContainerRef,
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { RootStackParamList } from './src/types/navigation';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Баптаулар мен сақталған сессия жүктелгенше Splash көрсетіледі, кейін навигация
// тақырыптың түстерімен іске қосылады
function AppContent() {
  const { isReady, theme, colors } = useSettings();
  const auth = useAuth();

  if (!isReady || !auth.isReady) return <SplashScreen />;

  const base = theme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      // Жүйелік тақырып жолағы мөлдір емес, тұтас бет болуы керек
      card: colors.elevated,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      // Ешбір навигатор өңдей алмаған (қате) маршрут NotFound экранына бағытталады
      onUnhandledAction={() => {
        if (navigationRef.isReady()) navigationRef.navigate('NotFound');
      }}
    >
      <RootNavigator />
      {/* Кіру экрандары әрқашан қою фонда */}
      <StatusBar style={theme === 'dark' || !auth.profile ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
