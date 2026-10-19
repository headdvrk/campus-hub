import { AccessibilityInfo, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Браузерде native driver жоқ, сондықтан анимация JS арқылы жүреді
export const useNativeDriver = Platform.OS !== 'web';

// Жүйедегі «Қозғалысты азайту» баптауы: қосулы болса, пайда болу анимациялары өткізіледі
export let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled()
  .then((value) => {
    reduceMotion = value;
  })
  .catch(() => {});
AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
  reduceMotion = value;
});

// Батырма басылғандағы жеңіл діріл (браузерде өшірулі)
export function tapFeedback() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function selectionFeedback() {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}

export function errorFeedback() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
    () => {}
  );
}
