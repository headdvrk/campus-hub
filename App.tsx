import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { RootStackParamList } from './src/types/navigation';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        // Ешбір навигатор өңдей алмаған (қате) маршрут NotFound экранына бағытталады
        onUnhandledAction={() => {
          if (navigationRef.isReady()) navigationRef.navigate('NotFound');
        }}
      >
        <RootNavigator />
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
