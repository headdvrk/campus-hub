import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Браузерде native driver жоқ, сондықтан анимация JS арқылы жүреді
export const useNativeDriver = Platform.OS !== 'web';

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
