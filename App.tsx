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
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { RootStackParamList } from './src/types/navigation';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Баптаулар жүктелгенше Splash көрсетіледі, кейін навигация
// тақырыптың түстерімен іске қосылады
function AppContent() {
  const { isReady, theme, colors } = useSettings();

  if (!isReady) return <SplashScreen />;

  const base = theme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
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
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
