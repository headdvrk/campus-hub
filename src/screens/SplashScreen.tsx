import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { themes } from '../theme/themes';
import { useNativeDriver } from '../utils/motion';

// Баптаулар AsyncStorage-тан жүктелгенше көрсетіледі. Бұл сәтте тақырып пен
// тіл әлі белгісіз, сондықтан useSettings емес, тұрақты түстер қолданылады.
export function SplashScreen() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <LinearGradient
      colors={themes.light.hero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.Image
        source={require('../../assets/alt-logo.png')}
        resizeMode="contain"
        tintColor="#FFFFFF"
        accessibilityLabel="ALT University"
        style={[
          styles.logo,
          { transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }] },
        ]}
      />
      <View style={styles.titles}>
        <Text style={styles.title}>Campus Hub</Text>
        <Text style={styles.university}>ALT University</Text>
      </View>
      <View style={styles.loader}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  logo: {
    width: 160,
    height: 92,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#FFFFFF',
  },
  titles: {
    alignItems: 'center',
    gap: 4,
  },
  university: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  loader: {
    marginTop: 8,
  },
});
